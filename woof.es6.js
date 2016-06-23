// saving Image because we will later overwrite Image with Woof.Image on the window
window.BrowserImage = Image;

function Woof({global = false, fullScreen = false, height = 500, width = 350} = {}) {
  if(window.global) throw new Error("You must turn off global mode in the Woof script tag if you want to create your own Woof object.")
  this.global = global;
  var thisContext = this.global ? window : this;

  thisContext.global = global;
  thisContext.sprites = [];
  thisContext.backdrop = undefined;
  thisContext.stopped = true;
  thisContext.debugColor = "black";
  thisContext.fullScreen = fullScreen;
  
  if (thisContext.fullScreen) {
    width = window.innerWidth;
    height = window.innerHeight;
    window.addEventListener("load", () => {
      document.body.style.margin = 0;
      document.body.style.padding = 0; 
    });
  } 
  
  thisContext._readys = [];
  thisContext.ready = (func) => {
    if (thisContext.stopped) {
      thisContext._readys.push(func);
    } else {
      func();
    }
  }
  thisContext._runReadys = () => {
    thisContext.stopped = false;
    thisContext._readys.forEach(func => { func() });
    thisContext._readys = [];
  };
  
  window.addEventListener("load", () => {
    thisContext._mainDiv = document.createElement("div");
    document.body.appendChild(thisContext._mainDiv);
    thisContext._mainDiv.id = "project";
    thisContext._mainDiv.style.position = "relative";
    
    thisContext._spriteCanvas = document.createElement("canvas");
    thisContext._mainDiv.appendChild(thisContext._spriteCanvas);
    thisContext._spriteCanvas.id = "sprites";
    thisContext._spriteCanvas.width = width;
    thisContext._spriteCanvas.height = height;
    thisContext._spriteCanvas.style.zIndex = 3;
    thisContext._spriteCanvas.style.position = "absolute";
    
    
    thisContext._penCanvas = document.createElement("canvas");
    thisContext._mainDiv.appendChild(thisContext._penCanvas);
    thisContext._penCanvas.id = "pen";
    thisContext._penCanvas.width = width;
    thisContext._penCanvas.height = height;
    thisContext._penCanvas.style.zIndex = 2;
    thisContext._penCanvas.style.position = "absolute";
    
    thisContext._backdropCanvas = document.createElement("canvas");
    thisContext._mainDiv.appendChild(thisContext._backdropCanvas);
    thisContext._backdropCanvas.id = "backdrop";
    thisContext._backdropCanvas.width = width;
    thisContext._backdropCanvas.height = height;
    thisContext._backdropCanvas.style.zIndex = 1;
    thisContext._backdropCanvas.style.position = "absolute";
  
    thisContext._spriteContext = thisContext._spriteCanvas.getContext("2d");
    thisContext._penContext = thisContext._penCanvas.getContext("2d");
    thisContext._backdropContext = thisContext._backdropCanvas.getContext("2d");
    
    thisContext._runReadys();
  });
  
  thisContext.setBackdropSize = (width, height) => {
    if (thisContext.fullScreen) {
      throw Error("You cannot manually set the backdrop size in full-screen mode. You can full-screen mode off with: fullScreen = false.")
    } else {
     thisContext._setCanvasSize(width, height); 
    }
  }
  
  thisContext._setCanvasSize = (width, height) => {
    thisContext.height = height;
    thisContext.width = width;
    thisContext.minX = -thisContext.width / 2;
    thisContext.maxX = thisContext.width / 2;
    thisContext.minY = -thisContext.height / 2;
    thisContext.maxY = thisContext.height / 2;
    
    thisContext.ready(() => {
      thisContext._spriteCanvas.width = thisContext.width;
      thisContext._spriteCanvas.height = thisContext.height;
      
      var penData = thisContext._penContext.getImageData(0, 0, width, height);
      thisContext._penCanvas.width = thisContext.width;
      thisContext._penCanvas.height = thisContext.height;
      thisContext._penContext.putImageData(penData, 0, 0);
      
      thisContext._backdropCanvas.width = thisContext.width;
      thisContext._backdropCanvas.height = thisContext.height;
      setTimeout(thisContext._renderBackdrop);
    })
  };
  thisContext._setCanvasSize(width, height);
  window.addEventListener("resize", () => {
    if (thisContext.fullScreen) {
      thisContext._setCanvasSize(window.innerWidth,  window.innerHeight);
    }
  });
  
  thisContext.bounds = () => {
    return {left: thisContext.minX, right: thisContext.maxX, bottom: thisContext.minYm, top: thisContext.maxY}
  };
  
  thisContext.randomX = () => {
    return Woof.prototype.randomInt(thisContext.minX, thisContext.maxX);
  };
  
  thisContext.randomY = () => {
    return Woof.prototype.randomInt(thisContext.minY, thisContext.maxY);
  };
  
  thisContext.addText = options => {
    var sprite = new Woof.prototype.Text(thisContext, options);
    thisContext.sprites.push(sprite);
    return sprite;
  };
  
  thisContext.addCircle = options => {
    var sprite = new Woof.prototype.Circle(thisContext, options);
    thisContext.sprites.push(sprite);
    return sprite;
  };
  
  thisContext.addRectangle = options => {
    var sprite = new Woof.prototype.Rectangle(thisContext, options);
    thisContext.sprites.push(sprite);
    return sprite;
  };
  
  thisContext.addLine = options => {
    var sprite = new Woof.prototype.Line(thisContext, options);
    thisContext.sprites.push(sprite);
    return sprite;
  };
  
  thisContext.addImage = options => {
    var sprite = new Woof.prototype.Image(thisContext, options);
    thisContext.sprites.push(sprite);
    return sprite;
  };
  
  thisContext._renderBackdrop = () => {
    thisContext._backdropContext.clearRect(0, 0, thisContext.width, thisContext.height);
    if (thisContext.backdrop instanceof BrowserImage) {
      thisContext._backdropContext.drawImage(thisContext.backdrop, 0, 0);
    } else if (typeof thisContext.backdrop == "string"){
      thisContext._backdropContext.save();
      thisContext._backdropContext.fillStyle=thisContext.backdrop;
      thisContext._backdropContext.fillRect(0, 0, thisContext.width, thisContext.height);
      thisContext._backdropContext.restore();
    }
  };
  
  thisContext.setBackdropURL = function(url){    
    var backdrop = new BrowserImage();
    backdrop.src = url;
    thisContext.backdrop = backdrop;
    thisContext.backdrop.onload = function() { thisContext.ready(thisContext._renderBackdrop); };
  };

  thisContext.setBackdropColor = function(color){    
    thisContext.backdrop = color;
    thisContext.ready(thisContext._renderBackdrop);
  };
  
  thisContext.firebaseConfig = config => {
    thisContext.firebase = new Woof.prototype.Firebase(config);
    thisContext.getCloud = thisContext.firebase.getCloud;
    thisContext.setCloud = thisContext.firebase.setCloud;
  };
  
  // thisContext.freeze = () => {
  //   if (thisContext.stopped) { return }
  //   thisContext._render();
  //   thisContext.stopped = true;
  // };
  // thisContext.defrost = () => {
  //   if (!thisContext.stopped) { return }
  //   thisContext.stopped = false;
  //   thisContext._render();
  // };
  
  thisContext.translateToCenter = (x, y) => {
    return [(x - thisContext.maxX) - thisContext._spriteCanvas.offsetLeft, (thisContext.maxY - y) + thisContext._spriteCanvas.offsetTop];
  };
  thisContext.translateToCanvas = (x, y) => {
    return [(x + thisContext.maxX) - thisContext._spriteCanvas.offsetLeft, (thisContext.maxY - y) + thisContext._spriteCanvas.offsetTop];
  };
  
  thisContext.mouseDown = false;
  thisContext.mouseX = 0;
  thisContext.mouseY = 0;
  thisContext.pMouseX = 0;
  thisContext.pMouseY = 0;
  thisContext.mouseXSpeed = 0;
  thisContext.mouseYSpeed = 0;
  thisContext.keysDown = [];
  thisContext._onClicks = [];
  thisContext.onClick = func => { thisContext._onClicks.push(func); };
  thisContext.ready(() => {
    thisContext._spriteCanvas.addEventListener("mousedown", (event) => {
      thisContext.mouseDown = true;
      [thisContext.mouseX, thisContext.mouseY] = thisContext.translateToCenter(event.clientX, event.clientY);
    });
    thisContext._spriteCanvas.addEventListener("mouseup", (event) => {
      thisContext.mouseDown = false;
      [thisContext.mouseX, thisContext.mouseY] = thisContext.translateToCenter(event.clientX, event.clientY);
    });
    thisContext._spriteCanvas.addEventListener("touchstart", (event) => {
      thisContext.mouseDown = true;
      [thisContext.mouseX, thisContext.mouseY] = thisContext.translateToCenter(event.targetTouches[0].clientX, event.targetTouches[0].clientY);
    });
    thisContext._spriteCanvas.addEventListener("touchend", (event) => {
      // for some reason touchend events are firing too quickly
      // and are not getting picked up in 40 ms every-if's
      // so thisContext setTimeout slows things down just enouch so
      // touch events mirror mouse events
      setTimeout(() => {thisContext.mouseDown = false;}, 0);
    });
    thisContext._spriteCanvas.addEventListener("mousemove", (event) => { 
      [thisContext.mouseX, thisContext.mouseY] = thisContext.translateToCenter(event.clientX, event.clientY);
    });
    thisContext._spriteCanvas.addEventListener("touchmove", event => {
      [thisContext.mouseX, thisContext.mouseY] = thisContext.translateToCenter(event.targetTouches[0].clientX, event.targetTouches[0].clientY);
      event.preventDefault();
    });
    
    document.body.addEventListener("keydown", event => {
      var key = Woof.prototype.keyCodeToString(event.keyCode);
      if (!thisContext.keysDown.includes(key)){
       thisContext.keysDown.push(key); 
      }
    });
    document.body.addEventListener("keyup", event => {
      var key = Woof.prototype.keyCodeToString(event.keyCode);
      if (thisContext.keysDown.includes(key)){
        thisContext.keysDown.splice(thisContext.keysDown.indexOf(key), 1);
      }
    });
    thisContext._onClickHandler = event => {
      var [mouseX, mouseY] = thisContext.translateToCenter(event.clientX, event.clientY);
      thisContext._onClicks.forEach((func) => {func(mouseX, mouseY)});
    };
    thisContext._spriteCanvas.addEventListener("mousedown", thisContext._onClickHandler);
  })

  thisContext._everys = [];
  thisContext.every = (time, units, func) => {
    func();
    thisContext._everys.push(setInterval(func, Woof.prototype.unitsToMiliseconds(time, units)));
  };
  thisContext.forever = (func) => {
    thisContext.repeatUntil(() => false, func);
  };
  
  thisContext.when = (condition, func) => {
    thisContext.forever(() => {
      var cond;
      try {
        cond = condition();
      } catch (e) {
        console.error("Bad condition in when: " + condition);
        throw e;
      }
      if (cond) {
        func();
      };
    });
  };
  
  thisContext._repeats = [];
  thisContext.repeat = (times, func, after) => {
    thisContext._repeats.push(new Woof.prototype.Repeat(times, func, after));
  };
  thisContext.repeatUntil = (condition, func, after) => {
    thisContext._repeats.push(new Woof.prototype.RepeatUntil(condition, func, after));
  };
  thisContext._runRepeats = () => {
    thisContext._repeats.forEach(repeat => {
      repeat.next();
    });
    thisContext._repeats = thisContext._repeats.filter(repeat => {return !repeat.done});
  };
  
  thisContext._afters = [];
  thisContext.after = (time, units, func) => {
    thisContext._afters.push(setTimeout(func, Woof.prototype.unitsToMiliseconds(time, units)));
  };
  
  thisContext.debugText = [];
  thisContext.addDebug = (display, func) => {
    if (typeof func != 'function') { throw Error("The second argument to addDebug must be a function"); }
    var text = thisContext.addText({x: thisContext.minX + 5, y: thisContext.minY + (12 * (thisContext.debugText.length+1)), color: thisContext.debugColor, text: () => display + ": " + JSON.stringify(func()), textAlign: "left"});
    thisContext.debugText.push(text);
  }
  thisContext._renderDebug = () => {
    thisContext.debugText.forEach(text => text.sendToFront());
  };
  
  thisContext._renderSprites = () => {
    thisContext._spriteContext.clearRect(0, 0, thisContext.width, thisContext.height);
    thisContext.sprites.forEach((sprite) => {
      sprite._render(thisContext._spriteContext);
    });
  };
  
  thisContext.clearPen = () => {
    thisContext._penContext.clearRect(0, 0, thisContext.width, thisContext.height);
  }
  
  thisContext._calculateMouseSpeed = () => {
    thisContext.mouseXSpeed = thisContext.mouseX - thisContext.pMouseX;
    thisContext.mouseYSpeed = thisContext.mouseY - thisContext.pMouseY;
    [thisContext.pMouseX, thisContext.pMouseY] = [thisContext.mouseX, thisContext.mouseY];
  };
  
  thisContext._render = () => {
    thisContext._runRepeats();
    thisContext._calculateMouseSpeed();
    thisContext.renderInterval = window.requestAnimationFrame(thisContext._render);
    if (thisContext.stopped) { return; }
    thisContext._renderSprites();
    thisContext._renderDebug();
  };
  thisContext.ready(thisContext._render);
};

