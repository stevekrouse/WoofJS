"use strict";

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

// saving Image because we will later overwrite Image with Woof.Image on the window
window.BrowserImage = Image;

function Woof() {
  var _ref = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  var _ref$global = _ref.global;
  var global = _ref$global === undefined ? false : _ref$global;
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
  thisContext.stopped = true;
  thisContext.debugColor = "black";
  thisContext.fullScreen = fullScreen;

  if (thisContext.fullScreen) {
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

  thisContext.setBackdropSize = function (width, height) {
    if (thisContext.fullScreen) {
      throw Error("You cannot manually set the backdrop size in full-screen mode. You can full-screen mode off with: fullScreen = false.");
    } else {
      thisContext._setCanvasSize(width, height);
    }
  };

  thisContext._setCanvasSize = function (width, height) {
    thisContext.height = height;
    thisContext.width = width;
    thisContext.minX = -thisContext.width / 2;
    thisContext.maxX = thisContext.width / 2;
    thisContext.minY = -thisContext.height / 2;
    thisContext.maxY = thisContext.height / 2;

    thisContext.ready(function () {
      thisContext._spriteCanvas.width = thisContext.width;
      thisContext._spriteCanvas.height = thisContext.height;

      var penData = thisContext._penContext.getImageData(0, 0, width, height);
      thisContext._penCanvas.width = thisContext.width;
      thisContext._penCanvas.height = thisContext.height;
      thisContext._penContext.putImageData(penData, 0, 0);

      thisContext._backdropCanvas.width = thisContext.width;
      thisContext._backdropCanvas.height = thisContext.height;
      setTimeout(thisContext._renderBackdrop);
    });
  };
  thisContext._setCanvasSize(width, height);
  window.addEventListener("resize", function () {
    if (thisContext.fullScreen) {
      thisContext._setCanvasSize(window.innerWidth, window.innerHeight);
    }
  });

  thisContext.bounds = function () {
    return { left: thisContext.minX, right: thisContext.maxX, bottom: thisContext.minYm, top: thisContext.maxY };
  };

  thisContext.randomX = function () {
    return Woof.prototype.random(thisContext.minX, thisContext.maxX);
  };

  thisContext.randomY = function () {
    return Woof.prototype.random(thisContext.minY, thisContext.maxY);
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

  thisContext.freeze = function () {
    if (thisContext.stopped) {
      return;
    }
    thisContext.after(0, "seconds", function () {
      return thisContext.stopped = true;
    });
  };
  thisContext.defrost = function () {
    thisContext.stopped = false;
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
    thisContext.repeatUntil(function () {
      return false;
    }, func);
  };

  thisContext.when = function (condition, func) {
    thisContext.forever(function () {
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

  thisContext.debugText = [];
  thisContext.addDebug = function (display, func) {
    if (typeof func != 'function') {
      throw Error("The second argument to addDebug must be a function");
    }
    var text = new Woof.prototype.Text({ project: thisContext, x: thisContext.minX + 5, y: thisContext.minY + 12 * (thisContext.debugText.length + 1), color: thisContext.debugColor, text: function text() {
        return display + ": " + JSON.stringify(func());
      }, textAlign: "left" });
    thisContext.debugText.push(text);
  };
  thisContext._renderDebug = function () {
    thisContext.debugText.forEach(function (text) {
      return text.sendToFront();
    });
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
    var _ref2 = [thisContext.mouseX, thisContext.mouseY];
    thisContext.pMouseX = _ref2[0];
    thisContext.pMouseY = _ref2[1];
  };

  thisContext._render = function () {
    thisContext._runRepeats();
    thisContext._calculateMouseSpeed();
    thisContext.renderInterval = window.requestAnimationFrame(thisContext._render);
    if (thisContext.stopped) {
      return;
    }
    thisContext._renderSprites();
    thisContext._renderDebug();
  };
  thisContext.ready(thisContext._render);
};

Woof.prototype.Sprite = function () {
  var _this = this;

  var _ref3 = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  var _ref3$project = _ref3.project;
  var project = _ref3$project === undefined ? undefined : _ref3$project;
  var _ref3$x = _ref3.x;
  var x = _ref3$x === undefined ? 0 : _ref3$x;
  var _ref3$y = _ref3.y;
  var y = _ref3$y === undefined ? 0 : _ref3$y;
  var _ref3$angle = _ref3.angle;
  var angle = _ref3$angle === undefined ? 0 : _ref3$angle;
  var _ref3$rotationStyle = _ref3.rotationStyle;
  var rotationStyle = _ref3$rotationStyle === undefined ? "ROTATE" : _ref3$rotationStyle;
  var _ref3$showing = _ref3.showing;
  var showing = _ref3$showing === undefined ? true : _ref3$showing;
  var _ref3$penColor = _ref3.penColor;
  var penColor = _ref3$penColor === undefined ? "black" : _ref3$penColor;
  var _ref3$penWidth = _ref3.penWidth;
  var penWidth = _ref3$penWidth === undefined ? 1 : _ref3$penWidth;

  if (!project) {
    if (global) {
      this.project = window;
    } else {
      throw new Error("When not in global mode, you must supply {project: project} to a new Woof Object.");
    }
  } else {
    this.project = project.global ? window : project;
  }
  this.project.sprites.push(this);

  this.x = x;
  this.y = y;
  this.angle = angle;
  this.rotationStyle = rotationStyle;
  this.showing = showing;
  this.penDown = false;
  this.penColor = penColor;
  this.penWidth = penWidth;
  this.deleted = false;

  this.toJSON = function () {
    return { x: _this.x, y: _this.y, angle: _this.angle, rotationStyle: _this.rotationStyle, showing: _this.showing, penDown: _this.penDown, penColor: _this.penColor, penWidth: _this.penWidth, deleted: _this.deleted };
  };

  var _ref4 = [this.x, this.y];
  this.lastX = _ref4[0];
  this.lastY = _ref4[1];

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
    var _ref5 = [_this.x, _this.y];
    _this.lastX = _ref5[0];
    _this.lastY = _ref5[1];
  };
  this.project.forever(this.trackPen);

  this._render = function (context) {
    if (this.showing && !this.deleted && this.overlap(this.project.bounds())) {
      context.save();
      context.translate(Math.round(this.canvasX()), Math.round(this.canvasY()));
      if (this.rotationStyle == "ROTATE") {
        context.rotate(Math.round(-this.radians()));
      } else if (this.rotationStyle == "NO ROTATE") {
        // no rotate
      } else if (this.rotationStyle == "ROTATE LEFT RIGHT") {
          if (this.angle % 360 >= 90 && this.angle % 360 < 270) {
            context.translate(Math.round(this.width), 0);
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

  this.touching = function (sprite, precise) {
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

    if (!precise) {
      return true;
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

  this.overlap = function (_ref6) {
    var left = _ref6.left;
    var right = _ref6.right;
    var top = _ref6.top;
    var bottom = _ref6.bottom;

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

Woof.prototype.Text = function () {
  var _this2 = this;

  var _ref7 = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  var _ref7$project = _ref7.project;
  var project = _ref7$project === undefined ? undefined : _ref7$project;
  var _ref7$text = _ref7.text;
  var text = _ref7$text === undefined ? "Text" : _ref7$text;
  var _ref7$size = _ref7.size;
  var size = _ref7$size === undefined ? 12 : _ref7$size;
  var _ref7$color = _ref7.color;
  var color = _ref7$color === undefined ? "black" : _ref7$color;
  var _ref7$fontFamily = _ref7.fontFamily;
  var fontFamily = _ref7$fontFamily === undefined ? "arial" : _ref7$fontFamily;
  var _ref7$textAlign = _ref7.textAlign;
  var textAlign = _ref7$textAlign === undefined ? "center" : _ref7$textAlign;

  Woof.prototype.Sprite.call(this, project, arguments[1]);
  this.text = text;
  this.size = size;
  this.color = color;
  this.fontFamily = fontFamily;
  this.textAlign = textAlign;

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
      if (typeof _this2.text == "function") {
        try {
          text = _this2.text();
        } catch (e) {
          console.error("Error with text function: '" + _this2.text + "'");throw e;
        }
      } else {
        text = _this2.text;
      }
      context.fillText(text, 0, 0);
    });
  };
};

Woof.prototype.Circle = function () {
  var _this3 = this;

  var _ref8 = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  var _ref8$project = _ref8.project;
  var project = _ref8$project === undefined ? undefined : _ref8$project;
  var _ref8$radius = _ref8.radius;
  var radius = _ref8$radius === undefined ? 10 : _ref8$radius;
  var _ref8$color = _ref8.color;
  var color = _ref8$color === undefined ? "black" : _ref8$color;

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

Woof.prototype.Rectangle = function () {
  var _this4 = this;

  var _ref9 = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  var _ref9$project = _ref9.project;
  var project = _ref9$project === undefined ? undefined : _ref9$project;
  var _ref9$rectangleHeight = _ref9.rectangleHeight;
  var rectangleHeight = _ref9$rectangleHeight === undefined ? 10 : _ref9$rectangleHeight;
  var _ref9$rectangleWidth = _ref9.rectangleWidth;
  var rectangleWidth = _ref9$rectangleWidth === undefined ? 10 : _ref9$rectangleWidth;
  var _ref9$color = _ref9.color;
  var color = _ref9$color === undefined ? "black" : _ref9$color;

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

Woof.prototype.Line = function () {
  var _this5 = this;

  var _ref10 = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  var _ref10$project = _ref10.project;
  var project = _ref10$project === undefined ? undefined : _ref10$project;
  var _ref10$lineWidth = _ref10.lineWidth;
  var lineWidth = _ref10$lineWidth === undefined ? 1 : _ref10$lineWidth;
  var _ref10$x = _ref10.x1;
  var x1 = _ref10$x === undefined ? 10 : _ref10$x;
  var _ref10$y = _ref10.y1;
  var y1 = _ref10$y === undefined ? 10 : _ref10$y;
  var _ref10$color = _ref10.color;
  var color = _ref10$color === undefined ? "black" : _ref10$color;

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

Woof.prototype.Image = function () {
  var _this6 = this;

  var _ref11 = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  var _ref11$project = _ref11.project;
  var project = _ref11$project === undefined ? undefined : _ref11$project;
  var _ref11$url = _ref11.url;
  var url = _ref11$url === undefined ? "https://www.loveyourdog.com/image3.gif" : _ref11$url;
  var imageHeight = _ref11.imageHeight;
  var imageWidth = _ref11.imageWidth;

  Woof.prototype.Sprite.call(this, project, arguments[1]);
  this.imageHeight = imageHeight;
  this.imageWidth = imageWidth;

  this.setImageURL = function (url) {
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

  this.width = function () {
    return _this6.imageWidth || _this6.image.width;
  };

  this.height = function () {
    return _this6.imageHeight || _this6.image.height;
  };

  this.imageRender = function (context) {
    context.drawImage(_this6.image, -_this6.width() / 2, -_this6.height() / 2, _this6.width(), _this6.height());
  };
};

Woof.prototype.Repeat = function (times, func, after) {
  var _this7 = this;

  this.func = func;
  this.times = times;
  this.done = false;

  this.next = function () {
    if (_this7.done) {
      return;
    }
    if (_this7.times <= 0) {
      _this7.done = true;
      if (after) {
        after();
      }
      return;
    } else {
      _this7.func();
      _this7.times--;
    }
  };
};

Woof.prototype.RepeatUntil = function (condition, func, after) {
  var _this8 = this;

  // TODO if (typeof condition !== "string") { throw Error("You must give repeatUntil a string condition in quotes. You gave it: " + condition); }
  this.func = func;
  this.condition = condition;
  this.done = false;

  this.next = function () {
    if (_this8.done) {
      return;
    }
    var cond;
    try {
      cond = _this8.condition();
    } catch (e) {
      console.error("Error in Repeat Until condition");
      throw e;
    }

    if (cond) {
      _this8.done = true;
      if (after) {
        after();
      }
      return;
    } else {
      _this8.func();
    }
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

Woof.prototype.random = function (min, max) {
  var rand = Math.random() * (max - min) + min;
  if (Number.isInteger(min) && Number.isInteger(max)) {
    return Math.round(rand);
  } else {
    return rand;
  }
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
  return "rgb(" + Woof.prototype.random(0, 255) + ", " + Woof.prototype.random(0, 255) + ", " + Woof.prototype.random(0, 255) + ")";
};

Woof.prototype.RIGHT = 0;
Woof.prototype.LEFT = 180;
Woof.prototype.UP = 90;
Woof.prototype.DOWN = 270;

Number.prototype.between = function (a, b) {
  var min = Math.min.apply(Math, [a, b]),
      max = Math.max.apply(Math, [a, b]);
  return this > min && this < max;
};

Array.prototype.remove = function (item) {
  for (var i = this.length; i--;) {
    if (this[i] === item) {
      this.splice(i, 1);
    }
  }
};

function throttle(callback, limit) {
  var wait = false;
  return function () {
    var context = this,
        args = arguments;
    if (!wait) {
      callback.apply(context, args);
      wait = true;
      setTimeout(function () {
        wait = false;
      }, limit);
    }
  };
}

Woof.prototype.extend = function (a, b) {
  for (var key in b) {
    a[key] = b[key];
  }
  return a;
};

if (JSON.parse(document.currentScript.getAttribute('global')) !== false) {
  Woof.prototype.extend(window, new Woof({ global: true, fullScreen: true }));
}
