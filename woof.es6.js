// To Dos
// more accurate mouseover and touching sprites(including angle) (steal from phsophorus)
// touching colors (steal from phosphorus)
// hour, min, second, day, month, year helpers

Number.prototype.between = function(a, b, inclusive) {
  var min = Math.min.apply(Math, [a, b]),
    max = Math.max.apply(Math, [a, b]);
  return inclusive ? this >= min && this <= max : this > min && this < max;
};

var keyCodeToString = (keyCode) => {
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

var unitsToMiliseconds = (time, units) => {
  if (units == "miliseconds" || units == "milisecond"){
    return time;
  } else if (units == "seconds" || units == "second"){
    return time * 1000;
  } else if (units == "minutes" || units == "minute"){
    return time * 1000 * 60;
  } else {
    throw Error("Unrecognized Time");
  }
};

var randomInt = (low, high) => {
  return Math.floor(Math.random() * high + low);
};

var Project = function(canvasId) {
  this.sprites = [];
  this.backdrops = [];
  this.backdrop = 0;
  
  try {
    this._canvas = document.getElementById(canvasId);
  } catch (e){
    console.error(e);
    console.error("Could not find a canvas on the page with id " + canvasId);
    return null;
  }
  this._context = this._canvas.getContext("2d");
  
  this._render = function(){
    this._context.clearRect(0, 0, this._canvas.width, this._canvas.height);
    this._renderBackdrop();
    this._renderSprites();
  };
  
  this._renderBackdrop = function() {
    if (this.backdrops[this.backdrop]) {
      var image = this.backdrops[this.backdrop];
      project._context.drawImage(image, 0, 0);
    }
  };
  
  this._renderSprites = () => {
    this.sprites.forEach((sprite) => {
      sprite._render(this);
    });
  };
  
  this.addSprite = function() {
    var sprite = new Sprite(this);
    this.sprites.push(sprite);
    return sprite;
  };
  
  this.addBackdropURL = function(url){    
    var backdrop = new Image();
    backdrop.src = url;
    this.backdrops.push(backdrop);
  };
  
  this.stopAll = () => {
    this._render();
    clearInterval(renderInterval);
    
    this._everys.forEach(clearInterval);
    this._afters.forEach(clearInterval);
    
    this.sprites.forEach(sprite => sprite.delete());
  };
  
  
  this.mouseDown = false;
  var mousedown = () => { 
    this.mouseDown = true;
  };
  var mouseup = () => {
    this.mouseDown = false;
  };
  document.body.addEventListener("mousedown", mousedown);
  document.body.addEventListener("mouseup", mouseup);
  document.body.addEventListener("touchstart", mousedown);
  document.body.addEventListener("touchend", mouseup);

  
  this.mouseX = 0;
  this.mouseY = 0;
  document.body.addEventListener("mousemove", (event) => { 
    this.mouseX = event.clientX;
    this.mouseY = event.clientY;
  });
  this._canvas.addEventListener("touchmove", event => {
    this.mouseX = event.targetTouches[0].pageX;
    this.mouseY = event.targetTouches[0].pageY;
    event.preventDefault();
  });
  
  this.keysDown = [];
  document.body.addEventListener("keydown", event => {
    var key = keyCodeToString(event.keyCode);
    if (!this.keysDown.includes(key)){
     this.keysDown.push(key); 
    }
  });
  document.body.addEventListener("keyup", event => {
    var key = keyCodeToString(event.keyCode);
    if (this.keysDown.includes(key)){
      this.keysDown.splice(this.keysDown.indexOf(key), 1);
    }
  });

  this._everys = [];
  this.every = (time, units, func) => {
    func();
    this._everys.push(setInterval(func, unitsToMiliseconds(time, units)));
  };
  
  this._afters = [];
  this.after = (time, units, func) => {
    this._afters.push(setTimeout(func, unitsToMiliseconds(time, units)));
  };
  
  this._onloads = [];
    document.body.addEventListener("onload", event => {
    this._onloads.forEach((func) => {func.call();});
  });
  
  var renderInterval = setInterval(() => {
    try {
      this._render();
    } catch (e) {
      console.error(e);
      console.error("Error in render: " + e.message);
      clearInterval(renderInterval);
    }
  }, 40);
};

var Sprite = function(project) {
  this.project = project;
  
  this.xPosition = 0;
  this.yPosition = 0;
  
  this.angle = 0;

  this.costumes = [];
  this.costume = 0;
  this.height = null;
  this.width = null;
  
  this.rotationStyle = "ROTATE";
  
  this.showing = true;

  this.addCostumeURL = function(url){    
    var costume = new Image();
    costume.src = url;
    this.costumes.push(costume);
    return this.costumes.length - 1;
  };
  
  this.setText = (text, x, y, size, color, font) => {
    var s = size || 12;
    var c = color || "black";
    var f = font || "Arial";
    this.costumes[0] = {text: text, x: x, y: y, size: s, color: c, font: f};
  };
  
  this._everys = [];
  this.every = (time, units, func) => {
    func();
    this._everys.push(setInterval(func, unitsToMiliseconds(time, units)));
  };
  
  this._afters = [];
  this.after = (time, units, func) => {
    this._afters.push(setTimeout(func, unitsToMiliseconds(time, units)));
  };
  
  this._render = function() {
    var costume = this.costumes[this.costume];
    
    var angle;
    if (this.rotationStyle == "ROTATE"){
      angle = this.angle;
    } else if (this.rotationStyle == "NO ROTATE"){
      angle = 0;
    }
    
    if (costume && this.showing) {
      this.project._context.save();
      this.project._context.translate(this.xPosition, this.yPosition);
      this.project._context.translate(costume, costume.width/2, costume.height / 2);
      this.project._context.rotate(angle * Math.PI / 180);
      
      if (costume.nodeName == "IMG") {
        this.project._context.drawImage(costume, -costume.width/2, -costume.height / 2);
      }
      else if (costume.text) {
        this.project._context.font = costume.size + "px " + costume.font;
        this.project._context.fillStyle = costume.color;
        this.project._context.fillText(costume.text, costume.x, costume.y);  
      } else if (costume.radius) {
				this.project._context.beginPath();
				this.project._context.arc(costume.x,costume.y,costume.radius,0,2*Math.PI);
				this.project._context.fillStyle=costume.color;
				this.project._context.fill();
			}
      this.project._context.restore();
    }
  };
  
  this.addCostumeCircle = (x, y, radius, color) => {
		this.costumes.push({x:x, y:y, radius: radius, color:color});
	};
  
  this.move = function(steps){
    this.xPosition += steps * Math.cos(this.angle * Math.PI / 180);
    this.yPosition += steps * Math.sin(this.angle * Math.PI / 180);
  };
  
  this.setRotationStyle = style => {
    if (style == "ROTATE"){
      this.rotationStyle = "ROTATE";
    }
    else if (style == "NO ROTATE") {
      this.rotationStyle = "NO ROTATE";
    }
    else {
      throw Error("Unrecognized rotation style: " + style);
    }
  };
  
  this.bounds = () => {
    var leftBounds = this.xPosition - (this.width() / 2);
    var rightBounds = this.xPosition + (this.width() / 2);
    var topBounds = this.yPosition - (this.height() / 2);
    var bottomBounds = this.yPosition + (this.height() / 2);
    return {left: leftBounds, right: rightBounds, top: topBounds, bottom: bottomBounds};
  };
  
  this.touching = sprite => {
    var r1 = this.bounds();
    var r2 = sprite.bounds();
    
    return !(r2.left > r1.right || 
             r2.right < r1.left || 
             r2.top > r1.bottom ||
             r2.bottom < r1.top);
  };
  
  this.mouseOver = function() {
    // TODO account for rotation
    var belowTop = this.project.mouseY >= this.yPosition - (this.height() / 2);
    var aboveBottom = this.project.mouseY <= this.yPosition + (this.height() /2);
    var rightLeft = this.project.mouseX >= this.xPosition - (this.width() / 2);
    var leftRight = this.project.mouseX <= this.xPosition + (this.width() / 2);
    return belowTop && aboveBottom && rightLeft && leftRight;
  };
  
  this.currentCostume = () => {
    return this.costumes[this.costume];
  };
  
  this.sendToBack = () => {
    var sprites = this.project.sprites;
    sprites.splice(0, 0, sprites.splice(sprites.indexOf(this), 1)[0]);
  };
  
  this.sendToFront = () => {
    var sprites = this.project.sprites;
    sprites.splice(sprites.length, 0, sprites.splice(sprites.indexOf(this), 1)[0]);
  };
  
  this.pointTowards = sprite => {
    var x1 = this.xPosition;
    var y1 = this.yPosition;
    var x2 = sprite.xPosition;
    var y2 = sprite.yPosition;
    
    this.angle = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;
  };
  
  this.pointTowards = (x2,y2) => {
    var x1 = this.xPosition;
    var y1 = this.yPosition;
    
    this.angle = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;
  };
  
  this.height = () => {
    return this.currentCostume().height;
  };
  
  this.width = () => {
    return this.currentCostume().width;
  };
  
  this.onload = function(func){
    this.project._onloads.push(func);
  };
  
  this.delete = () => {
    if (this.project.sprites.includes(this)){
      this.project.sprites.splice(this.project.sprites.indexOf(this), 1);
      this._everys.forEach(clearInterval);
      this._afters.forEach(clearInterval);
    }
  };
};
