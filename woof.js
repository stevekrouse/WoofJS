"use strict";

var Woof = {};

Woof.keyCodeToString = function (keyCode) {
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

Woof.unitsToMiliseconds = function (time, units) {
  if (units == "milliseconds" || units == "millisecond") {
    return time;
  } else if (units == "miliseconds" || units == "milisecond") {
    return time;
  } else if (units == "seconds" || units == "second") {
    return time * 1000;
  } else if (units == "minutes" || units == "minute") {
    return time * 1000 * 60;
  } else {
    throw Error("Unrecognized Time");
  }
};

Woof.randomInt = function (low, high) {
  return Math.floor(Math.random() * high + low);
};

Woof.Project = function (canvasId) {
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
  this.height = this._canvas.height;
  this.width = this._canvas.width;

  this._render = function () {
    this._context.clearRect(0, 0, this._canvas.width, this._canvas.height);
    this._renderBackdrop();
    this._renderSprites();
  };

  this._renderBackdrop = function () {
    if (this.backdrops[this.backdrop]) {
      var backdrop = this.backdrops[this.backdrop];
      this._context.drawImage(backdrop, 0, 0);
    }
  };

  this._renderSprites = function () {
    _this.sprites.forEach(function (sprite) {
      sprite._render(_this);
    });
  };

  this.addText = function (options) {
    var sprite = new Woof.Text(_this, options);
    _this.sprites.push(sprite);
    return sprite;
  };

  this.addCircle = function (options) {
    var sprite = new Woof.Circle(_this, options);
    _this.sprites.push(sprite);
    return sprite;
  };

  this.addImage = function (options) {
    var sprite = new Woof.Image(_this, options);
    _this.sprites.push(sprite);
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
  this.mouseX = 0;
  this.mouseY = 0;
  this._canvas.addEventListener("mousedown", function (event) {
    _this.mouseDown = true;
    _this.mouseX = event.clientX - _this._canvas.offsetLeft;
    _this.mouseY = event.clientY - _this._canvas.offsetTop;
  });
  this._canvas.addEventListener("mouseup", function (event) {
    _this.mouseDown = false;
    _this.mouseX = event.clientX - _this._canvas.offsetLeft;
    _this.mouseY = event.clientY - _this._canvas.offsetTop;
  });
  this._canvas.addEventListener("touchstart", function (event) {
    _this.mouseDown = true;
    _this.mouseX = event.targetTouches[0].clientX - _this._canvas.offsetLeft;
    _this.mouseY = event.targetTouches[0].clientY - _this._canvas.offsetTop;
  });
  this._canvas.addEventListener("touchend", function (event) {
    // for some reason touchend events are firing too quickly
    // and are not getting picked up in 40 ms every-if's
    // so this setTimeout slows things down just enouch so
    // touch events mirror mouse events
    setTimeout(function () {
      _this.mouseDown = false;
    }, 0);
  });
  this._canvas.addEventListener("mousemove", function (event) {
    _this.mouseX = event.clientX - _this._canvas.offsetLeft;
    _this.mouseY = event.clientY - _this._canvas.offsetTop;
  });
  this._canvas.addEventListener("touchmove", function (event) {
    _this.mouseX = event.targetTouches[0].clientX - _this._canvas.offsetLeft;
    _this.mouseY = event.targetTouches[0].clientY - _this._canvas.offsetTop;
    event.preventDefault();
  });

  this.keysDown = [];
  document.body.addEventListener("keydown", function (event) {
    var key = Woof.keyCodeToString(event.keyCode);
    if (!_this.keysDown.includes(key)) {
      _this.keysDown.push(key);
    }
  });
  document.body.addEventListener("keyup", function (event) {
    var key = Woof.keyCodeToString(event.keyCode);
    if (_this.keysDown.includes(key)) {
      _this.keysDown.splice(_this.keysDown.indexOf(key), 1);
    }
  });

  this._everys = [];
  this.every = function (time, units, func) {
    func();
    _this._everys.push(setInterval(func, Woof.unitsToMiliseconds(time, units)));
  };

  this._afters = [];
  this.after = function (time, units, func) {
    _this._afters.push(setTimeout(func, Woof.unitsToMiliseconds(time, units)));
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

Woof.Sprite = function (project, _ref) {
  var _this2 = this;

  var _ref$xPosition = _ref.xPosition;
  var xPosition = _ref$xPosition === undefined ? 0 : _ref$xPosition;
  var _ref$yPosition = _ref.yPosition;
  var yPosition = _ref$yPosition === undefined ? 0 : _ref$yPosition;
  var _ref$angle = _ref.angle;
  var angle = _ref$angle === undefined ? 0 : _ref$angle;
  var _ref$rotationStyle = _ref.rotationStyle;
  var rotationStyle = _ref$rotationStyle === undefined ? "ROTATE" : _ref$rotationStyle;
  var _ref$showing = _ref.showing;
  var showing = _ref$showing === undefined ? true : _ref$showing;

  this.project = project;
  this.xPosition = xPosition;
  this.yPosition = yPosition;
  this.angle = angle;
  this.rotationStyle = rotationStyle;
  this.showing = showing;

  this._render = function () {
    if (this.showing) {
      var radians = this.rotationStyle == "ROTATE" ? this.radians() : 0;
      this.project._context.save();
      this.project._context.translate(this.xPosition, this.yPosition);
      this.project._context.rotate(radians);

      if (this instanceof Woof.Image) {
        this.imageRender();
      } else if (this instanceof Woof.Text) {
        this.textRender();
      } else if (this instanceof Woof.Circle) {
        this.circleRender();
      }
      this.project._context.restore();
    }
  };

  this.move = function (steps) {
    this.xPosition += steps * Math.cos(this.radians());
    this.yPosition += steps * Math.sin(this.radians());
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

  this.radians = function () {
    return _this2.angle * Math.PI / 180;
  };

  this.bounds = function () {
    // TODO account for rotation
    var halfWidth = _this2.width() / 2;
    var halfHeight = _this2.height() / 2;

    var left = _this2.xPosition - halfWidth;
    var right = _this2.xPosition + halfWidth;
    var top = _this2.yPosition - halfHeight;
    var bottom = _this2.yPosition + halfHeight;
    return { left: left, right: right, top: top, bottom: bottom };
  };

  this.touching = function (sprite) {
    var r1 = _this2.bounds();
    var r2 = sprite.bounds();
    return !(r2.left > r1.right || r2.right < r1.left || r2.top > r1.bottom || r2.bottom < r1.top);
  };

  this.mouseOver = function () {
    var r1 = this.bounds();
    var belowTop = this.project.mouseY >= r1.top;
    var aboveBottom = this.project.mouseY <= r1.bottom;
    var rightLeft = this.project.mouseX >= r1.left;
    var leftRight = this.project.mouseX <= r1.right;
    return belowTop && aboveBottom && rightLeft && leftRight;
  };

  this.sendToBack = function () {
    var sprites = _this2.project.sprites;
    sprites.splice(0, 0, sprites.splice(sprites.indexOf(_this2), 1)[0]);
  };

  this.sendToFront = function () {
    var sprites = _this2.project.sprites;
    sprites.splice(sprites.length, 0, sprites.splice(sprites.indexOf(_this2), 1)[0]);
  };

  this.pointTowards = function (x2, y2) {
    var x1 = _this2.xPosition;
    var y1 = _this2.yPosition;

    _this2.angle = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;
  };

  this.height = function () {
    console.error("Implemented in subclass");
  };

  this.width = function () {
    console.error("Implemented in subclass");
  };

  this.delete = function () {
    if (_this2.project.sprites.includes(_this2)) {
      _this2.project.sprites.splice(_this2.project.sprites.indexOf(_this2), 1);
    }
  };
};

Woof.Text = function (project, _ref2) {
  var _this3 = this;

  var _ref2$text = _ref2.text;
  var text = _ref2$text === undefined ? "Text" : _ref2$text;
  var _ref2$fontSize = _ref2.fontSize;
  var fontSize = _ref2$fontSize === undefined ? 12 : _ref2$fontSize;
  var _ref2$fontColor = _ref2.fontColor;
  var fontColor = _ref2$fontColor === undefined ? "black" : _ref2$fontColor;
  var _ref2$fontFamily = _ref2.fontFamily;
  var fontFamily = _ref2$fontFamily === undefined ? "arial" : _ref2$fontFamily;
  var _ref2$textAlign = _ref2.textAlign;
  var textAlign = _ref2$textAlign === undefined ? "center" : _ref2$textAlign;

  Woof.Sprite.call(this, project, arguments[1]);
  this.text = text;
  this.fontSize = fontSize;
  this.fontColor = fontColor;
  this.fontFamily = fontFamily;
  this.textAlign = textAlign;

  this.width = function () {
    var width;
    _this3._applyInContext(function () {
      width = _this3.project._context.measureText(_this3.text).width;
    });
    return width;
  };

  this.height = function () {
    var height;
    _this3._applyInContext(function () {
      height = _this3.project._context.measureText("M").width;
    });
    return height;
  };

  this._applyInContext = function (func) {
    _this3.project._context.save();

    _this3.project._context.font = _this3.fontSize + "px " + _this3.fontFamily;
    _this3.project._context.fillStyle = _this3.fontColor;
    _this3.project._context.textAlign = _this3.textAlign;

    func();

    _this3.project._context.restore();
  };

  this.textRender = function () {
    _this3._applyInContext(function () {
      _this3.project._context.fillText(_this3.text, 0, 0);
    });
  };
};

Woof.Circle = function (project, _ref3) {
  var _this4 = this;

  var _ref3$radius = _ref3.radius;
  var radius = _ref3$radius === undefined ? 10 : _ref3$radius;
  var _ref3$color = _ref3.color;
  var color = _ref3$color === undefined ? "black" : _ref3$color;

  Woof.Sprite.call(this, project, arguments[1]);
  this.radius = radius;
  this.color = color;

  this.width = function () {
    return 2 * _this4.radius;
  };

  this.height = function () {
    return 2 * _this4.radius;
  };

  this.circleRender = function () {
    _this4.project._context.beginPath();
    _this4.project._context.arc(0, 0, _this4.radius, 0, 2 * Math.PI);
    _this4.project._context.fillStyle = _this4.color;
    _this4.project._context.fill();
  };
};

Woof.Image = function (project, _ref4) {
  var _this5 = this;

  var _ref4$url = _ref4.url;
  var url = _ref4$url === undefined ? "http://www.loveyourdog.com/image3.gif" : _ref4$url;
  var imageHeight = _ref4.imageHeight;
  var imageWidth = _ref4.imageWidth;

  Woof.Sprite.call(this, project, arguments[1]);
  this.images = [];
  this.image = 0;
  this.imageHeight = undefined;
  this.imageWidth = undefined;

  this.addImageURL = function (url) {
    var image = new Image();
    image.src = url;
    this.images.push(image);
    return this.images.length - 1;
  };
  this.addImageURL(url);

  this.width = function () {
    return _this5.imageWidth || _this5.currentImage().width;
  };

  this.height = function () {
    return _this5.imageHeight || _this5.currentImage().height;
  };

  this.currentImage = function () {
    return _this5.images[_this5.image];
  };

  this.imageRender = function () {
    _this5.project._context.drawImage(_this5.currentImage(), -_this5.width() / 2, -_this5.height() / 2, _this5.width(), _this5.height());
  };
};