Woof.prototype.Sprite = function(project, {x = 0, y = 0, angle = 0, rotationStyle = "ROTATE", showing = true, penColor = "black", penWidth = 1} = {}) {
  this.project = project.global ? window : project;
  this.x = x;
  this.y = y;
  this.angle = angle;
  this.rotationStyle = rotationStyle;
  this.showing = showing;
  this.penDown = false;
  this.penColor = penColor;
  this.penWidth = penWidth;
  this.deleted = false;
  
  this.toJSON = () => {
    return {x: this.x, y: this.y, angle: this.angle, rotationStyle: this.rotationStyle, showing: this.showing, penDown: this.penDown, penColor: this.penColor, penWidth: this.penWidth, deleted: this.deleted};
  };
  
  [this.lastX, this.lastY] = [this.x, this.y];
  this.trackPen = () => {
    if (this.penDown) {
      if(this.lastX != this.x || this.lastY != this.y) {
        this.project._penContext.save();
        this.project._penContext.beginPath();
        this.project._penContext.moveTo(...this.project.translateToCanvas(this.lastX, this.lastY));
        this.project._penContext.lineTo(...this.project.translateToCanvas(this.x, this.y));
        this.project._penContext.lineCap = "round";
        this.project._penContext.strokeStyle = this.penColor;
        this.project._penContext.lineWidth = this.penWidth;
        this.project._penContext.stroke();
        this.project._penContext.restore();
      }
    }
    [this.lastX, this.lastY] = [this.x, this.y];
  };
  setInterval(this.trackPen, 0);
  
  this._render = function(context) {
    if (this.showing && !this.deleted && this.overlap(this.project.bounds())) {
      context.save();
      context.translate(this.canvasX(), this.canvasY());
      if (this.rotationStyle == "ROTATE") {
        context.rotate(-this.radians());
      } else if (this.rotationStyle == "NO ROTATE"){
          // no rotate
      } else if (this.rotationStyle == "ROTATE LEFT RIGHT"){
        if (this.angle%360 >= 90 && this.angle%360 < 270){
          context.translate(this.width, 0);
          context.scale(-1, 1);
        } else if (this.angle%360 >=0 && this.angle%360 < 90 || this.angle%360 <= 360 && this.angle%360 >=270){
          // no rotate
        }
      }
      
      if (this instanceof Woof.prototype.Image) {
        this.imageRender(context);
      } else if (this instanceof Woof.prototype.Text) {
        this.textRender(context);
      } else if (this instanceof Woof.prototype.Circle) {
        this.circleRender(context);
      } else if (this instanceof Woof.prototype.Rectangle) {
        this.rectangleRender(context);
      } else if (this instanceof Woof.prototype.Line) {
        this.lineRender(context);
      }
      context.restore();
    }
  };
  
  this.distanceTo = function distanceTo(xGiven, yGiven){
    if (arguments.length === 1){
      var x = this.x - xGiven.x;
      var y = this.y - xGiven.y;
      return Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
    }
    if (arguments.length === 2) {
      var x = this.x - xGiven;
      var y = this.y - yGiven;
      return Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
    }
  };
  
  this.move = function(steps){
    this.x += steps * Math.cos(this.radians());
    this.y += steps * Math.sin(this.radians());
  };
  
  this.setRotationStyle = style => {
    if (style == "ROTATE"){
      this.rotationStyle = "ROTATE";
    } else if (style == "NO ROTATE") {
      this.rotationStyle = "NO ROTATE";
    } else if (style == "ROTATE LEFT RIGHT") {
      this.rotationStyle = "ROTATE LEFT RIGHT";
    } else {
      throw Error("Unrecognized rotation style: " + style);
    }
  };
  
  this.radians = () => {
    return this.angle * Math.PI / 180;
  };
  
  this.canvasX = () => {
    return this.x + this.project.maxX;
  };
  
  this.canvasY = () => {
    return this.project.maxY - this.y;
  };
  
  this.bounds = () => {
    // TODO account for rotation
    var halfWidth = (this.width() / 2);
    var halfHeight = (this.height() / 2);
    
    var left = this.x - halfWidth;
    var right = this.x + halfWidth;
    var bottom = this.y - halfHeight;
    var top = this.y + halfHeight;
    return {left: left, right: right, top: top, bottom: bottom};
  };
  
  this.collisionCanvas = document.createElement('canvas');
  this.collisionContext = this.collisionCanvas.getContext('2d');

  this.touching = sprite => {
    if (this.deleted || !this.showing) { return false; }
    if (sprite.deleted || !sprite.showing) { return false; }
    
    var r1 = this.bounds();
    var r2 = sprite.bounds();
    if (!this.overlap(r2)) { return false; }
    
    var left = Math.min(r1.left, r2.left);
    var top = Math.max(r1.top, r2.top);
    var right = Math.max(r1.right, r2.right);
    var bottom = Math.min(r1.bottom, r2.bottom);
    
    this.collisionCanvas.width = this.project.width;
    this.collisionCanvas.height = this.project.height;

    this._render(this.collisionContext);
    this.collisionContext.globalCompositeOperation = 'source-in';
    sprite._render(this.collisionContext);
    var [canvasLeft, canvasTop] = this.project.translateToCanvas(left, top) 

    try {
      var data = this.collisionContext.getImageData(canvasLeft, canvasTop, right - left, top - bottom).data;
    } catch (e) {
      if (e instanceof DOMException) {
        console.warn("You have an image at an untrusted URL. Consider uploading to Imgur and using https.")
        // bounds are overlapping and we can't get canvas data, so return true
        return true;
      }
    }
  
    var length = (right - left) * (top - bottom) * 4;
    for (var j = 0; j < length; j += 4) {
      if (data[j + 3]) {
        return true;
      }
    }
    return false;
    
  };
  
  this.overlap = ({left, right, top, bottom}) => {
    var r1 = this.bounds();
    return !(left > r1.right || right < r1.left || top < r1.bottom || bottom > r1.top);
  }
  
  this.over = (x, y) => {
    if (this.deleted || !this.showing) { return false; }
    
    var r1 = this.bounds();
    var belowTop = y <= r1.top
    var aboveBottom = y >= r1.bottom;
    var rightLeft = x >= r1.left;
    var leftRight = x <= r1.right;
    return belowTop && aboveBottom && rightLeft && leftRight;
  };
  
  this.mouseOver = function() {
    if (this.deleted || !this.showing) { return false; }
    
    return this.over(this.project.mouseX, this.project.mouseY);
  };
  
  this.mouseDown = () => {
    if (this.deleted || !this.showing) { return false; }
    
    return this.mouseOver() && project.mouseDown;
  };
  
  this.turnLeft = (degrees) => {
    this.angle += degrees;
  };
  
  this.turnRight = (degrees) => {
    this.angle -= degrees;
  };
  
  this.sendToBack = () => {
    var sprites = this.project.sprites;
    sprites.splice(0, 0, sprites.splice(sprites.indexOf(this), 1)[0]);
  };
  
  this.sendToFront = () => {
    var sprites = this.project.sprites;
    sprites.splice(sprites.length, 0, sprites.splice(sprites.indexOf(this), 1)[0]);
  };
  
  this.pointTowards = (x2,y2) => {
    this.angle = Math.atan2(y2 - this.y, x2 - this.x) * 180 / Math.PI;
  };
  
  this.height = () => {
    throw Error("Implemented in subclass");
  };
  
  this.width = () => {
    throw Error("Implemented in subclass");
  };
  
  this._onClicks = [];
  this.onClick = func => { this._onClicks.push(func); };
  this._onClickHandler = event => {
    var [mouseX, mouseY] = this.project.translateToCenter(event.clientX, event.clientY);
    if (this.showing && this.over(mouseX, mouseY)){
      this._onClicks.forEach((func) => {func(mouseX, mouseY)});
    }
  };
  this.project.ready(() => {
    this.project._spriteCanvas.addEventListener("mousedown", this._onClickHandler);
  });
  
  this.delete = () => {
    this.showing = false;
    this.deleted = true;
    if (this.project.sprites.includes(this)){
      this.project.sprites.splice(this.project.sprites.indexOf(this), 1);
      this.project._spriteCanvas.removeEventListener("mousedown", this._onClickHandler);
    }
  };
};

