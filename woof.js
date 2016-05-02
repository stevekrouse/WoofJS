// To Dos
// sprite layering (render order)
// Better setText API
// more accurate mouseover and touching sprites(including angle) (steal from phsophorus)
// touching colors (steal from phosphorus)
// hour, min, second, day, month, year
// setRotationStyle no rotate (or only left-right)

// https://github.com/nathan/phosphorus/blob/master/phosphorus.js

// http://jsbin.com/patafol/35/edit?html,js,output

var Woof = {};

Woof.keyCodeToString = (keyCode) => {
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
    return String.fromCharCode(event.keyCode);
  }
};

Woof.unitsToMiliseconds = (time, units) => {
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

Woof.randomInt = (low, high) => {
  return Math.floor(Math.random() * high + low);
};

Woof.Project = function(canvasId) {
  this.sprites = [];
  this.backdrops = [];
  this.backdrop = 0;
  
  // set up canvas context
  this._canvas = document.getElementById(canvasId); // TODO catch fail
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
    var sprite = new Woof.Sprite(this);
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
  document.body.onmousedown = () => { 
    this.mouseDown = true;
  };
  document.body.onmouseup = () => {
    this.mouseDown = false;
  };
  
  this.mouseX = 0;
  this.mouseY = 0;
  document.body.onmousemove = (event) => { 
    this.mouseX = event.clientX;
    this.mouseY = event.clientY;
  };
  
  this.keysDown = [];
  document.body.onkeydown = event => {
    var key = Woof.keyCodeToString(event.keyCode);
    if (!this.keysDown.includes(key)){
     this.keysDown.push(key); 
    }
  };
  document.body.onkeyup = event => {
    var key = Woof.keyCodeToString(event.keyCode);
    if (this.keysDown.includes(key)){
      this.keysDown.splice(this.keysDown.indexOf(key), 1);
    }
  };

  this._everys = [];
  this.every = (time, units, func) => {
    this._everys.push(setInterval(func, Woof.unitsToMiliseconds(time, units)));
  };
  
  this._afters = [];
  this.after = (time, units, func) => {
    this._afters.push(setTimeout(func, Woof.unitsToMiliseconds(time, units)));
  };
  
  this._onloads = [];
    document.body.onload = function(event){
    this._onloads.forEach((func) => {func.call();});
  }.bind(this);
  
  // TODO catch render errors and stop rendering
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

Woof.Sprite = function(project) {
  this.project = project;
  
  this.xPosition = 0;
  this.yPosition = 0;
  
  this.angle = 0;

  this.costumes = [];
  this.costume = 0;
  this.height = null;
  this.width = null;
  
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
    this._everys.push(setInterval(func, Woof.unitsToMiliseconds(time, units)));
  };
  
  this._afters = [];
  this.after = (time, units, func) => {
    this._afters.push(setTimeout(func, Woof.unitsToMiliseconds(time, units)));
  };
  
  this._render = function(project) {
    var costume = this.costumes[this.costume];
    if (costume && this.showing) {
      project._context.save();
      project._context.translate(this.xPosition, this.yPosition);
      project._context.translate(costume, costume.width/2, costume.height / 2);
      project._context.rotate(this.angle * Math.PI / 180);
      
      if (costume.nodeName == "IMG") {
        project._context.drawImage(costume, -costume.width/2, -costume.height / 2);
      }
      else {
        project._context.font = costume.size + "px " + costume.font;
        project._context.fillStyle = costume.color;
        project._context.fillText(costume.text, costume.x, costume.y);  
      }
      project._context.restore();
    }
  };
  
  this.move = function(steps){
    this.xPosition += steps * Math.cos(this.angle * Math.PI / 180);
    this.yPosition += steps * Math.sin(this.angle * Math.PI / 180);
  };
  
  this.bounds = () => {
    var leftBounds = this.xPosition - (this.width() / 2);
    var rightBounds = this.xPosition + (this.width() / 2);
    var upBounds = this.yPosition - (this.height() / 2);
    var downBounds = this.yPosition + (this.height() / 2);
    return {left: leftBounds, right: rightBounds, top: upBounds, bottom: downBounds};
  };
  
  this.touching = sprite => {
    var containsLeftEdge = this.bounds().left <= sprite.bounds().right && this.bounds().left >= sprite.bounds().left;
    var containsRightEdge = this.bounds().right >= sprite.bounds().left && this.bounds().right <= sprite.bounds().right;
    var overlapsHorizontally = containsLeftEdge || containsRightEdge;
    
    var containsTopEdge = this.bounds().top >= sprite.bounds().top && this.bounds().top <= sprite.bounds().bottom;
    var containsBottomEdge = this.bounds().bottom >= sprite.bounds().top && this.bounds().bottom <= sprite.bounds().bottom;
    var overlapsVertically = containsTopEdge || containsBottomEdge;
    
    return overlapsHorizontally && overlapsVertically;
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
