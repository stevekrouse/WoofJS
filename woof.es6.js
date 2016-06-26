// saving Image because we will later overwrite Image with Woof.Image on the window
window.BrowserImage = Image;

class Woof {
  constructor({global = false, fullScreen = false, height = 500, width = 350} = {}) {
    if(window.global) throw new Error("You must turn off global mode in the Woof script tag if you want to create your own Woof object.")
    this.global = global;
    this.context = this.global ? window : this;

    this.context.global = global;
    this.context.sprites = [];
    this.context.backdrop = undefined;
    this.context.stopped = true;
    this.context.debugColor = "black";
    
    this.context._readys = [];
  
    this.context.fullScreen = fullScreen;
    if (this.context.fullScreen) {
      width = window.innerWidth;
      height = window.innerHeight;
      window.addEventListener("load", () => {
        document.body.style.margin = 0;
        document.body.style.padding = 0; 
      });
      window.addEventListener("resize", () => {
        this.context._setCanvasSize(window.innerWidth,  window.innerHeight);
      });
    }
    window.addEventListener("load", () => {
      this.context._mainDiv = document.createElement("div");
      document.body.appendChild(this.context._mainDiv);
      this.context._mainDiv.id = "project";
      this.context._mainDiv.style.position = "relative";
      
      this.context._spriteCanvas = document.createElement("canvas");
      this.context._mainDiv.appendChild(this.context._spriteCanvas);
      this.context._spriteCanvas.id = "sprites";
      this.context._spriteCanvas.width = width;
      this.context._spriteCanvas.height = height;
      this.context._spriteCanvas.style.zIndex = 3;
      this.context._spriteCanvas.style.position = "absolute";
      
      
      this.context._penCanvas = document.createElement("canvas");
      this.context._mainDiv.appendChild(this.context._penCanvas);
      this.context._penCanvas.id = "pen";
      this.context._penCanvas.width = width;
      this.context._penCanvas.height = height;
      this.context._penCanvas.style.zIndex = 2;
      this.context._penCanvas.style.position = "absolute";
      
      this.context._backdropCanvas = document.createElement("canvas");
      this.context._mainDiv.appendChild(this.context._backdropCanvas);
      this.context._backdropCanvas.id = "backdrop";
      this.context._backdropCanvas.width = width;
      this.context._backdropCanvas.height = height;
      this.context._backdropCanvas.style.zIndex = 1;
      this.context._backdropCanvas.style.position = "absolute";
    
      this.context._spriteContext = this.context._spriteCanvas.getContext("2d");
      this.context._penContext = this.context._penCanvas.getContext("2d");
      this.context._backdropContext = this.context._backdropCanvas.getContext("2d");
      
      this.context._runReadys();
    });
    
    this.context._setCanvasSize(width, height) // TODO does this work?
  }
  
  ready(func) {
    if (this.context.stopped) {
      this.context._readys.push(func);
    } else {
      func();
    }
  }
  
  _runReadys() {
    this.context.stopped = false;
    this.context._readys.forEach(func => { func() });
    this.context._readys = [];
  };
  
  setBackdropSize(width, height) {
    if (this.context.fullScreen) {
      throw Error("You cannot manually set the backdrop size in full-screen mode. You can full-screen mode off with: fullScreen = false.")
    } else {
     this.context._setCanvasSize(width, height); 
    }
  }
  
  _setCanvasSize(width, height) {
    this.context.height = height;
    this.context.width = width;
    this.context.minX = -this.context.width / 2;
    this.context.maxX = this.context.width / 2;
    this.context.minY = -this.context.height / 2;
    this.context.maxY = this.context.height / 2;
    
    this.context.ready(() => {
      this.context._spriteCanvas.width = this.context.width;
      this.context._spriteCanvas.height = this.context.height;
      
      var penData = this.context._penContext.getImageData(0, 0, width, height);
      this.context._penCanvas.width = this.context.width;
      this.context._penCanvas.height = this.context.height;
      this.context._penContext.putImageData(penData, 0, 0);
      
      this.context._backdropCanvas.width = this.context.width;
      this.context._backdropCanvas.height = this.context.height;
      setTimeout(this.context._renderBackdrop);
    })
  };
  
  bounds() {
    return {left: this.context.minX, right: this.context.maxX, bottom: this.context.minYm, top: this.context.maxY}
  };
  
  randomX() {
    return Woof.prototype.randomInt(this.context.minX, this.context.maxX);
  };
  
 randomY() {
    return Woof.prototype.randomInt(this.context.minY, this.context.maxY);
  };
  