Woof.prototype.Text = function(project, {text = "Text", size = 12, color = "black", fontFamily = "arial", textAlign = "center"} = {}) {
  Woof.prototype.Sprite.call(this, project, arguments[1]);
  this.text = text;
  this.size = size;
  this.color = color;
  this.fontFamily = fontFamily;
  this.textAlign = textAlign;
  
  this.width = () => {
    var width;
    this._applyInContext(() => {
      width = this.project._spriteContext.measureText(this.text).width;
    });
    return width;
  };
  
  this.height = () => {
    var height;
    this._applyInContext(() => {
      height = this.project._spriteContext.measureText("M").width;
    });
    return height;
  };
  
  this._applyInContext = (func) => {
    this.project._spriteContext.save();
    
    this.project._spriteContext.font = this.size + "px " + this.fontFamily;
    this.project._spriteContext.fillStyle = this.color;
    this.project._spriteContext.textAlign = this.textAlign;
    
    func();
    
    this.project._spriteContext.restore();
  };
  
  this.textRender = (context) => {
    this._applyInContext(() => {
      var text;
      if (typeof(this.text) == "function"){
        try { text = this.text(); } catch (e) { console.error("Error with text function: '" + this.text + "'"); throw e; }
      } else {
        text = this.text;
      }
      context.fillText(text, 0, 0);
    });
  };
};

