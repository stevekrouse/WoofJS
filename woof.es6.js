// saving Image because we will later overwrite Image with Woof.Image on the window
window.BrowserImage = Image;

function Woof({global = false, canvasId = undefined, fullScreen = false, height = 500, width = 350} = {}) {
  if(window.global) throw new Error("You must turn off global mode in the Woof script tag if you want to create your own Woof object.")
  this.global = global;
  var thisContext = this.global ? window : this;

  thisContext.global = global;
  thisContext.sprites = [];
  thisContext.backdrop = undefined;
  thisContext.debug = [];
  thisContext.stopped = true;
  this.debugColor = "black";
  
  if (fullScreen) {
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
  
  thisContext.setCanvasSize = () => {
    if (thisContext._spriteCanvas) {
      thisContext.height = thisContext._spriteCanvas.height;
      thisContext.width = thisContext._spriteCanvas.width;
    } else {
      thisContext.height = height;
      thisContext.width = width;
    }
    thisContext.minX = -thisContext.width / 2;
    thisContext.maxX = thisContext.width / 2;
    thisContext.minY = -thisContext.height / 2;
    thisContext.maxY = thisContext.height / 2;
  };
  thisContext.setCanvasSize();
  
  if (fullScreen) {
    window.addEventListener("resize", () => {
      thisContext._spriteCanvas.width = window.innerWidth;
      thisContext._spriteCanvas.height = window.innerHeight;
      
      var penData = thisContext._penContext.getImageData(0, 0, window.innerWidth, window.innerHeight);
      thisContext._penCanvas.width = window.innerWidth;
      thisContext._penCanvas.height = window.innerHeight;
      thisContext._penContext.putImageData(penData, 0, 0);
      
      thisContext._backdropCanvas.width = window.innerWidth;
      thisContext._backdropCanvas.height = window.innerHeight;
      thisContext._renderBackdrop();
      
      thisContext.setCanvasSize();
    });
  }
  
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
    thisContext._renderBackdrop();
  };
  
  thisContext.firebaseConfig = config => {
    thisContext.firebase = new Woof.prototype.Firebase(config);
    thisContext.getCloud = thisContext.firebase.getCloud;
    thisContext.setCloud = thisContext.firebase.setCloud;
  };
  
  thisContext.stopAll = () => {
    thisContext._render();
    thisContext.stopped = true;
    
    thisContext._everys.forEach(clearInterval);
    thisContext._afters.forEach(clearInterval);
    thisContext._spriteCanvas.removeEventListener("mousedown", thisContext._onClickHandler);
    
    thisContext.sprites.forEach(sprite => sprite.delete());
  };
  
  thisContext.translateToCenter = (x, y) => {
    return [(x - thisContext.maxX) - thisContext._spriteCanvas.offsetLeft, (thisContext.maxY - y) + thisContext._spriteCanvas.offsetTop];
  };
  thisContext.translateToCanvas = (x, y) => {
    return [(x + thisContext.maxX) - thisContext._spriteCanvas.offsetLeft, (thisContext.maxY - y) + thisContext._spriteCanvas.offsetTop];
  };
  
  thisContext.mouseDown = false;
  thisContext.mouseX = 0;
  thisContext.mouseY = 0;
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
      [thisContext.mouseX, thisContext.mouseY] = thisContext.translateToCenter(event.clientX, event.clientY);
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
    thisContext.repeatUntil("false", func);
  };
  
  thisContext.when = (condition, func) => {
    thisContext.forever(() => {
      var cond;
      try {
        cond = eval(condition);
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
  
  thisContext.addDebug = (str) => {
    thisContext.debug.push(str);
    var sprite = new Woof.prototype.Text(thisContext, {textAlign: "left"});
    thisContext.debugText.push(sprite);
  }

  thisContext.debugText = [];
  thisContext.debug.forEach(thisContext.addDebug);
  
  thisContext._renderDebug = () => {
    for (var i = 0; i < thisContext.debug.length; i++) {
      var expr = thisContext.debug[i];
      var value;
      try { value = eval(expr); } catch(e) { value = e; }
      [thisContext.debugText[i].x, thisContext.debugText[i].y] = [thisContext.minX + 5, thisContext.minY + (12 * (i+1))];
      thisContext.debugText[i].text = `${expr}: ${value}`;
      thisContext.debugText[i]._render(thisContext);
      thisContext.debugText[i].color = thisContext.debugColor;
    }
  };
  
  thisContext._renderSprites = () => {
    thisContext.sprites.forEach((sprite) => {
      sprite._render(thisContext);
    });
  };
  
  thisContext.clearPen = () => {
    thisContext._penContext.clearRect(0, 0, thisContext.width, thisContext.height);
  }
  
  thisContext._render = () => {
    thisContext.renderInterval = window.requestAnimationFrame(thisContext._render);
    if (thisContext.stopped) return;
    thisContext._runRepeats();
    thisContext._spriteContext.clearRect(0, 0, thisContext.width, thisContext.height);
    thisContext._renderSprites();
    thisContext._renderDebug();
  };
  thisContext._render();
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
  
  this._render = function() {
    if (this.showing) {
      this.project._spriteContext.save();
      this.project._spriteContext.translate(this.canvasX(), this.canvasY());
      if (this.rotationStyle == "ROTATE") {
        this.project._spriteContext.rotate(-this.radians());
      } else if (this.rotationStyle == "NO ROTATE"){
          // no rotate
      } else if (this.rotationStyle == "ROTATE LEFT RIGHT"){
        if (this.angle%360 >= 90 && this.angle%360 < 270){
          this.project._spriteContext.translate(this.width, 0);
          this.project._spriteContext.scale(-1, 1);
        } else if (this.angle%360 >=0 && this.angle%360 < 90 || this.angle%360 <= 360 && this.angle%360 >=270){
          // no rotate
        }
      }
      
      if (this instanceof Woof.prototype.Image) {
        this.imageRender();
      } else if (this instanceof Woof.prototype.Text) {
        this.textRender();
      } else if (this instanceof Woof.prototype.Circle) {
        this.circleRender();
      } else if (this instanceof Woof.prototype.Rectangle) {
        this.rectangleRender();
      } else if (this instanceof Woof.prototype.Line) {
        this.lineRender();
      }
      this.project._spriteContext.restore();
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
  
  this.touching = sprite => {
    if (this.deleted || !this.showing) { return false; }
    if (sprite.deleted || !sprite.showing) { return false; }
    
    var r1 = this.bounds();
    var r2 = sprite.bounds();
    if (!this.showing || !sprite.showing) { return false; }
    return !(r2.left > r1.right || 
             r2.right < r1.left || 
             r2.top < r1.bottom ||
             r2.bottom > r1.top);
  };
  
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

Woof.prototype.Text = function(project, {text = "Text",  dynamicText = undefined, size = 12, color = "black", fontFamily = "arial", textAlign = "center"} = {}) {
  Woof.prototype.Sprite.call(this, project, arguments[1]);
  this.text = text;
  this.size = size;
  this.color = color;
  this.fontFamily = fontFamily;
  this.textAlign = textAlign;
  this.dynamicText = dynamicText;
  
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
  
  this.textRender = () => {
    this._applyInContext(() => {
      var text;
      try { text = this.dynamicText ? eval(this.dynamicText) : this.text; } catch (e) { console.error("Error with dynamicText: '" + this.dynamicText + "'"); throw e; }
      this.project._spriteContext.fillText(text, 0, 0);
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
  
  this.circleRender = () => {
    this.project._spriteContext.beginPath();
    this.project._spriteContext.arc(0, 0, this.radius, 0, 2*Math.PI);
    this.project._spriteContext.fillStyle=this.color;
    this.project._spriteContext.fill();
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
  
  this.rectangleRender = () => {
    this.project._spriteContext.fillStyle=this.color;
    this.project._spriteContext.fillRect(-this.width() / 2, -this.height() / 2, this.width(), this.height());
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
  
  this.lineRender = () => {
    this.project._spriteContext.beginPath();
    this.project._spriteContext.moveTo(0, 0);
    this.project._spriteContext.lineTo(this.x1 - this.x, -this.y1 + this.y);
    this.project._spriteContext.strokeStyle = color;
    this.project._spriteContext.lineWidth = lineWidth;
    this.project._spriteContext.stroke();
  };
};

Woof.prototype.Image = function(project, {url = "http://www.loveyourdog.com/image3.gif", imageHeight, imageWidth} = {}) {
  Woof.prototype.Sprite.call(this, project, arguments[1]);
  this.imageHeight = imageHeight;
  this.imageWidth = imageWidth;
  
  this.setImageURL = function(url){    
    this.image = new window.BrowserImage();
    this.image.src = url;
  };
  this.setImageURL(url);

  this.width = () => {
    return this.imageWidth || this.image.width;
  };

  this.height = () => {
    return this.imageHeight || this.image.height;
  };
  
  this.currentImage = () => {
    return this.images[this.image];
  };

  this.imageRender = () => {
    this.project._spriteContext.drawImage(this.image, -this.width() / 2, -this.height() / 2, this.width(), this.height());
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
  if (typeof condition !== "string") { throw Error("You must give repeatUntil a string condition in quotes. You gave it: " + condition); }
  this.func = func;
  this.condition = condition;
  this.done = false;
  
  this.next = () => {
    if (this.done){
      return;
    }
    var cond;
    try {
      cond = eval(this.condition);
    } catch (e) {
      console.error("Error in Repeat Until");
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

Woof.prototype.repeat = (times, func) => {
  for (var i = 0; i < times; i++){
    func(i+1);
  }
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
};

if (JSON.parse(document.currentScript.getAttribute('global'))) { 
  Woof.prototype.extend(window, new Woof({global: true, fullScreen: true, debug: ["mouseX", "mouseY"]}));
}