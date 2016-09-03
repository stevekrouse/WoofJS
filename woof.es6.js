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
  thisContext.fullScreen = fullScreen;
  
  thisContext._cameraX = 0;
  thisContext._cameraY = 0;
  Object.defineProperty(thisContext, 'cameraX', {
    get: function() {
      return thisContext._cameraX;
    },
    set: function(value) {
      thisContext.maxX = value + this.width / 2;
      thisContext.minX = value - this.width / 2;
      thisContext.mouseX += (value - thisContext._cameraX)
      thisContext._cameraX = value;
    }
  });
  Object.defineProperty(thisContext, 'cameraY', {
    get: function() {
      return thisContext._cameraY;
    },
    set: function(value) {
      thisContext.maxY = value + this.height / 2;
      thisContext.minY = value - this.height / 2;
      thisContext.mouseY += (value - thisContext._cameraY)
      thisContext._cameraY = value;
    }
  });
  

  
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
    if (typeof func != "function") { throw new TypeError("ready(function) requires one function input."); }
    
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
    if (typeof width != "number" || typeof height != "number") { throw new TypeError("setBackdropSize(width, height) requires two number inputs."); }
    if (thisContext.fullScreen) {
      throw Error("You cannot manually set the backdrop size in full-screen mode. You can full-screen mode off with: fullScreen = false.")
    } else {
     thisContext._setCanvasSize(width, height); 
    }
  }
  
  thisContext._setCanvasSize = (width, height) => {
    thisContext.height = height;
    thisContext.width = width;
    thisContext.minX = thisContext.cameraX - thisContext.width / 2;
    thisContext.maxX = thisContext.cameraX + thisContext.width / 2;
    thisContext.minY = thisContext.cameraY - thisContext.height / 2;
    thisContext.maxY = thisContext.cameraY + thisContext.height / 2;
    
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
  
  thisContext.randomX = function() {
    if (arguments.length > 0) { throw new TypeError("randomX() requires no inputs."); }
    return Woof.prototype.random(thisContext.minX, thisContext.maxX);
  };
  
  thisContext.randomY = function() {
    if (arguments.length > 0) { throw new TypeError("randomY() requires no inputs."); }
    return Woof.prototype.random(thisContext.minY, thisContext.maxY);
  };
  
  thisContext._renderBackdrop = () => {
    thisContext._backdropContext.clearRect(0, 0, thisContext.width, thisContext.height);
    if (thisContext.backdrop instanceof BrowserImage) {
      thisContext._backdropContext.drawImage(thisContext.backdrop, 0, 0, thisContext.width, thisContext.height);
    } else if (typeof thisContext.backdrop == "string"){
      thisContext._backdropContext.save();
      thisContext._backdropContext.fillStyle=thisContext.backdrop;
      thisContext._backdropContext.fillRect(0, 0, thisContext.width, thisContext.height);
      thisContext._backdropContext.restore();
    }
  };
  
  thisContext.setBackdropURL = function(url){
    if (typeof url != "string") { throw new TypeError("setBackDropUrl(url) requires one string input."); }
    var backdrop = new BrowserImage();
    backdrop.src = url;
    thisContext.backdrop = backdrop;
    thisContext.backdrop.onload = function() { thisContext.ready(thisContext._renderBackdrop); };
  };

  thisContext.setBackdropColor = function(color){
    if (typeof color != "string") { throw new TypeError("setBackdropColor() takes one string input."); }
    thisContext.backdrop = color;
    thisContext.ready(thisContext._renderBackdrop);
  };
  
  thisContext.freeze = function() {
    if (arguments.length > 0) { throw new TypeError("freeze() requires no inputs."); }
    if (thisContext.stopped) { return }
    thisContext.after(0, "seconds", () => thisContext.stopped = true);
  };
  thisContext.defrost = function() {
    if (arguments.length > 0) { throw new TypeError("defrost() requires no inputs."); }
    thisContext.stopped = false;
  };
  
  thisContext.translateToCenter = (x, y) => {
    return [(x - (thisContext.width / 2) + thisContext.cameraX) - thisContext._spriteCanvas.offsetLeft, (((thisContext.height / 2) - y) + thisContext.cameraY) + thisContext._spriteCanvas.offsetTop];
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
  thisContext.ready(() => {
    thisContext._spriteCanvas.addEventListener("mousedown", (event) => {
      thisContext.mouseDown = true;
      [thisContext.mouseX, thisContext.mouseY] = thisContext.translateToCenter(event.clientX, event.clientY);
    });
    window.addEventListener("mouseup", (event) => {
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
    
    thisContext._onMouseMoveHandler = event => {
      var [mouseX, mouseY] = thisContext.translateToCenter(event.clientX, event.clientY);
      thisContext._onMouseMoves.forEach((func) => {func(mouseX, mouseY)});
    };
    thisContext._spriteCanvas.addEventListener("mousemove", thisContext._onMouseMoveHandler);
    thisContext._onMouseDownHandler = event => {
      var [mouseX, mouseY] = thisContext.translateToCenter(event.clientX, event.clientY);
      thisContext._onMouseDowns.forEach((func) => {func(mouseX, mouseY)});
    };
    thisContext._spriteCanvas.addEventListener("mousedown", thisContext._onMouseDownHandler);
    thisContext._onMouseUpHandler = event => {
      var [mouseX, mouseY] = thisContext.translateToCenter(event.clientX, event.clientY);
      thisContext._onMouseUps.forEach((func) => {func(mouseX, mouseY)});
    };
    thisContext._spriteCanvas.addEventListener("mouseup", thisContext._onMouseUpHandler);
  
    thisContext._onKeyDownHandler = event => {
      var key = Woof.prototype.keyCodeToString(event.keyCode);
      thisContext._onKeyDowns.forEach((func) => {func(key)});
    };
    document.body.addEventListener("keydown", thisContext._onKeyDownHandler);
    thisContext._onKeyUpHandler = event => {
      var key = Woof.prototype.keyCodeToString(event.keyCode);
      thisContext._onKeyUps.forEach((func) => {func(key)});
    };
    document.body.addEventListener("keyup", thisContext._onKeyUpHandler);
    
  })
  thisContext._onMouseMoves = [];
  thisContext.onMouseMove = func => {
    if (typeof func != "function") { throw new TypeError("onMouseMove(function) requires one function input."); }
    thisContext._onMouseMoves.push(func); 
  };
  thisContext._onMouseDowns = [];
  thisContext.onMouseDown = func => {
    if (typeof func != "function") { throw new TypeError("onMouseDown(function) requires one function input."); }
    thisContext._onMouseDowns.push(func); 
  };
  thisContext._onMouseUps = [];
  thisContext.onMouseUp = func => {
    if (typeof func != "function") { throw new TypeError("onMouseUp(function) requires one function input."); }
    thisContext._onMouseUps.push(func); 
  };
  
  thisContext._onKeyDowns = [];
  thisContext.onKeyDown = func => {
    if (typeof func != "function") { throw new TypeError("onKeyDown(function) requires one function input."); }
    thisContext._onKeyDowns.push(func); 
  };
  thisContext._onKeyUps = [];
  thisContext.onKeyUp = func => {
    if (typeof func != "function") { throw new TypeError("onKeyUp(function) requires one function input."); }
    thisContext._onKeyUps.push(func); 
  };

  thisContext._everys = [];
  thisContext.every = (time, units, func) => {
    var milis = Woof.prototype.unitsToMiliseconds(time, units);
    if (typeof func != "function" || typeof time != "number") { throw new TypeError("every(time, units, function) requires a number, unit and function input."); }
    func();
    thisContext._everys.push(setInterval(func, milis));
  };
  thisContext.forever = (func) => {
    if (typeof func != "function") { throw new TypeError("forever(function) requires one function input."); }
    thisContext.repeatUntil(() => false, func);
  };
  
  thisContext.when = (condition, func) => {
    if (typeof func != "function" || typeof condition != "function") { throw new TypeError("when(conditionFunction, function) requires two function inputs."); }
    thisContext.forever(() => {
      var cond;
      try {
        cond = condition();
      } catch (e) {
        console.error("Bad condition in when(conditionFunction, function): " + condition);
        throw e;
      }
      if (cond) {
        func();
      };
    });
  };
  
  thisContext._repeats = [];
  thisContext.repeat = (times, func, after) => {
    if (typeof func != "function" || typeof times != "number" || (after !== undefined && typeof after != "function")) { throw new TypeError("repeat(times, function, afterFunction) requires a number and a function, and optionally accepts an extra function."); }
    thisContext._repeats.push(new Woof.prototype.Repeat(times, func, after));
  };
  thisContext.repeatUntil = (condition, func, after) => {
    if (typeof func != "function" || typeof condition != "function" || (after !== undefined && typeof after != "function")) { throw new TypeError("repeatUntil(conditionFunction, function, afterFunction) requires two functions, and optionally accepts an extra function."); }
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
    var milis = Woof.prototype.unitsToMiliseconds(time, units);
    if (typeof func != "function" || typeof time != "number") { throw new TypeError("after(time, units, function) requires a number, unit and function input."); }
    thisContext._afters.push(setTimeout(func, milis));
  };
  
  thisContext._renderSprites = () => {
    thisContext._spriteContext.clearRect(0, 0, thisContext.width, thisContext.height);
    thisContext.sprites.forEach((sprite) => {
      sprite._render(thisContext._spriteContext);
    });
  };
  
  thisContext.clearPen = function() {
    if (arguments.length > 0) { throw new TypeError("clearPen() requires no inputs."); }
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
  };
  thisContext.ready(thisContext._render);
};

Woof.prototype.Sprite = function({project = undefined, x = 0, y = 0, angle = 0, rotationStyle = "ROTATE", showing = true, penColor = "black", penWidth = 1, penDown = false} = {}) {
  if (!project) {
    if (global) {
      this.project = window;
    } else {
      throw new TypeError("When not in global mode, you must supply your {project: project} to each Sprite.")
    }
  } else {
    this.project = project.global ? window : project;  
  }
  this.project.sprites.push(this);
  
  Object.defineProperty(this, 'x', {
    get: function() {
      return this.privateX;
    },
    set: function(value) {
      if (typeof value != "number") { throw new TypeError("sprite.x can only be set to a number."); }
      this.privateX = value;
      ready(this.trackPen);
    }
  });
  
  Object.defineProperty(this, 'y', {
    get: function() {
      return this.privateY;
    },
    set: function(value) {
      if (typeof value != "number") { throw new TypeError("sprite.y can only be set to a number."); }
      this.privateY = value;
      ready(this.trackPen);
    }
  });
  
  this.privateX = x;
  this.privateY = y;
  this.angle = angle;
  this.rotationStyle = rotationStyle;
  this.showing = showing;
  this._penDown = penDown;
  this.penColor = penColor;
  this.penWidth = penWidth;
  this.deleted = false;
  
  this.toJSON = () => {
    return {x: this.x, y: this.y, angle: this.angle, rotationStyle: this.rotationStyle, showing: this.showing, penDown: this._penDown, penColor: this.penColor, penWidth: this.penWidth, deleted: this.deleted};
  };
  
  [this.lastX, this.lastY] = [this.x, this.y];
  this.trackPen = () => {
    if (this._penDown) {
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

  this._render = function(context) {
    if (this.showing && !this.deleted && this.overlap(this.project.bounds())) {
      context.save();
      context.translate(Math.round(this.canvasX()), Math.round(this.canvasY()));
      if (this.rotationStyle == "ROTATE") {
        context.rotate(-this.radians());
      } else if (this.rotationStyle == "NO ROTATE"){
          // no rotate
      } else if (this.rotationStyle == "ROTATE LEFT RIGHT"){
        if (this.angle%360 >= 90 && this.angle%360 < 270){
          context.translate(Math.round(this.width), 0);
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
    if (arguments.length === 1) {
      if (typeof xGiven == "object"){
        var x = this.x - xGiven.x;
        var y = this.y - xGiven.y;
        return Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
      } else {
        throw new TypeError("distanceTo(sprite) requires one sprite input.")
      } 
    } else if (typeof xGiven != "number" || typeof yGiven != "number") {
      throw new TypeError("distanceTo(x,y) requires two number inputs."); 
    } else {
      var x = this.x - xGiven;
      var y = this.y - yGiven;
      return Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
    }
  };
  
  this.move = function(steps =1){
    if (typeof steps != "number") { throw new TypeError("move(steps) requires one number input."); }
    this.privateX += steps * Math.cos(this.radians());
    this.privateY += steps * Math.sin(this.radians());
    this.project.ready(this.trackPen);
  };
  
  this.setRotationStyle = style => {
    if (style == "ROTATE"){
      this.rotationStyle = "ROTATE";
    } else if (style == "NO ROTATE") {
      this.rotationStyle = "NO ROTATE";
    } else if (style == "ROTATE LEFT RIGHT") {
      this.rotationStyle = "ROTATE LEFT RIGHT";
    } else {
      throw TypeError("Unrecognized rotation style: " + style);
    }
  };
  
  this.radians = () => {
    return this.angle * Math.PI / 180;
  };
  
  this.canvasX = () => {
    return (this.x - this.project.cameraX) + (this.project.width / 2) ;
  };
  
  this.canvasY = () => {
    return (this.project.height / 2) - (this.y - this.project.cameraY);
  };
  
  this.bounds = () => {
    // TODO account for rotation
    var halfWidth = (this.width / 2);
    var halfHeight = (this.height / 2);
    
    var left = this.x - halfWidth;
    var right = this.x + halfWidth;
    var bottom = this.y - halfHeight;
    var top = this.y + halfHeight;
    return {left: left, right: right, top: top, bottom: bottom};
  };
  
  this.collisionCanvas = document.createElement('canvas');
  this.collisionContext = this.collisionCanvas.getContext('2d');

  this.touching = (sprite, precise) => {
    if (!(typeof sprite == "object")) { throw new TypeError("touching(sprite) requires one sprite input."); }
      
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
    if (typeof x != "number" || typeof y != "number") { throw new TypeError("over(x, y) requires two number inputs."); }
    if (this.deleted || !this.showing) { return false; }
    
    var r1 = this.bounds();
    var belowTop = y <= r1.top
    var aboveBottom = y >= r1.bottom;
    var rightLeft = x >= r1.left;
    var leftRight = x <= r1.right;
    return belowTop && aboveBottom && rightLeft && leftRight;
  };
  
  Object.defineProperty(this, 'mouseOver', {
    get: function() {
      if (this.deleted || !this.showing) { return false; }
      return this.over(this.project.mouseX, this.project.mouseY);
    }
  });
  
  Object.defineProperty(this, 'mouseDown', {
    get: function() {
      if (this.deleted || !this.showing) { return false; }
      return this.mouseOver && this.project.mouseDown;
    }
  });
  
  this.turnLeft = (degrees = 1) => {
    if (typeof degrees != "number") { throw new TypeError("turnLeft(degrees) requires one number input."); }
    this.angle += degrees;
  };
  
  this.turnRight = (degrees = 1) => {
    if (typeof degrees != "number") { throw new TypeError("turnRight(degrees) requires one number input."); }
    this.angle -= degrees;
  };
  
  this.sendToBack = function() {
    if (arguments.length > 0) { throw new TypeError("sendToBack() requires no inputs."); }
    var sprites = this.project.sprites;
    sprites.splice(0, 0, sprites.splice(sprites.indexOf(this), 1)[0]);
  };
  
  this.sendToFront = function() {
    if (arguments.length > 0) { throw new TypeError("sendToFront() requires no inputs."); }
    var sprites = this.project.sprites;
    sprites.splice(sprites.length, 0, sprites.splice(sprites.indexOf(this), 1)[0]);
  };
  
  Object.defineProperty(this, 'penDown', {
    get: () => {
      return () => { this._penDown = true; };
    },
    set: (value) => {
      this._penDown = value;
    }
  });
  this.penUp = () => { this._penDown = false; }

  this.show = () => { this.showing = true; }
  this.hide = () => { this.showing = false; }
  
  this.pointTowards = function(x2,y2) {
    if (arguments.length === 1) {
      if (typeof x2 == "object"){
        this.angle = Math.atan2(x2.y - this.y, x2.x - this.x) * 180 / Math.PI;
      } else {
        throw new TypeError("pointTowards(sprite) requires one sprite input.")
      } 
    } else if (typeof x2 != "number" || typeof y2 != "number") {
      throw new TypeError("pointTowards(x, y) requires two number inputs."); 
    } else {
      this.angle = Math.atan2(y2 - this.y, x2 - this.x) * 180 / Math.PI;
    }
  };
  
  this._onMouseDowns = [];
  this.onMouseDown = func => {
    if (typeof func != "function") { throw new TypeError("onMouseDown(function) requires one function input."); }
    this._onMouseDowns.push(func); 
  };
  this._onMouseDownHandler = event => {
    var [mouseX, mouseY] = this.project.translateToCenter(event.clientX, event.clientY);
    if (this.showing && this.over(mouseX, mouseY)){
      this._onMouseDowns.forEach((func) => {func(mouseX, mouseY)});
    }
  };
  this._onMouseUps = [];
  this.onMouseUp = func => {
    if (typeof func != "function") { throw new TypeError("onMouseUp(function) requires one function input."); }
    this._onMouseUps.push(func); 
  };
  this._onMouseUpHandler = event => {
    var [mouseX, mouseY] = this.project.translateToCenter(event.clientX, event.clientY);
    if (this.showing && this.over(mouseX, mouseY)){
      this._onMouseUps.forEach((func) => {func(mouseX, mouseY)});
    }
  };
  this.project.ready(() => {
    this.project._spriteCanvas.addEventListener("mousedown", this._onMouseDownHandler);
    this.project._spriteCanvas.addEventListener("mouseup", this._onMouseUpHandler);
  });
  
  this.delete = function() {
    if (arguments.length > 0) { throw new TypeError("delete() requires no inputs."); }
    if (this.deleted) { return; }
    this.showing = false;
    this.deleted = true;
    if (this.project.sprites.includes(this)){
      this.project.sprites.splice(this.project.sprites.indexOf(this), 1);
      this.project._spriteCanvas.removeEventListener("mousedown", this._onClickHandler);
    }
  };
};

Woof.prototype.Text = function({project = undefined, text = "Text", size = 12, color = "black", fontFamily = "arial", textAlign = "center"} = {}) {
  Woof.prototype.Sprite.call(this, arguments[0]);
  this.text = text;
  this.size = Math.abs(size);
  this.color = color;
  this.fontFamily = fontFamily;
  this.textAlign = textAlign;
  
  Object.defineProperty(this, 'width', {
    get: function() {
      var width;
      this._applyInContext(() => {
        width = this.project._spriteContext.measureText(this.text).width;
      });
      return width;
    },
    set: function(value) {
      throw new TypeError("You cannot modify the width of Text. You can only change its size.");
    }
  });
  
  Object.defineProperty(this, 'height', {
    get: function() {
      var height;
      this._applyInContext(() => {
        height = this.project._spriteContext.measureText("M").width;
      });
      return height;
    },
    set: function(value) {
      throw new TypeError("You cannot modify the height of Text. You can only change its size.");
    }
  });
  
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
        try { text = this.text(); } catch (e) { console.error("Error with text function: " + e.message); }
      } else {
        text = this.text;
      }
      context.fillText(text, 0, 0);
    });
  };
};

Woof.prototype.Circle = function({project = undefined, radius = 10, color = "black"} = {}) {
  Woof.prototype.Sprite.call(this, arguments[0]);
  this.radius = Math.abs(radius);
  this.color = color;
  
  Object.defineProperty(this, 'width', {
    get: function() {
      return 2 * this.radius;
    },
    set: function(value) {
      throw new TypeError("You cannot modify the width of Circle. You can only change its radius.");
    }
  });
  
  Object.defineProperty(this, 'height', {
    get: function() {
      return 2 * this.radius;
    },
    set: function(value) {
      throw new TypeError("You cannot modify the height of Circle. You can only change its radius.");
    }
  });  
  
  this.circleRender = (context) => {
    context.beginPath();
    context.arc(0, 0, this.radius, 0, 2*Math.PI);
    context.fillStyle=this.color;
    context.fill();
  };
};


Woof.prototype.Rectangle = function({project = undefined, height = 10, width = 10, color = "black"} = {}) {
  Woof.prototype.Sprite.call(this, arguments[0]);
  this.rectangleHeight = Math.abs(height);
  this.rectangleWidth = Math.abs(width);
  this.color = color;
  
  Object.defineProperty(this, 'width', {
    get: function() {
      return this.rectangleWidth;
    },
    set: function(value) {
      if (typeof value != "number") { throw new TypeError("rectangle.width can only be set to a number."); }
      this.rectangleWidth = value;
    }
  });
  
  Object.defineProperty(this, 'height', {
    get: function() {
      return this.rectangleHeight;
    },
    set: function(value) {
      if (typeof value != "number") { throw new TypeError("rectangle.height can only be set to a number."); }
      this.rectangleHeight = value;
    }
  });  
  
  this.rectangleRender = (context) => {
    context.fillStyle=this.color;
    context.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);
  };
};

Woof.prototype.Line = function({project = undefined, lineWidth = 1, x1 = 10, y1 = 10, color = "black"} = {}) {
  Woof.prototype.Sprite.call(this, arguments[0]);
  this.x1 = x1;
  this.y1 = y1;
  this.color = color;
  this.lineWidth = Math.abs(lineWidth);
  
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

Woof.prototype.Image = function({project = undefined, url = "https://www.loveyourdog.com/image3.gif", height, width} = {}) {
  Woof.prototype.Sprite.call(this, arguments[0]);
  this.imageHeight = Math.abs(height);
  this.imageWidth = Math.abs(width);
  
  this.setImageURL = function(url){    
    this.image = new window.BrowserImage();
    // this.image.crossOrigin = "Anonymous"
    this.image.src = url;
    // this.image.`EventListener('error', e => {
    //     e.preventDefault(); 
    //     this.image = new window.BrowserImage();
    //     this.image.src = url;
    // });
  };
  this.setImageURL(url);

  Object.defineProperty(this, 'width', {
    get: function() {
      return this.imageWidth || this.image.width;
    },
    set: function(value) {
      if (typeof value != "number") { throw new TypeError("image.width can only be set to a number."); }
      this.imageWidth = value;
    }
  });
  
  Object.defineProperty(this, 'height', {
    get: function() {
      return this.imageHeight || this.image.height;
    },
    set: function(value) {
      if (typeof value != "number") { throw new TypeError("image.width can only be set to a number."); }
      this.imageHeight = value;
    }
  }); 
  
  this.imageRender = (context) => {
    context.drawImage(this.image, -this.width / 2, -this.height / 2, this.width, this.height);
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

Woof.prototype.keyCodeToString = function(keyCode) {
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
  else if (keyCode == 9){
    return "TAB";
  }
  else if (keyCode == 13){
    return "ENTER";
  }
  else if (keyCode == 16){
    return "SHIFT";
  }
  else if (keyCode == 17){
    return "CTRL";
  }
  else if (keyCode == 18){
    return "ALT";
  }
  else if (keyCode == 27){
    return "ESCAPE";
  }
  else if (keyCode == 32){
    return "SPACE";
  }
  else if (keyCode == 192){
    return "`";
  }
  else if (keyCode == 186){
    return ";";
  }
  else if (keyCode == 222){
    return "'";
  }
  else if (keyCode == 189){
    return "-";
  }
  else if (keyCode == 187){
    return "=";
  }
  else if (keyCode == 219){
    return "[";
  }
  else if (keyCode == 220){
    return "\\";
  }
  else if (keyCode == 191){
    return "/";
  }
  else if (keyCode == 190){
    return ".";
  }
  else if (keyCode == 191){
    return "/";
  }
  else if (keyCode == 188){
    return ",";
  }
  else if (keyCode == 20){
    return "CAPS LOCK";
  }
  else {
    return String.fromCharCode(keyCode);
  }
};

Woof.prototype.unitsToMiliseconds = function(time, units) {
  if (units == "milliseconds" || units == "millisecond"){
    return time;
  } else if (units == "miliseconds" || units == "milisecond"){
    return time;
  } else if (units == "seconds" || units == "second"){
    return time * 1000;
  } else if (units == "minutes" || units == "minute"){
    return time * 1000 * 60;
  } else {
    throw TypeError("Unrecognized Time");
  }
};

Woof.prototype.random = function(a, b) {
  if (typeof a != "number" || typeof b != "number") { throw new TypeError("random(a, b) requires two number inputs."); }
  
  var min = Math.min.apply(Math, [a, b]),
    max = Math.max.apply(Math, [a, b]);
  
  var rand = Math.random() * (max - min) + min;
  if (Number.isInteger(min) && Number.isInteger(max)) {
    return Math.round(rand);
  } else {
    return rand;
  }
};

Woof.prototype.dayOfMonth = function(){
  if (arguments.length > 0) { throw new TypeError("dayOfMonth() requires no inputs."); }
  var date = new Date();
  return date.getDate();
};

Woof.prototype.dayOfWeek = function() {
  if (arguments.length > 0) { throw new TypeError("dayOfWeek() requires no inputs."); }
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

Woof.prototype.hourMilitary =  function() {
  if (arguments.length > 0) { throw new TypeError("hourMilitary() requires no inputs."); }
  var date = new Date();
  return date.getHours();
};

Woof.prototype.hour = function() {
  if (arguments.length > 0) { throw new TypeError("hour() requires no inputs."); }
  var date = new Date();
  var hour = date.getHours();
  return hour <= 12 ? hour : hour - 12;
};

Woof.prototype.minute =  function() {
  if (arguments.length > 0) { throw new TypeError("minute() requires no inputs."); }
  var date = new Date();
  return date.getMinutes();
};

Woof.prototype.year =  function() {
  if (arguments.length > 0) { throw new TypeError("year() requires no inputs."); }
  var date = new Date();
  return date.getFullYear();
};

Woof.prototype.months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October",  "November",  "December"];
Woof.prototype.month =  function() {
  if (arguments.length > 0) { throw new TypeError("month() requires no inputs."); }
  return Woof.prototype.months[new Date().getMonth()];
};

Woof.prototype.second = function() {
  if (arguments.length > 0) { throw new TypeError("second() requires no inputs."); }
  var date = new Date();
  return date.getSeconds();
};

Woof.prototype.randomColor = function() {
  if (arguments.length > 0) { throw new TypeError("randomColor() requires no inputs."); }
  return "rgb(" + Woof.prototype.random(0, 255) + ", " + Woof.prototype.random(0, 255) + ", " + Woof.prototype.random(0, 255)+ ")";
}

Woof.prototype.RIGHT = 0;
Woof.prototype.LEFT = 180;
Woof.prototype.UP = 90;
Woof.prototype.DOWN = 270;

Number.prototype.between = function(a, b) {
  if (typeof a != "number" || typeof b != "number") { throw new TypeError("between(a, b) requires two number inputs."); }
  var min = Math.min.apply(Math, [a, b]),
    max = Math.max.apply(Math, [a, b]);
  return this > min && this < max;
};

Array.prototype.remove = function(item) {
  for(var i = this.length; i--;) {
    if(this[i] === item) {
      this.splice(i, 1);
    }
  }
}

function throttle (callback, limit) {
  if (typeof callback != "function" || typeof limit != "number") { throw new TypeError("throttle(function, limit) requires one function input and one number."); }
  var wait = false;                   
  return function () {
    var context = this, args = arguments;
    if (!wait) {                   
      callback.apply(context, args);          
      wait = true;               
      setTimeout(function () {   
        wait = false;          
      }, limit);
    }
  }
}

Woof.prototype.extend = function(a, b){
  for(var key in b) {
    a[key] = b[key];
  }
  return a;
};

if (JSON.parse(document.currentScript.getAttribute('global')) !== false) { 
  Woof.prototype.extend(window, new Woof({global: true, fullScreen: true}));
}