Woof.prototype.Circle = function(project, {radius = 10, color = "black"} = {}) {
  Woof.prototype.Sprite.call(this, project, arguments[1]);
  this.radius = radius;
  this.color = color;
  
  this.width = () => {
    return 2 * this.radius;
  };
  
  this.height = () => {
    return 2 * this.radius;
  };
  
  this.circleRender = (context) => {
    context.beginPath();
    context.arc(0, 0, this.radius, 0, 2*Math.PI);
    context.fillStyle=this.color;
    context.fill();
  };
};

Woof.prototype.Rectangle = function(project, {rectangleHeight = 10, rectangleWidth = 10, color = "black"} = {}) {
  Woof.prototype.Sprite.call(this, project, arguments[1]);
  this.rectangleHeight = rectangleHeight;
  this.rectangleWidth = rectangleWidth;
  this.color = color;
  
  this.width = () => {
    return this.rectangleWidth;
  };
  
  this.height = () => {
    return this.rectangleHeight;
  };
  
  this.rectangleRender = (context) => {
    context.fillStyle=this.color;
    context.fillRect(-this.width() / 2, -this.height() / 2, this.width(), this.height());
  };
};

Woof.prototype.Line = function(project, {lineWidth = 1, x1 = 10, y1 = 10, color = "black"} = {}) {
  Woof.prototype.Sprite.call(this, project, arguments[1]);
  this.x1 = x1;
  this.y1 = y1;
  this.color = color;
  this.lineWidth = lineWidth;
  
  this.width = () => {
    return this.lineWidth;
  };
  
  this.height = () => {
    return Math.sqrt((Math.pow((this.x - this.x1), 2)) + (Math.pow((this.y - this.y1), 2)));
  };
  
  this.lineRender = (context) => {
    context.beginPath();
    context.moveTo(0, 0);
    context.lineTo(this.x1 - this.x, -this.y1 + this.y);
    context.strokeStyle = color;
    context.lineWidth = lineWidth;
    context.stroke();
  };
};