  addText(options) {
    var sprite = new Woof.prototype.Text(this.context, options);
    this.context.sprites.push(sprite);
    return sprite;
  };
  
  this.context.addCircle = options => {
    var sprite = new Woof.prototype.Circle(this.context, options);
    this.context.sprites.push(sprite);
    return sprite;
  };
  
  this.context.addRectangle = options => {
    var sprite = new Woof.prototype.Rectangle(this.context, options);
    this.context.sprites.push(sprite);
    return sprite;
  };
  
  this.context.addLine = options => {
    var sprite = new Woof.prototype.Line(this.context, options);
    this.context.sprites.push(sprite);
    return sprite;
  };
  
  this.context.addImage = options => {
    var sprite = new Woof.prototype.Image(this.context, options);
    this.context.sprites.push(sprite);
    return sprite;
  };
  
  this.context._renderBackdrop = () => {
    this.context._backdropContext.clearRect(0, 0, this.context.width, this.context.height);
    if (this.context.backdrop instanceof BrowserImage) {
      this.context._backdropContext.drawImage(this.context.backdrop, 0, 0);
    } else if (typeof this.context.backdrop == "string"){
      this.context._backdropContext.save();
      this.context._backdropContext.fillStyle=this.context.backdrop;
      this.context._backdropContext.fillRect(0, 0, this.context.width, this.context.height);
      this.context._backdropContext.restore();
    }
  };
  
  this.context.setBackdropURL = function(url){    
    var backdrop = new BrowserImage();
    backdrop.src = url;
    this.context.backdrop = backdrop;
    this.context.backdrop.onload = function() { this.context.ready(this.context._renderBackdrop); };
  };

  this.context.setBackdropColor = function(color){    
    this.context.backdrop = color;
    this.context.ready(this.context._renderBackdrop);
  };
  
  this.context.firebaseConfig = config => {
    this.context.firebase = new Woof.prototype.Firebase(config);
    this.context.getCloud = this.context.firebase.getCloud;
    this.context.setCloud = this.context.firebase.setCloud;
  };
  
  this.context.freeze = () => {
    if (this.context.stopped) { return }
    this.context.after(0, "seconds", () => this.context.stopped = true);
  };
  this.context.defrost = () => {
    this.context.stopped = false;
  };
  
  this.context.translateToCenter = (x, y) => {
    return [(x - this.context.maxX) - this.context._spriteCanvas.offsetLeft, (this.context.maxY - y) + this.context._spriteCanvas.offsetTop];
  };
  this.context.translateToCanvas = (x, y) => {
    return [(x + this.context.maxX) - this.context._spriteCanvas.offsetLeft, (this.context.maxY - y) + this.context._spriteCanvas.offsetTop];
  };
  
  this.context.mouseDown = false;
  this.context.mouseX = 0;
  this.context.mouseY = 0;
  this.context.pMouseX = 0;
  this.context.pMouseY = 0;
  this.context.mouseXSpeed = 0;
  this.context.mouseYSpeed = 0;
  this.context.keysDown = [];
  this.context._onClicks = [];
  this.context.onClick = func => { this.context._onClicks.push(func); };
  this.context.ready(() => {
    this.context._spriteCanvas.addEventListener("mousedown", (event) => {
      this.context.mouseDown = true;
      [this.context.mouseX, this.context.mouseY] = this.context.translateToCenter(event.clientX, event.clientY);
    });
    this.context._spriteCanvas.addEventListener("mouseup", (event) => {
      this.context.mouseDown = false;
      [this.context.mouseX, this.context.mouseY] = this.context.translateToCenter(event.clientX, event.clientY);
    });
    this.context._spriteCanvas.addEventListener("touchstart", (event) => {
      this.context.mouseDown = true;
      [this.context.mouseX, this.context.mouseY] = this.context.translateToCenter(event.targetTouches[0].clientX, event.targetTouches[0].clientY);
    });
    this.context._spriteCanvas.addEventListener("touchend", (event) => {
      // for some reason touchend events are firing too quickly
      // and are not getting picked up in 40 ms every-if's
      // so this.context setTimeout slows things down just enouch so
      // touch events mirror mouse events
      setTimeout(() => {this.context.mouseDown = false;}, 0);
    });
    this.context._spriteCanvas.addEventListener("mousemove", (event) => { 
      [this.context.mouseX, this.context.mouseY] = this.context.translateToCenter(event.clientX, event.clientY);
    });
    this.context._spriteCanvas.addEventListener("touchmove", event => {
      [this.context.mouseX, this.context.mouseY] = this.context.translateToCenter(event.targetTouches[0].clientX, event.targetTouches[0].clientY);
      event.preventDefault();
    });
    
    document.body.addEventListener("keydown", event => {
      var key = Woof.prototype.keyCodeToString(event.keyCode);
      if (!this.context.keysDown.includes(key)){
       this.context.keysDown.push(key); 
      }
    });
    document.body.addEventListener("keyup", event => {
      var key = Woof.prototype.keyCodeToString(event.keyCode);
      if (this.context.keysDown.includes(key)){
        this.context.keysDown.splice(this.context.keysDown.indexOf(key), 1);
      }
    });
    this.context._onClickHandler = event => {
      var [mouseX, mouseY] = this.context.translateToCenter(event.clientX, event.clientY);
      this.context._onClicks.forEach((func) => {func(mouseX, mouseY)});
    };
    this.context._spriteCanvas.addEventListener("mousedown", this.context._onClickHandler);
  })

