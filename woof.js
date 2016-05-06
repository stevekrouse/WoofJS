"use strict";

// To Dos
// more accurate mouseover and touching sprites(including angle) (steal from phsophorus)
// touching colors (steal from phosphorus)
// hour, min, second, day, month, year helpers

Number.prototype.between = function (a, b, inclusive) {
  var min = Math.min.apply(Math, [a, b]),
      max = Math.max.apply(Math, [a, b]);
  return inclusive ? this >= min && this <= max : this > min && this < max;
};

var keyCodeToString = function keyCodeToString(keyCode) {
  if (keyCode == 38) {
    return "UP";
  } else if (keyCode == 37) {
    return "LEFT";
  } else if (keyCode == 39) {
    return "RIGHT";
  } else if (keyCode == 40) {
    return "DOWN";
  } else {
    return String.fromCharCode(keyCode);
  }
};

var unitsToMiliseconds = function unitsToMiliseconds(time, units) {
  if (units == "miliseconds" || units == "milisecond") {
    return time;
  } else if (units == "seconds" || units == "second") {
    return time * 1000;
  } else if (units == "minutes" || units == "minute") {
    return time * 1000 * 60;
  } else {
    throw Error("Unrecognized Time");
  }
};

var randomInt = function randomInt(low, high) {
  return Math.floor(Math.random() * high + low);
};

var Project = function Project(canvasId) {
  var _this = this;

  this.sprites = [];
  this.backdrops = [];
  this.backdrop = 0;

  try {
    this._canvas = document.getElementById(canvasId);
  } catch (e) {
    console.error(e);
    console.error("Could not find a canvas on the page with id " + canvasId);
    return null;
  }
  this._context = this._canvas.getContext("2d");

  this._render = function () {
    this._context.clearRect(0, 0, this._canvas.width, this._canvas.height);
    this._renderBackdrop();
    this._renderSprites();
  };

  this._renderBackdrop = function () {
    if (this.backdrops[this.backdrop]) {
      var image = this.backdrops[this.backdrop];
      project._context.drawImage(image, 0, 0);
    }
  };

  this._renderSprites = function () {
    _this.sprites.forEach(function (sprite) {
      sprite._render(_this);
    });
  };

  this.addSprite = function () {
    var sprite = new Sprite(this);
    this.sprites.push(sprite);
    return sprite;
  };

  this.addBackdropURL = function (url) {
    var backdrop = new Image();
    backdrop.src = url;
    this.backdrops.push(backdrop);
  };

  this.stopAll = function () {
    _this._render();
    clearInterval(renderInterval);

    _this._everys.forEach(clearInterval);
    _this._afters.forEach(clearInterval);

    _this.sprites.forEach(function (sprite) {
      return sprite.delete();
    });
  };

  this.mouseDown = false;
  var mousedown = function mousedown() {
    _this.mouseDown = true;
  };
  var mouseup = function mouseup() {
    _this.mouseDown = false;
  };
  document.body.addEventListener("mousedown", mousedown);
  document.body.addEventListener("mouseup", mouseup);
  document.body.addEventListener("touchstart", mousedown);
  document.body.addEventListener("touchend", mouseup);

  this.mouseX = 0;
  this.mouseY = 0;
  document.body.addEventListener("mousemove", function (event) {
    _this.mouseX = event.clientX;
    _this.mouseY = event.clientY;
  });
  this._canvas.addEventListener("touchmove", function (event) {
    _this.mouseX = event.targetTouches[0].pageX;
    _this.mouseY = event.targetTouches[0].pageY;
    event.preventDefault();
  });

  this.keysDown = [];
  document.body.addEventListener("keydown", function (event) {
    var key = keyCodeToString(event.keyCode);
    if (!_this.keysDown.includes(key)) {
      _this.keysDown.push(key);
    }
  });
  document.body.addEventListener("keyup", function (event) {
    var key = keyCodeToString(event.keyCode);
    if (_this.keysDown.includes(key)) {
      _this.keysDown.splice(_this.keysDown.indexOf(key), 1);
    }
  });

  this._everys = [];
  this.every = function (time, units, func) {
    func();
    _this._everys.push(setInterval(func, unitsToMiliseconds(time, units)));
  };

  this._afters = [];
  this.after = function (time, units, func) {
    _this._afters.push(setTimeout(func, unitsToMiliseconds(time, units)));
  };

  this._onloads = [];
  document.body.addEventListener("onload", function (event) {
    _this._onloads.forEach(function (func) {
      func.call();
    });
  });

  var renderInterval = setInterval(function () {
    try {
      _this._render();
    } catch (e) {
      console.error(e);
      console.error("Error in render: " + e.message);
      clearInterval(renderInterval);
    }
  }, 40);
};