Woof.prototype.Image = function(project, {url = "http://www.loveyourdog.com/image3.gif", imageHeight, imageWidth} = {}) {
  Woof.prototype.Sprite.call(this, project, arguments[1]);
  this.imageHeight = imageHeight;
  this.imageWidth = imageWidth;
  
  this.setImageURL = function(url){    
    this.image = new window.BrowserImage();
    this.image.crossOrigin = "Anonymous"
    this.image.src = url;
    this.image.addEventListener('error', e => {
        e.preventDefault(); 
        this.image = new window.BrowserImage();
        this.image.src = url;
    });
  };
  this.setImageURL(url);

  this.width = () => {
    return this.imageWidth || this.image.width;
  };

  this.height = () => {
    return this.imageHeight || this.image.height;
  };
  
  this.imageRender = (context) => {
    context.drawImage(this.image, -this.width() / 2, -this.height() / 2, this.width(), this.height());
  };
};

Woof.prototype.Repeat = function(times, func, after) {
  this.func = func;
  this.times = times;
  this.done = false;
  
  this.next = () => {
    if (this.done){
      return;
    }
    if (this.times <= 0){
      this.done = true;
      if (after) { after(); }
      return;
    } else {
      this.func();
      this.times--;
    }
  };
};

Woof.prototype.RepeatUntil = function(condition, func, after){
  // TODO if (typeof condition !== "string") { throw Error("You must give repeatUntil a string condition in quotes. You gave it: " + condition); }
  this.func = func;
  this.condition = condition;
  this.done = false;
  
  this.next = () => {
    if (this.done){
      return;
    }
    var cond;
    try {
      cond = this.condition();
    } catch (e) {
      console.error("Error in Repeat Until condition");
      throw e;
    }
    
    if (cond){
      this.done = true;
      if (after) { after(); }
      return;
    } else {
      this.func();
    }
  };
};

