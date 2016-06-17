"use strict";

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

// saving Image because we will later overwrite Image with Woof.Image on the window
window.BrowserImage = Image;

function Woof() {
  var _ref = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  var _ref$global = _ref.global;
  var global = _ref$global === undefined ? false : _ref$global;
  var _ref$canvasId = _ref.canvasId;
  var canvasId = _ref$canvasId === undefined ? undefined : _ref$canvasId;
  var _ref$fullScreen = _ref.fullScreen;
  var fullScreen = _ref$fullScreen === undefined ? false : _ref$fullScreen;
  var _ref$height = _ref.height;
  var height = _ref$height === undefined ? 500 : _ref$height;
  var _ref$width = _ref.width;
  var width = _ref$width === undefined ? 350 : _ref$width;

  if (window.global) throw new Error("You must turn off global mode in the Woof script tag if you want to create your own Woof object.");
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
    window.addEventListener("load", function () {
      document.body.style.margin = 0;
      document.body.style.padding = 0;
    });
  }

  thisContext._readys = [];
  thisContext.ready = function (func) {
    if (thisContext.stopped) {
      thisContext._readys.push(func);
    } else {
      func();
    }
  };
  thisContext._runReadys = function () {
    thisContext.stopped = false;
    thisContext._readys.forEach(function (func) {
      func();
    });
    thisContext._readys = [];
  };

  window.addEventListener("load", function () {
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

  thisContext.setCanvasSize = function () {
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
    window.addEventListener("resize", function () {
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

  thisContext.bounds = function () {
    return { left: thisContext.minX, right: thisContext.maxX, bottom: thisContext.minYm, top: thisContext.maxY };
  };

  thisContext.randomX = function () {
    return Woof.prototype.randomInt(thisContext.minX, thisContext.maxX);
  };

  thisContext.randomY = function () {
    return Woof.prototype.randomInt(thisContext.minY, thisContext.maxY);
  };

  thisContext.addText = function (options) {
    var sprite = new Woof.prototype.Text(thisContext, options);
    thisContext.sprites.push(sprite);
    return sprite;
  };

  thisContext.addCircle = function (options) {
    var sprite = new Woof.prototype.Circle(thisContext, options);
    thisContext.sprites.push(sprite);
    return sprite;
  };

  thisContext.addRectangle = function (options) {
    var sprite = new Woof.prototype.Rectangle(thisContext, options);
    thisContext.sprites.push(sprite);
    return sprite;
  };

  thisContext.addLine = function (options) {
    var sprite = new Woof.prototype.Line(thisContext, options);
    thisContext.sprites.push(sprite);
    return sprite;
  };

  thisContext.addImage = function (options) {
    var sprite = new Woof.prototype.Image(thisContext, options);
    thisContext.sprites.push(sprite);
    return sprite;
  };

  thisContext._renderBackdrop = function () {
    thisContext._backdropContext.clearRect(0, 0, thisContext.width, thisContext.height);
    if (thisContext.backdrop instanceof BrowserImage) {
      thisContext._backdropContext.drawImage(thisContext.backdrop, 0, 0);
    } else if (typeof thisContext.backdrop == "string") {
      thisContext._backdropContext.save();
      thisContext._backdropContext.fillStyle = thisContext.backdrop;
      thisContext._backdropContext.fillRect(0, 0, thisContext.width, thisContext.height);
      thisContext._backdropContext.restore();
    }
  };

  thisContext.setBackdropURL = function (url) {
    var backdrop = new BrowserImage();
    backdrop.src = url;
    thisContext.backdrop = backdrop;
    thisContext.backdrop.onload = function () {
      thisContext.ready(thisContext._renderBackdrop);
    };
  };

  thisContext.setBackdropColor = function (color) {
    thisContext.backdrop = color;
    thisContext.ready(thisContext._renderBackdrop);
  };

  thisContext.firebaseConfig = function (config) {
    thisContext.firebase = new Woof.prototype.Firebase(config);
    thisContext.getCloud = thisContext.firebase.getCloud;
    thisContext.setCloud = thisContext.firebase.setCloud;
  };

  thisContext.stopAll = function () {
    thisContext._render();
    thisContext.stopped = true;

    thisContext._everys.forEach(clearInterval);
    thisContext._afters.forEach(clearInterval);
    thisContext._spriteCanvas.removeEventListener("mousedown", thisContext._onClickHandler);

    thisContext.sprites.forEach(function (sprite) {
      return sprite.delete();
    });
  };

  thisContext.translateToCenter = function (x, y) {
    return [x - thisContext.maxX - thisContext._spriteCanvas.offsetLeft, thisContext.maxY - y + thisContext._spriteCanvas.offsetTop];
  };
  thisContext.translateToCanvas = function (x, y) {
    return [x + thisContext.maxX - thisContext._spriteCanvas.offsetLeft, thisContext.maxY - y + thisContext._spriteCanvas.offsetTop];
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
  thisContext.onClick = function (func) {
    thisContext._onClicks.push(func);
  };
  thisContext.ready(function () {
    thisContext._spriteCanvas.addEventListener("mousedown", function (event) {
      thisContext.mouseDown = true;

      var _thisContext$translat = thisContext.translateToCenter(event.clientX, event.clientY);

      var _thisContext$translat2 = _slicedToArray(_thisContext$translat, 2);

      thisContext.mouseX = _thisContext$translat2[0];
      thisContext.mouseY = _thisContext$translat2[1];
    });
    thisContext._spriteCanvas.addEventListener("mouseup", function (event) {
      thisContext.mouseDown = false;

      var _thisContext$translat3 = thisContext.translateToCenter(event.clientX, event.clientY);

      var _thisContext$translat4 = _slicedToArray(_thisContext$translat3, 2);

      thisContext.mouseX = _thisContext$translat4[0];
      thisContext.mouseY = _thisContext$translat4[1];
    });
    thisContext._spriteCanvas.addEventListener("touchstart", function (event) {
      thisContext.mouseDown = true;

      var _thisContext$translat5 = thisContext.translateToCenter(event.targetTouches[0].clientX, event.targetTouches[0].clientY);

      var _thisContext$translat6 = _slicedToArray(_thisContext$translat5, 2);

      thisContext.mouseX = _thisContext$translat6[0];
      thisContext.mouseY = _thisContext$translat6[1];
    });
    thisContext._spriteCanvas.addEventListener("touchend", function (event) {
      // for some reason touchend events are firing too quickly
      // and are not getting picked up in 40 ms every-if's
      // so thisContext setTimeout slows things down just enouch so
      // touch events mirror mouse events
      setTimeout(function () {
        thisContext.mouseDown = false;
      }, 0);
    });
    thisContext._spriteCanvas.addEventListener("mousemove", function (event) {
      var _thisContext$translat7 = thisContext.translateToCenter(event.clientX, event.clientY);

      var _thisContext$translat8 = _slicedToArray(_thisContext$translat7, 2);

      thisContext.mouseX = _thisContext$translat8[0];
      thisContext.mouseY = _thisContext$translat8[1];
    });
    thisContext._spriteCanvas.addEventListener("touchmove", function (event) {
      var _thisContext$translat9 = thisContext.translateToCenter(event.targetTouches[0].clientX, event.targetTouches[0].clientY);

      var _thisContext$translat10 = _slicedToArray(_thisContext$translat9, 2);

      thisContext.mouseX = _thisContext$translat10[0];
      thisContext.mouseY = _thisContext$translat10[1];

      event.preventDefault();
    });

    document.body.addEventListener("keydown", function (event) {
      var key = Woof.prototype.keyCodeToString(event.keyCode);
      if (!thisContext.keysDown.includes(key)) {
        thisContext.keysDown.push(key);
      }
    });
    document.body.addEventListener("keyup", function (event) {
      var key = Woof.prototype.keyCodeToString(event.keyCode);
      if (thisContext.keysDown.includes(key)) {
        thisContext.keysDown.splice(thisContext.keysDown.indexOf(key), 1);
      }
    });
    thisContext._onClickHandler = function (event) {
      var _thisContext$translat11 = thisContext.translateToCenter(event.clientX, event.clientY);

      var _thisContext$translat12 = _slicedToArray(_thisContext$translat11, 2);

      var mouseX = _thisContext$translat12[0];
      var mouseY = _thisContext$translat12[1];

      thisContext._onClicks.forEach(function (func) {
        func(mouseX, mouseY);
      });
    };
    thisContext._spriteCanvas.addEventListener("mousedown", thisContext._onClickHandler);
  });

  thisContext._everys = [];
  thisContext.every = function (time, units, func) {
    func();
    thisContext._everys.push(setInterval(func, Woof.prototype.unitsToMiliseconds(time, units)));
  };
  thisContext.forever = function (func) {
    thisContext.repeatUntil("false", func);
  };

  thisContext.when = function (condition, func) {
    thisContext.forever(function () {
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
  thisContext.repeat = function (times, func, after) {
    thisContext._repeats.push(new Woof.prototype.Repeat(times, func, after));
  };
  thisContext.repeatUntil = function (condition, func, after) {
    thisContext._repeats.push(new Woof.prototype.RepeatUntil(condition, func, after));
  };
  thisContext._runRepeats = function () {
    thisContext._repeats.forEach(function (repeat) {
      repeat.next();
    });
    thisContext._repeats = thisContext._repeats.filter(function (repeat) {
      return !repeat.done;
    });
  };

  thisContext._afters = [];
  thisContext.after = function (time, units, func) {
    thisContext._afters.push(setTimeout(func, Woof.prototype.unitsToMiliseconds(time, units)));
  };

  thisContext.addDebug = function (str) {
    thisContext.debug.push(str);
    var sprite = new Woof.prototype.Text(thisContext, { textAlign: "left" });
    thisContext.debugText.push(sprite);
  };

  thisContext.debugText = [];
  thisContext.debug.forEach(thisContext.addDebug);

  thisContext._renderDebug = function () {
    for (var i = 0; i < thisContext.debug.length; i++) {
      var expr = thisContext.debug[i];
      var value;
      try {
        value = eval(expr);
      } catch (e) {
        value = e;
      }
      var _ref2 = [thisContext.minX + 5, thisContext.minY + 12 * (i + 1)];
      thisContext.debugText[i].x = _ref2[0];
      thisContext.debugText[i].y = _ref2[1];

      thisContext.debugText[i].text = expr + ": " + value;
      thisContext.debugText[i]._render(thisContext._spriteContext);
      thisContext.debugText[i].color = thisContext.debugColor;
    }
  };

  thisContext._renderSprites = function () {
    thisContext._spriteContext.clearRect(0, 0, thisContext.width, thisContext.height);
    thisContext.sprites.forEach(function (sprite) {
      sprite._render(thisContext._spriteContext);
    });
  };

  thisContext.clearPen = function () {
    thisContext._penContext.clearRect(0, 0, thisContext.width, thisContext.height);
  };

  thisContext._calculateMouseSpeed = function () {
    thisContext.mouseXSpeed = thisContext.mouseX - thisContext.pMouseX;
    thisContext.mouseYSpeed = thisContext.mouseY - thisContext.pMouseY;
    var _ref3 = [thisContext.mouseX, thisContext.mouseY];
    thisContext.pMouseX = _ref3[0];
    thisContext.pMouseY = _ref3[1];
  };

  thisContext._render = function () {
    thisContext.renderInterval = window.requestAnimationFrame(thisContext._render);
    if (thisContext.stopped) return;
    thisContext._runRepeats();
    thisContext._calculateMouseSpeed();
    thisContext._renderSprites();
    thisContext._renderDebug();
  };
  thisContext._render();
};

Woof.prototype.Sprite = function (project) {
  var _this = this;

  var _ref4 = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

  var _ref4$x = _ref4.x;
  var x = _ref4$x === undefined ? 0 : _ref4$x;
  var _ref4$y = _ref4.y;
  var y = _ref4$y === undefined ? 0 : _ref4$y;
  var _ref4$angle = _ref4.angle;
  var angle = _ref4$angle === undefined ? 0 : _ref4$angle;
  var _ref4$rotationStyle = _ref4.rotationStyle;
  var rotationStyle = _ref4$rotationStyle === undefined ? "ROTATE" : _ref4$rotationStyle;
  var _ref4$showing = _ref4.showing;
  var showing = _ref4$showing === undefined ? true : _ref4$showing;
  var _ref4$penColor = _ref4.penColor;
  var penColor = _ref4$penColor === undefined ? "black" : _ref4$penColor;
  var _ref4$penWidth = _ref4.penWidth;
  var penWidth = _ref4$penWidth === undefined ? 1 : _ref4$penWidth;

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

  var _ref5 = [this.x, this.y];
  this.lastX = _ref5[0];
  this.lastY = _ref5[1];

  this.trackPen = function () {
    if (_this.penDown) {
      if (_this.lastX != _this.x || _this.lastY != _this.y) {
        var _project$_penContext, _project$_penContext2;

        _this.project._penContext.save();
        _this.project._penContext.beginPath();
        (_project$_penContext = _this.project._penContext).moveTo.apply(_project$_penContext, _toConsumableArray(_this.project.translateToCanvas(_this.lastX, _this.lastY)));
        (_project$_penContext2 = _this.project._penContext).lineTo.apply(_project$_penContext2, _toConsumableArray(_this.project.translateToCanvas(_this.x, _this.y)));
        _this.project._penContext.lineCap = "round";
        _this.project._penContext.strokeStyle = _this.penColor;
        _this.project._penContext.lineWidth = _this.penWidth;
        _this.project._penContext.stroke();
        _this.project._penContext.restore();
      }
    }
    var _ref6 = [_this.x, _this.y];
    _this.lastX = _ref6[0];
    _this.lastY = _ref6[1];
  };
  setInterval(this.trackPen, 0);

  this._render = function (context) {
    if (this.showing && !this.deleted && this.overlap(this.project.bounds())) {
      context.save();
      context.translate(this.canvasX(), this.canvasY());
      if (this.rotationStyle == "ROTATE") {
        context.rotate(-this.radians());
      } else if (this.rotationStyle == "NO ROTATE") {
        // no rotate
      } else if (this.rotationStyle == "ROTATE LEFT RIGHT") {
          if (this.angle % 360 >= 90 && this.angle % 360 < 270) {
            context.translate(this.width, 0);
            context.scale(-1, 1);
          } else if (this.angle % 360 >= 0 && this.angle % 360 < 90 || this.angle % 360 <= 360 && this.angle % 360 >= 270) {
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

  this.distanceTo = function distanceTo(xGiven, yGiven) {
    if (arguments.length === 1) {
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

  this.move = function (steps) {
    this.x += steps * Math.cos(this.radians());
    this.y += steps * Math.sin(this.radians());
  };

  this.setRotationStyle = function (style) {
    if (style == "ROTATE") {
      _this.rotationStyle = "ROTATE";
    } else if (style == "NO ROTATE") {
      _this.rotationStyle = "NO ROTATE";
    } else if (style == "ROTATE LEFT RIGHT") {
      _this.rotationStyle = "ROTATE LEFT RIGHT";
    } else {
      throw Error("Unrecognized rotation style: " + style);
    }
  };

  this.radians = function () {
    return _this.angle * Math.PI / 180;
  };

  this.canvasX = function () {
    return _this.x + _this.project.maxX;
  };

  this.canvasY = function () {
    return _this.project.maxY - _this.y;
  };

  this.bounds = function () {
    // TODO account for rotation
    var halfWidth = _this.width() / 2;
    var halfHeight = _this.height() / 2;

    var left = _this.x - halfWidth;
    var right = _this.x + halfWidth;
    var bottom = _this.y - halfHeight;
    var top = _this.y + halfHeight;
    return { left: left, right: right, top: top, bottom: bottom };
  };

  this.collisionCanvas = document.createElement('canvas');
  this.collisionContext = this.collisionCanvas.getContext('2d');

  this.touching = function (sprite) {
    if (_this.deleted || !_this.showing) {
      return false;
    }
    if (sprite.deleted || !sprite.showing) {
      return false;
    }

    var r1 = _this.bounds();
    var r2 = sprite.bounds();
    if (!_this.overlap(r2)) {
      return false;
    }

    var left = Math.min(r1.left, r2.left);
    var top = Math.max(r1.top, r2.top);
    var right = Math.max(r1.right, r2.right);
    var bottom = Math.min(r1.bottom, r2.bottom);

    _this.collisionCanvas.width = _this.project.width;
    _this.collisionCanvas.height = _this.project.height;

    _this._render(_this.collisionContext);
    _this.collisionContext.globalCompositeOperation = 'source-in';
    sprite._render(_this.collisionContext);

    var _project$translateToC = _this.project.translateToCanvas(left, top);

    var _project$translateToC2 = _slicedToArray(_project$translateToC, 2);

    var canvasLeft = _project$translateToC2[0];
    var canvasTop = _project$translateToC2[1];


    try {
      var data = _this.collisionContext.getImageData(canvasLeft, canvasTop, right - left, top - bottom).data;
    } catch (e) {
      if (e instanceof DOMException) {
        console.warn("You have an image at an untrusted URL. Consider uploading to Imgur and using https.");
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

  this.overlap = function (_ref7) {
    var left = _ref7.left;
    var right = _ref7.right;
    var top = _ref7.top;
    var bottom = _ref7.bottom;

    var r1 = _this.bounds();
    return !(left > r1.right || right < r1.left || top < r1.bottom || bottom > r1.top);
  };

  this.over = function (x, y) {
    if (_this.deleted || !_this.showing) {
      return false;
    }

    var r1 = _this.bounds();
    var belowTop = y <= r1.top;
    var aboveBottom = y >= r1.bottom;
    var rightLeft = x >= r1.left;
    var leftRight = x <= r1.right;
    return belowTop && aboveBottom && rightLeft && leftRight;
  };

  this.mouseOver = function () {
    if (this.deleted || !this.showing) {
      return false;
    }

    return this.over(this.project.mouseX, this.project.mouseY);
  };

  this.mouseDown = function () {
    if (_this.deleted || !_this.showing) {
      return false;
    }

    return _this.mouseOver() && project.mouseDown;
  };

  this.turnLeft = function (degrees) {
    _this.angle += degrees;
  };

  this.turnRight = function (degrees) {
    _this.angle -= degrees;
  };

  this.sendToBack = function () {
    var sprites = _this.project.sprites;
    sprites.splice(0, 0, sprites.splice(sprites.indexOf(_this), 1)[0]);
  };

  this.sendToFront = function () {
    var sprites = _this.project.sprites;
    sprites.splice(sprites.length, 0, sprites.splice(sprites.indexOf(_this), 1)[0]);
  };

  this.pointTowards = function (x2, y2) {
    _this.angle = Math.atan2(y2 - _this.y, x2 - _this.x) * 180 / Math.PI;
  };

  this.height = function () {
    throw Error("Implemented in subclass");
  };

  this.width = function () {
    throw Error("Implemented in subclass");
  };

  this._onClicks = [];
  this.onClick = function (func) {
    _this._onClicks.push(func);
  };
  this._onClickHandler = function (event) {
    var _project$translateToC3 = _this.project.translateToCenter(event.clientX, event.clientY);

    var _project$translateToC4 = _slicedToArray(_project$translateToC3, 2);

    var mouseX = _project$translateToC4[0];
    var mouseY = _project$translateToC4[1];

    if (_this.showing && _this.over(mouseX, mouseY)) {
      _this._onClicks.forEach(function (func) {
        func(mouseX, mouseY);
      });
    }
  };
  this.project.ready(function () {
    _this.project._spriteCanvas.addEventListener("mousedown", _this._onClickHandler);
  });

  this.delete = function () {
    _this.showing = false;
    _this.deleted = true;
    if (_this.project.sprites.includes(_this)) {
      _this.project.sprites.splice(_this.project.sprites.indexOf(_this), 1);
      _this.project._spriteCanvas.removeEventListener("mousedown", _this._onClickHandler);
    }
  };
};

Woof.prototype.Text = function (project) {
  var _this2 = this;

  var _ref8 = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

  var _ref8$text = _ref8.text;
  var text = _ref8$text === undefined ? "Text" : _ref8$text;
  var _ref8$dynamicText = _ref8.dynamicText;
  var dynamicText = _ref8$dynamicText === undefined ? undefined : _ref8$dynamicText;
  var _ref8$size = _ref8.size;
  var size = _ref8$size === undefined ? 12 : _ref8$size;
  var _ref8$color = _ref8.color;
  var color = _ref8$color === undefined ? "black" : _ref8$color;
  var _ref8$fontFamily = _ref8.fontFamily;
  var fontFamily = _ref8$fontFamily === undefined ? "arial" : _ref8$fontFamily;
  var _ref8$textAlign = _ref8.textAlign;
  var textAlign = _ref8$textAlign === undefined ? "center" : _ref8$textAlign;

  Woof.prototype.Sprite.call(this, project, arguments[1]);
  this.text = text;
  this.size = size;
  this.color = color;
  this.fontFamily = fontFamily;
  this.textAlign = textAlign;
  this.dynamicText = dynamicText;

  this.width = function () {
    var width;
    _this2._applyInContext(function () {
      width = _this2.project._spriteContext.measureText(_this2.text).width;
    });
    return width;
  };

  this.height = function () {
    var height;
    _this2._applyInContext(function () {
      height = _this2.project._spriteContext.measureText("M").width;
    });
    return height;
  };

  this._applyInContext = function (func) {
    _this2.project._spriteContext.save();

    _this2.project._spriteContext.font = _this2.size + "px " + _this2.fontFamily;
    _this2.project._spriteContext.fillStyle = _this2.color;
    _this2.project._spriteContext.textAlign = _this2.textAlign;

    func();

    _this2.project._spriteContext.restore();
  };

  this.textRender = function (context) {
    _this2._applyInContext(function () {
      var text;
      try {
        text = _this2.dynamicText ? eval(_this2.dynamicText) : _this2.text;
      } catch (e) {
        console.error("Error with dynamicText: '" + _this2.dynamicText + "'");throw e;
      }
      context.fillText(text, 0, 0);
    });
  };
};

Woof.prototype.Circle = function (project) {
  var _this3 = this;

  var _ref9 = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

  var _ref9$radius = _ref9.radius;
  var radius = _ref9$radius === undefined ? 10 : _ref9$radius;
  var _ref9$color = _ref9.color;
  var color = _ref9$color === undefined ? "black" : _ref9$color;

  Woof.prototype.Sprite.call(this, project, arguments[1]);
  this.radius = radius;
  this.color = color;

  this.width = function () {
    return 2 * _this3.radius;
  };

  this.height = function () {
    return 2 * _this3.radius;
  };

  this.circleRender = function (context) {
    context.beginPath();
    context.arc(0, 0, _this3.radius, 0, 2 * Math.PI);
    context.fillStyle = _this3.color;
    context.fill();
  };
};

Woof.prototype.Rectangle = function (project) {
  var _this4 = this;

  var _ref10 = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

  var _ref10$rectangleHeigh = _ref10.rectangleHeight;
  var rectangleHeight = _ref10$rectangleHeigh === undefined ? 10 : _ref10$rectangleHeigh;
  var _ref10$rectangleWidth = _ref10.rectangleWidth;
  var rectangleWidth = _ref10$rectangleWidth === undefined ? 10 : _ref10$rectangleWidth;
  var _ref10$color = _ref10.color;
  var color = _ref10$color === undefined ? "black" : _ref10$color;

  Woof.prototype.Sprite.call(this, project, arguments[1]);
  this.rectangleHeight = rectangleHeight;
  this.rectangleWidth = rectangleWidth;
  this.color = color;

  this.width = function () {
    return _this4.rectangleWidth;
  };

  this.height = function () {
    return _this4.rectangleHeight;
  };

  this.rectangleRender = function (context) {
    context.fillStyle = _this4.color;
    context.fillRect(-_this4.width() / 2, -_this4.height() / 2, _this4.width(), _this4.height());
  };
};

Woof.prototype.Line = function (project) {
  var _this5 = this;

  var _ref11 = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

  var _ref11$lineWidth = _ref11.lineWidth;
  var lineWidth = _ref11$lineWidth === undefined ? 1 : _ref11$lineWidth;
  var _ref11$x = _ref11.x1;
  var x1 = _ref11$x === undefined ? 10 : _ref11$x;
  var _ref11$y = _ref11.y1;
  var y1 = _ref11$y === undefined ? 10 : _ref11$y;
  var _ref11$color = _ref11.color;
  var color = _ref11$color === undefined ? "black" : _ref11$color;

  Woof.prototype.Sprite.call(this, project, arguments[1]);
  this.x1 = x1;
  this.y1 = y1;
  this.color = color;
  this.lineWidth = lineWidth;

  this.width = function () {
    return _this5.lineWidth;
  };

  this.height = function () {
    return Math.sqrt(Math.pow(_this5.x - _this5.x1, 2) + Math.pow(_this5.y - _this5.y1, 2));
  };

  this.lineRender = function (context) {
    context.beginPath();
    context.moveTo(0, 0);
    context.lineTo(_this5.x1 - _this5.x, -_this5.y1 + _this5.y);
    context.strokeStyle = color;
    context.lineWidth = lineWidth;
    context.stroke();
  };
};

Woof.prototype.Image = function (project) {
  var _this7 = this;

  var _ref12 = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

  var _ref12$url = _ref12.url;
  var url = _ref12$url === undefined ? "http://www.loveyourdog.com/image3.gif" : _ref12$url;
  var imageHeight = _ref12.imageHeight;
  var imageWidth = _ref12.imageWidth;

  Woof.prototype.Sprite.call(this, project, arguments[1]);
  this.imageHeight = imageHeight;
  this.imageWidth = imageWidth;

  this.setImageURL = function (url) {
    var _this6 = this;

    this.image = new window.BrowserImage();
    this.image.crossOrigin = "Anonymous";
    this.image.src = url;
    this.image.addEventListener('error', function (e) {
      e.preventDefault();
      _this6.image = new window.BrowserImage();
      _this6.image.src = url;
    });
  };
  this.setImageURL(url);

  this.width = function () {
    return _this7.imageWidth || _this7.image.width;
  };

  this.height = function () {
    return _this7.imageHeight || _this7.image.height;
  };

  this.imageRender = function (context) {
    context.drawImage(_this7.image, -_this7.width() / 2, -_this7.height() / 2, _this7.width(), _this7.height());
  };
};

Woof.prototype.Repeat = function (times, func, after) {
  var _this8 = this;

  this.func = func;
  this.times = times;
  this.done = false;

  this.next = function () {
    if (_this8.done) {
      return;
    }
    if (_this8.times <= 0) {
      _this8.done = true;
      if (after) {
        after();
      }
      return;
    } else {
      _this8.func();
      _this8.times--;
    }
  };
};

Woof.prototype.RepeatUntil = function (condition, func, after) {
  var _this9 = this;

  if (typeof condition !== "string") {
    throw Error("You must give repeatUntil a string condition in quotes. You gave it: " + condition);
  }
  this.func = func;
  this.condition = condition;
  this.done = false;

  this.next = function () {
    if (_this9.done) {
      return;
    }
    var cond;
    try {
      cond = eval(_this9.condition);
    } catch (e) {
      console.error("Error in Repeat Until");
      throw e;
    }

    if (cond) {
      _this9.done = true;
      if (after) {
        after();
      }
      return;
    } else {
      _this9.func();
    }
  };
};

Woof.prototype.Firebase = function (config) {
  var _this10 = this;

  this.data = {};

  this.loadFirebaseLibrary = function (callback) {
    var lib = document.createElement("script");
    lib.type = "text/javascript";
    lib.src = "https://www.gstatic.com/firebasejs/live/3.0/firebase.js";
    lib.onload = callback;
    document.body.appendChild(lib);
  };

  this.loadFirebaseLibrary(function () {
    firebase.initializeApp(config);
    firebase.database().ref().on('value', function (snapshot) {
      _this10.data = snapshot.val() || {};
    });
  });

  this.setCloud = function (key, val) {
    firebase.database().ref().child("/" + key).set(val);
  };

  this.getCloud = function (key, defaultVal) {
    return _this10.data[key] || defaultVal;
  };
};

Woof.prototype.keyCodeToString = function (keyCode) {
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

Woof.prototype.unitsToMiliseconds = function (time, units) {
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

Woof.prototype.randomInt = function (min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

Woof.prototype.dayOfMonth = function () {
  var date = new Date();
  return date.getDate();
};

Woof.prototype.dayOfWeek = function () {
  var date = new Date();
  var day = date.getDay();
  if (day === 0) {
    return "Sunday";
  } else if (day == 1) {
    return "Monday";
  } else if (day == 2) {
    return "Tuesday";
  } else if (day == 3) {
    return "Wednesday";
  } else if (day == 4) {
    return "Thursday";
  } else if (day == 5) {
    return "Friday";
  } else if (day == 6) {
    return "Saturday";
  }
};

Woof.prototype.hourMilitary = function () {
  var date = new Date();
  return date.getHours();
};

Woof.prototype.hour = function () {
  var date = new Date();
  var hour = date.getHours();
  return hour <= 12 ? hour : hour - 12;
};

Woof.prototype.minute = function () {
  var date = new Date();
  return date.getMinutes();
};

Woof.prototype.second = function () {
  var date = new Date();
  return date.getSeconds();
};

Woof.prototype.randomColor = function () {
  return "rgb(" + Woof.randomInt(0, 255) + ", " + Woof.randomInt(0, 255) + ", " + Woof.randomInt(0, 255) + ")";
};

Woof.prototype.RIGHT = 0;
Woof.prototype.LEFT = 180;
Woof.prototype.UP = 90;
Woof.prototype.DOWN = 270;

Woof.prototype.extend = function (a, b) {
  for (var key in b) {
    a[key] = b[key];
  }
};

if (JSON.parse(document.currentScript.getAttribute('global'))) {
  Woof.prototype.extend(window, new Woof({ global: true, fullScreen: true, debug: ["mouseX", "mouseY"] }));
}