  this.context._everys = [];
  this.context.every = (time, units, func) => {
    func();
    this.context._everys.push(setInterval(func, Woof.prototype.unitsToMiliseconds(time, units)));
  };
  this.context.forever = (func) => {
    this.context.repeatUntil(() => false, func);
  };
  
  this.context.when = (condition, func) => {
    this.context.forever(() => {
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
  
  this.context._repeats = [];
  this.context.repeat = (times, func, after) => {
    this.context._repeats.push(new Woof.prototype.Repeat(times, func, after));
  };
  this.context.repeatUntil = (condition, func, after) => {
    this.context._repeats.push(new Woof.prototype.RepeatUntil(condition, func, after));
  };
  this.context._runRepeats = () => {
    this.context._repeats.forEach(repeat => {
      repeat.next();
    });
    this.context._repeats = this.context._repeats.filter(repeat => {return !repeat.done});
  };
  
  this.context._afters = [];
  this.context.after = (time, units, func) => {
    this.context._afters.push(setTimeout(func, Woof.prototype.unitsToMiliseconds(time, units)));
  };
  
  this.context.debugText = [];
  this.context.addDebug = (display, func) => {
    if (typeof func != 'function') { throw Error("The second argument to addDebug must be a function"); }
    var text = this.context.addText({x: this.context.minX + 5, y: this.context.minY + (12 * (this.context.debugText.length+1)), color: this.context.debugColor, text: () => display + ": " + JSON.stringify(func()), textAlign: "left"});
    this.context.debugText.push(text);
  }
  this.context._renderDebug = () => {
    this.context.debugText.forEach(text => text.sendToFront());
  };
  
  this.context._renderSprites = () => {
    this.context._spriteContext.clearRect(0, 0, this.context.width, this.context.height);
    this.context.sprites.forEach((sprite) => {
      sprite._render(this.context._spriteContext);
    });
  };
  
  this.context.clearPen = () => {
    this.context._penContext.clearRect(0, 0, this.context.width, this.context.height);
  }
  
  this.context._calculateMouseSpeed = () => {
    this.context.mouseXSpeed = this.context.mouseX - this.context.pMouseX;
    this.context.mouseYSpeed = this.context.mouseY - this.context.pMouseY;
    [this.context.pMouseX, this.context.pMouseY] = [this.context.mouseX, this.context.mouseY];
  };
  
  this.context._render = () => {
    this.context._runRepeats();
    this.context._calculateMouseSpeed();
    this.context.renderInterval = window.requestAnimationFrame(this.context._render);
    if (this.context.stopped) { return; }
    this.context._renderSprites();
    this.context._renderDebug();
  };
  this.context.ready(this.context._render);
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
  this.project.forever(this.trackPen);
  
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

  this.touching = (sprite, precise) => {
    if (this.deleted || !this.showing) { return false; }
    if (sprite.deleted || !sprite.showing) { return false; }
    
    var r1 = this.bounds();
    var r2 = sprite.bounds();
    if (!this.overlap(r2)) { return false; }
    
    if (!precise) { return true; }

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
  
  this.setImageURL = function(url, ){    
    this.image = new window.BrowserImage();
    // this.image.crossOrigin = "Anonymous"
    this.image.src = url;
    // TODO add this back in when I figure out how to make pixel detection fast
    // this.image.addEventListener('error', e => {
    //     e.preventDefault(); 
    //     this.image = new window.BrowserImage();
    //     this.image.src = url;
    // });
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

if (JSON.parse(document.currentScript.getAttribute('global')) !== false) { 
  Woof.prototype.extend(window, new Woof({global: true, fullScreen: true}));
}