Woof.prototype.Firebase = function(config){
  this.data = {};
  
  this.loadFirebaseLibrary = callback => {
    var lib = document.createElement("script");
    lib.type = "text/javascript";
    lib.src = "https://www.gstatic.com/firebasejs/live/3.0/firebase.js";
    lib.onload = callback;
    document.body.appendChild(lib);
  };
  
  this.loadFirebaseLibrary(() => {
    firebase.initializeApp(config);
    firebase.database().ref().on('value', snapshot => {
      this.data = snapshot.val() || {};
    });
  });
  
  this.setCloud = (key, val) => {
    firebase.database().ref().child("/" + key).set(val);
  };
  
  this.getCloud = (key, defaultVal) => {
    return this.data[key] || defaultVal;
  };
};

Woof.prototype.keyCodeToString = keyCode => {
  if (keyCode == 38) {
    return "UP";
  }
  else if (keyCode == 37){
    return "LEFT";
  }
  else if (keyCode == 39){
    return "RIGHT";
  }
  else if (keyCode == 40){
    return "DOWN";
  }
  else {
    return String.fromCharCode(keyCode);
  }
};

Woof.prototype.unitsToMiliseconds = (time, units) => {
  if (units == "milliseconds" || units == "millisecond"){
    return time;
  } else if (units == "miliseconds" || units == "milisecond"){
    return time;
  } else if (units == "seconds" || units == "second"){
    return time * 1000;
  } else if (units == "minutes" || units == "minute"){
    return time * 1000 * 60;
  } else {
    throw Error("Unrecognized Time");
  }
};