var Sprite = function Sprite(project) {
  var _this2 = this;

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

  this.addCostumeURL = function (url) {
    var costume = new Image();
    costume.src = url;
    this.costumes.push(costume);
    return this.costumes.length - 1;
  };

  this.setText = function (text, x, y, size, color, font, align) {
    var s = size || 12;
    var c = color || "black";
    var f = font || "Arial";
    var a = align || "left";
    _this2.costumes[0] = { text: text, x: x, y: y, size: s, color: c, font: f, align: a };
  };

  this._everys = [];
  this.every = function (time, units, func) {
    func();
    _this2._everys.push(setInterval(func, unitsToMiliseconds(time, units)));
  };

  this._afters = [];
  this.after = function (time, units, func) {
    _this2._afters.push(setTimeout(func, unitsToMiliseconds(time, units)));
  };

  this._render = function () {
    var costume = this.costumes[this.costume];

    var angle;
    if (this.rotationStyle == "ROTATE") {
      angle = this.angle;
    } else if (this.rotationStyle == "NO ROTATE") {
      angle = 0;
    }

    if (costume && this.showing) {
      this.project._context.save();
      this.project._context.translate(this.xPosition, this.yPosition);
      this.project._context.translate(costume, costume.width / 2, costume.height / 2);
      this.project._context.rotate(angle * Math.PI / 180);

      if (costume.nodeName == "IMG") {
        this.project._context.drawImage(costume, -costume.width / 2, -costume.height / 2);
      } else if (costume.text) {
        this.project._context.font = costume.size + "px " + costume.font;
        this.project._context.fillStyle = costume.color;
        this.project._context.textAlign = costume.align;
        this.project._context.fillText(costume.text, costume.x, costume.y);
      } else if (costume.radius) {
        this.project._context.beginPath();
        this.project._context.arc(costume.x, costume.y, costume.radius, 0, 2 * Math.PI);
        this.project._context.fillStyle = costume.color;
        this.project._context.fill();
      }
      this.project._context.restore();
    }
  };

  this.addCostumeCircle = function (x, y, radius, color) {
    _this2.costumes.push({ x: x, y: y, radius: radius, color: color });
  };

  this.move = function (steps) {
    this.xPosition += steps * Math.cos(this.angle * Math.PI / 180);
    this.yPosition += steps * Math.sin(this.angle * Math.PI / 180);
  };

  this.setRotationStyle = function (style) {
    if (style == "ROTATE") {
      _this2.rotationStyle = "ROTATE";
    } else if (style == "NO ROTATE") {
      _this2.rotationStyle = "NO ROTATE";
    } else {
      throw Error("Unrecognized rotation style: " + style);
    }
  };

  this.bounds = function () {
    var leftBounds = _this2.xPosition - _this2.width() / 2;
    var rightBounds = _this2.xPosition + _this2.width() / 2;
    var topBounds = _this2.yPosition - _this2.height() / 2;
    var bottomBounds = _this2.yPosition + _this2.height() / 2;
    return { left: leftBounds, right: rightBounds, top: topBounds, bottom: bottomBounds };
  };

  this.touching = function (sprite) {
    var r1 = _this2.bounds();
    var r2 = sprite.bounds();

    return !(r2.left > r1.right || r2.right < r1.left || r2.top > r1.bottom || r2.bottom < r1.top);
  };

  this.mouseOver = function () {
    // TODO account for rotation
    var belowTop = this.project.mouseY >= this.yPosition - this.height() / 2;
    var aboveBottom = this.project.mouseY <= this.yPosition + this.height() / 2;
    var rightLeft = this.project.mouseX >= this.xPosition - this.width() / 2;
    var leftRight = this.project.mouseX <= this.xPosition + this.width() / 2;
    return belowTop && aboveBottom && rightLeft && leftRight;
  };

  this.currentCostume = function () {
    return _this2.costumes[_this2.costume];
  };

  this.sendToBack = function () {
    var sprites = _this2.project.sprites;
    sprites.splice(0, 0, sprites.splice(sprites.indexOf(_this2), 1)[0]);
  };

  this.sendToFront = function () {
    var sprites = _this2.project.sprites;
    sprites.splice(sprites.length, 0, sprites.splice(sprites.indexOf(_this2), 1)[0]);
  };

  this.pointTowards = function (sprite) {
    var x1 = _this2.xPosition;
    var y1 = _this2.yPosition;
    var x2 = sprite.xPosition;
    var y2 = sprite.yPosition;

    _this2.angle = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;
  };

  this.pointTowards = function (x2, y2) {
    var x1 = _this2.xPosition;
    var y1 = _this2.yPosition;

    _this2.angle = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;
  };

  this.height = function () {
    return _this2.currentCostume().height;
  };

  this.width = function () {
    return _this2.currentCostume().width;
  };

  this.onload = function (func) {
    this.project._onloads.push(func);
  };

  this.delete = function () {
    if (_this2.project.sprites.includes(_this2)) {
      _this2.project.sprites.splice(_this2.project.sprites.indexOf(_this2), 1);
      _this2._everys.forEach(clearInterval);
      _this2._afters.forEach(clearInterval);
    }
  };
};