Woof.prototype.randomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

Woof.prototype.dayOfMonth = () =>{
  var date = new Date();
  return date.getDate();
};

Woof.prototype.dayOfWeek = () => {
  var date = new Date();
  var day = date.getDay();
  if (day === 0){
    return "Sunday";
  }
  else if (day == 1){
    return "Monday";
  }
  else if (day == 2){
    return "Tuesday";
  }
  else if (day == 3){
    return "Wednesday";
  }
  else if (day == 4){
    return "Thursday";
  }
  else if (day == 5){
    return "Friday";
  }
  else if (day == 6){
    return "Saturday";
  }
};

Woof.prototype.hourMilitary =  () => {
  var date = new Date();
  return date.getHours();
};

Woof.prototype.hour = () => {
  var date = new Date();
  var hour = date.getHours();
  return hour <= 12 ? hour : hour - 12;
};

Woof.prototype.minute =  () => {
  var date = new Date();
  return date.getMinutes();
};

Woof.prototype.second = () => {
  var date = new Date();
  return date.getSeconds();
};

Woof.prototype.randomColor = function(){
  return "rgb(" + Woof.randomInt(0, 255) + ", " + Woof.randomInt(0, 255) + ", " + Woof.randomInt(0, 255)+ ")";
}

Woof.prototype.RIGHT = 0;
Woof.prototype.LEFT = 180;
Woof.prototype.UP = 90;
Woof.prototype.DOWN = 270;

Woof.prototype.extend = function(a, b){
  for(var key in b) {
    a[key] = b[key];
  }
  return a;
};

if (JSON.parse(document.currentScript.getAttribute('global'))) { 
  Woof.prototype.extend(window, new Woof({global: true, fullScreen: true}));
}