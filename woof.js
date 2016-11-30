'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

/* SAT.js - Version 0.6.0 - Copyright 2012 - 2016 - Jim Riecken <jimr@jimr.ca> - released under the MIT License. https://github.com/jriecken/sat-js */
function Vector(t, o) {
  this.x = t || 0, this.y = o || 0;
}function Circle(t, o) {
  this.pos = t || new Vector(), this.r = o || 0;
}function Polygon(t, o) {
  this.pos = t || new Vector(), this.angle = 0, this.offset = new Vector(), this.setPoints(o || []);
}function Box(t, o, e) {
  this.pos = t || new Vector(), this.w = o || 0, this.h = e || 0;
}function Response() {
  this.a = null, this.b = null, this.overlapN = new Vector(), this.overlapV = new Vector(), this.clear();
}function flattenPointsOn(t, o, e) {
  for (var r = Number.MAX_VALUE, n = -Number.MAX_VALUE, s = t.length, i = 0; s > i; i++) {
    var p = t[i].dot(o);r > p && (r = p), p > n && (n = p);
  }e[0] = r, e[1] = n;
}function isSeparatingAxis(t, o, e, r, n, s) {
  var i = T_ARRAYS.pop(),
      p = T_ARRAYS.pop(),
      c = T_VECTORS.pop().copy(o).sub(t),
      l = c.dot(n);if (flattenPointsOn(e, n, i), flattenPointsOn(r, n, p), p[0] += l, p[1] += l, i[0] > p[1] || p[0] > i[1]) return T_VECTORS.push(c), T_ARRAYS.push(i), T_ARRAYS.push(p), !0;if (s) {
    var h = 0;if (i[0] < p[0]) {
      if (s.aInB = !1, i[1] < p[1]) h = i[1] - p[0], s.bInA = !1;else {
        var a = i[1] - p[0],
            y = p[1] - i[0];h = y > a ? a : -y;
      }
    } else if (s.bInA = !1, i[1] > p[1]) h = i[0] - p[1], s.aInB = !1;else {
      var a = i[1] - p[0],
          y = p[1] - i[0];h = y > a ? a : -y;
    }var u = Math.abs(h);u < s.overlap && (s.overlap = u, s.overlapN.copy(n), 0 > h && s.overlapN.reverse());
  }return T_VECTORS.push(c), T_ARRAYS.push(i), T_ARRAYS.push(p), !1;
}function voronoiRegion(t, o) {
  var e = t.len2(),
      r = o.dot(t);return 0 > r ? LEFT_VORONOI_REGION : r > e ? RIGHT_VORONOI_REGION : MIDDLE_VORONOI_REGION;
}function pointInCircle(t, o) {
  var e = T_VECTORS.pop().copy(t).sub(o.pos),
      r = o.r * o.r,
      n = e.len2();return T_VECTORS.push(e), r >= n;
}function pointInPolygon(t, o) {
  TEST_POINT.pos.copy(t), T_RESPONSE.clear();var e = testPolygonPolygon(TEST_POINT, o, T_RESPONSE);return e && (e = T_RESPONSE.aInB), e;
}function testCircleCircle(t, o, e) {
  var r = T_VECTORS.pop().copy(o.pos).sub(t.pos),
      n = t.r + o.r,
      s = n * n,
      i = r.len2();if (i > s) return T_VECTORS.push(r), !1;if (e) {
    var p = Math.sqrt(i);e.a = t, e.b = o, e.overlap = n - p, e.overlapN.copy(r.normalize()), e.overlapV.copy(r).scale(e.overlap), e.aInB = t.r <= o.r && p <= o.r - t.r, e.bInA = o.r <= t.r && p <= t.r - o.r;
  }return T_VECTORS.push(r), !0;
}function testPolygonCircle(t, o, e) {
  for (var r = T_VECTORS.pop().copy(o.pos).sub(t.pos), n = o.r, s = n * n, i = t.calcPoints, p = i.length, c = T_VECTORS.pop(), l = T_VECTORS.pop(), h = 0; p > h; h++) {
    var a = h === p - 1 ? 0 : h + 1,
        y = 0 === h ? p - 1 : h - 1,
        u = 0,
        V = null;c.copy(t.edges[h]), l.copy(r).sub(i[h]), e && l.len2() > s && (e.aInB = !1);var T = voronoiRegion(c, l);if (T === LEFT_VORONOI_REGION) {
      c.copy(t.edges[y]);var f = T_VECTORS.pop().copy(r).sub(i[y]);if (T = voronoiRegion(c, f), T === RIGHT_VORONOI_REGION) {
        var R = l.len();if (R > n) return T_VECTORS.push(r), T_VECTORS.push(c), T_VECTORS.push(l), T_VECTORS.push(f), !1;e && (e.bInA = !1, V = l.normalize(), u = n - R);
      }T_VECTORS.push(f);
    } else if (T === RIGHT_VORONOI_REGION) {
      if (c.copy(t.edges[a]), l.copy(r).sub(i[a]), T = voronoiRegion(c, l), T === LEFT_VORONOI_REGION) {
        var R = l.len();if (R > n) return T_VECTORS.push(r), T_VECTORS.push(c), T_VECTORS.push(l), !1;e && (e.bInA = !1, V = l.normalize(), u = n - R);
      }
    } else {
      var O = c.perp().normalize(),
          R = l.dot(O),
          v = Math.abs(R);if (R > 0 && v > n) return T_VECTORS.push(r), T_VECTORS.push(O), T_VECTORS.push(l), !1;e && (V = O, u = n - R, (R >= 0 || 2 * n > u) && (e.bInA = !1));
    }V && e && Math.abs(u) < Math.abs(e.overlap) && (e.overlap = u, e.overlapN.copy(V));
  }return e && (e.a = t, e.b = o, e.overlapV.copy(e.overlapN).scale(e.overlap)), T_VECTORS.push(r), T_VECTORS.push(c), T_VECTORS.push(l), !0;
}function testCirclePolygon(t, o, e) {
  var r = testPolygonCircle(o, t, e);if (r && e) {
    var n = e.a,
        s = e.aInB;e.overlapN.reverse(), e.overlapV.reverse(), e.a = e.b, e.b = n, e.aInB = e.bInA, e.bInA = s;
  }return r;
}function testPolygonPolygon(t, o, e) {
  for (var r = t.calcPoints, n = r.length, s = o.calcPoints, i = s.length, p = 0; n > p; p++) {
    if (isSeparatingAxis(t.pos, o.pos, r, s, t.normals[p], e)) return !1;
  }for (var p = 0; i > p; p++) {
    if (isSeparatingAxis(t.pos, o.pos, r, s, o.normals[p], e)) return !1;
  }return e && (e.a = t, e.b = o, e.overlapV.copy(e.overlapN).scale(e.overlap)), !0;
}var SAT = {};SAT.Vector = Vector, SAT.V = Vector, Vector.prototype.copy = Vector.prototype.copy = function (t) {
  return this.x = t.x, this.y = t.y, this;
}, Vector.prototype.clone = Vector.prototype.clone = function () {
  return new Vector(this.x, this.y);
}, Vector.prototype.perp = Vector.prototype.perp = function () {
  var t = this.x;return this.x = this.y, this.y = -t, this;
}, Vector.prototype.rotate = Vector.prototype.rotate = function (t) {
  var o = this.x,
      e = this.y;return this.x = o * Math.cos(t) - e * Math.sin(t), this.y = o * Math.sin(t) + e * Math.cos(t), this;
}, Vector.prototype.reverse = Vector.prototype.reverse = function () {
  return this.x = -this.x, this.y = -this.y, this;
}, Vector.prototype.normalize = Vector.prototype.normalize = function () {
  var t = this.len();return t > 0 && (this.x = this.x / t, this.y = this.y / t), this;
}, Vector.prototype.add = Vector.prototype.add = function (t) {
  return this.x += t.x, this.y += t.y, this;
}, Vector.prototype.sub = Vector.prototype.sub = function (t) {
  return this.x -= t.x, this.y -= t.y, this;
}, Vector.prototype.scale = Vector.prototype.scale = function (t, o) {
  return this.x *= t, this.y *= o || t, this;
}, Vector.prototype.project = Vector.prototype.project = function (t) {
  var o = this.dot(t) / t.len2();return this.x = o * t.x, this.y = o * t.y, this;
}, Vector.prototype.projectN = Vector.prototype.projectN = function (t) {
  var o = this.dot(t);return this.x = o * t.x, this.y = o * t.y, this;
}, Vector.prototype.reflect = Vector.prototype.reflect = function (t) {
  var o = this.x,
      e = this.y;return this.project(t).scale(2), this.x -= o, this.y -= e, this;
}, Vector.prototype.reflectN = Vector.prototype.reflectN = function (t) {
  var o = this.x,
      e = this.y;return this.projectN(t).scale(2), this.x -= o, this.y -= e, this;
}, Vector.prototype.dot = Vector.prototype.dot = function (t) {
  return this.x * t.x + this.y * t.y;
}, Vector.prototype.len2 = Vector.prototype.len2 = function () {
  return this.dot(this);
}, Vector.prototype.len = Vector.prototype.len = function () {
  return Math.sqrt(this.len2());
}, SAT.Circle = Circle, Circle.prototype.getAABB = Circle.prototype.getAABB = function () {
  var t = this.r,
      o = this.pos.clone().sub(new Vector(t, t));return new Box(o, 2 * t, 2 * t).toPolygon();
}, SAT.Polygon = Polygon, Polygon.prototype.setPoints = Polygon.prototype.setPoints = function (t) {
  var o = !this.points || this.points.length !== t.length;if (o) {
    var e,
        r = this.calcPoints = [],
        n = this.edges = [],
        s = this.normals = [];for (e = 0; e < t.length; e++) {
      r.push(new Vector()), n.push(new Vector()), s.push(new Vector());
    }
  }return this.points = t, this._recalc(), this;
}, Polygon.prototype.setAngle = Polygon.prototype.setAngle = function (t) {
  return this.angle = t, this._recalc(), this;
}, Polygon.prototype.setOffset = Polygon.prototype.setOffset = function (t) {
  return this.offset = t, this._recalc(), this;
}, Polygon.prototype.rotate = Polygon.prototype.rotate = function (t) {
  for (var o = this.points, e = o.length, r = 0; e > r; r++) {
    o[r].rotate(t);
  }return this._recalc(), this;
}, Polygon.prototype.translate = Polygon.prototype.translate = function (t, o) {
  for (var e = this.points, r = e.length, n = 0; r > n; n++) {
    e[n].x += t, e[n].y += o;
  }return this._recalc(), this;
}, Polygon.prototype._recalc = function () {
  var t,
      o = this.calcPoints,
      e = this.edges,
      r = this.normals,
      n = this.points,
      s = this.offset,
      i = this.angle,
      p = n.length;for (t = 0; p > t; t++) {
    var c = o[t].copy(n[t]);c.x += s.x, c.y += s.y, 0 !== i && c.rotate(i);
  }for (t = 0; p > t; t++) {
    var l = o[t],
        h = p - 1 > t ? o[t + 1] : o[0],
        a = e[t].copy(h).sub(l);r[t].copy(a).perp().normalize();
  }return this;
}, Polygon.prototype.getAABB = Polygon.prototype.getAABB = function () {
  for (var t = this.calcPoints, o = t.length, e = t[0].x, r = t[0].y, n = t[0].x, s = t[0].y, i = 1; o > i; i++) {
    var p = t[i];p.x < e ? e = p.x : p.x > n && (n = p.x), p.y < r ? r = p.y : p.y > s && (s = p.y);
  }return new Box(this.pos.clone().add(new Vector(e, r)), n - e, s - r).toPolygon();
}, SAT.Box = Box, Box.prototype.toPolygon = Box.prototype.toPolygon = function () {
  var t = this.pos,
      o = this.w,
      e = this.h;return new Polygon(new Vector(t.x, t.y), [new Vector(), new Vector(o, 0), new Vector(o, e), new Vector(0, e)]);
}, SAT.Response = Response, Response.prototype.clear = Response.prototype.clear = function () {
  return this.aInB = !0, this.bInA = !0, this.overlap = Number.MAX_VALUE, this;
};for (var T_VECTORS = [], i = 0; 10 > i; i++) {
  T_VECTORS.push(new Vector());
}for (var T_ARRAYS = [], i = 0; 5 > i; i++) {
  T_ARRAYS.push([]);
}var T_RESPONSE = new Response(),
    TEST_POINT = new Box(new Vector(), 1e-6, 1e-6).toPolygon();SAT.isSeparatingAxis = isSeparatingAxis;var LEFT_VORONOI_REGION = -1,
    MIDDLE_VORONOI_REGION = 0,
    RIGHT_VORONOI_REGION = 1;SAT.pointInCircle = pointInCircle, SAT.pointInPolygon = pointInPolygon, SAT.testCircleCircle = testCircleCircle, SAT.testPolygonCircle = testPolygonCircle, SAT.testCirclePolygon = testCirclePolygon, SAT.testPolygonPolygon = testPolygonPolygon;
function detectCollision(a, b) {
  if (a instanceof SAT.Circle && b instanceof SAT.Circle) {
    return SAT.testCircleCircle(a, b);
  } else if (a instanceof SAT.Polygon && b instanceof SAT.Circle) {
    return SAT.testPolygonCircle(a, b);
  } else if (a instanceof SAT.Circle && b instanceof SAT.Polygon) {
    return SAT.testCirclePolygon(a, b);
  } else if (a instanceof SAT.Polygon && b instanceof SAT.Polygon) {
    return SAT.testPolygonPolygon(a, b);
  } else {
    throw Error('Unexpected Shape.');
  }
}

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
  thisContext.fullScreen = fullScreen;

  thisContext._cameraX = 0;
  thisContext._cameraY = 0;
  Object.defineProperty(thisContext, 'cameraX', {
    get: function get() {
      return thisContext._cameraX;
    },
    set: function set(value) {
      thisContext.maxX = value + this.width / 2;
      thisContext.minX = value - this.width / 2;
      thisContext.mouseX += value - thisContext._cameraX;
      thisContext._cameraX = value;
    }
  });
  Object.defineProperty(thisContext, 'cameraY', {
    get: function get() {
      return thisContext._cameraY;
    },
    set: function set(value) {
      thisContext.maxY = value + this.height / 2;
      thisContext.minY = value - this.height / 2;
      thisContext.mouseY += value - thisContext._cameraY;
      thisContext._cameraY = value;
    }
  });

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
    if (typeof func != "function") {
      throw new TypeError("ready(function) requires one function input.");
    }

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
    if (typeof width != "number" || typeof height != "number") {
      throw new TypeError("setBackdropSize(width, height) requires two number inputs.");
    }
    if (thisContext.fullScreen) {
      throw Error("You cannot manually set the backdrop size in full-screen mode. You can full-screen mode off with: fullScreen = false.");
    } else {
      thisContext._setCanvasSize(width, height);
    }
  };

  thisContext._setCanvasSize = function (width, height) {
    thisContext.height = height;
    thisContext.width = width;
    thisContext.minX = thisContext.cameraX - thisContext.width / 2;
    thisContext.maxX = thisContext.cameraX + thisContext.width / 2;
    thisContext.minY = thisContext.cameraY - thisContext.height / 2;
    thisContext.maxY = thisContext.cameraY + thisContext.height / 2;

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
    if (arguments.length > 0) {
      throw new TypeError("randomX() requires no inputs.");
    }
    return Woof.prototype.random(thisContext.minX, thisContext.maxX);
  };

  thisContext.randomY = function () {
    if (arguments.length > 0) {
      throw new TypeError("randomY() requires no inputs.");
    }
    return Woof.prototype.random(thisContext.minY, thisContext.maxY);
  };

  thisContext._renderBackdrop = function () {
    thisContext._backdropContext.clearRect(0, 0, thisContext.width, thisContext.height);
    if (thisContext.backdrop instanceof BrowserImage) {
      thisContext._backdropContext.drawImage(thisContext.backdrop, 0, 0, thisContext.width, thisContext.height);
    } else if (typeof thisContext.backdrop == "string") {
      thisContext._backdropContext.save();
      thisContext._backdropContext.fillStyle = thisContext.backdrop;
      thisContext._backdropContext.fillRect(0, 0, thisContext.width, thisContext.height);
      thisContext._backdropContext.restore();
    }
  };

  thisContext.setBackdropURL = function (url) {
    if (typeof url != "string") {
      throw new TypeError("setBackDropUrl(url) requires one string input.");
    }
    var backdrop = new BrowserImage();
    backdrop.src = url;
    thisContext.backdrop = backdrop;
    thisContext.backdrop.onload = function () {
      thisContext.ready(thisContext._renderBackdrop);
    };
  };

  thisContext.setBackdropColor = function (color) {
    if (typeof color != "string") {
      throw new TypeError("setBackdropColor() takes one string input.");
    }
    thisContext.backdrop = color;
    thisContext.ready(thisContext._renderBackdrop);
  };

  thisContext.freezing = false;
  thisContext.freeze = function () {
    if (arguments.length > 0) {
      throw new TypeError("freeze() requires no inputs.");
    }
    if (thisContext.freezing || thisContext.stopped) {
      return;
    }
    thisContext.freezing = true;
    thisContext._render();
    thisContext.after(10, "miliseconds", function () {
      return thisContext.stopped = true;
    });
  };
  thisContext.defrost = function () {
    if (arguments.length > 0) {
      throw new TypeError("defrost() requires no inputs.");
    }
    thisContext.stopped = false;
  };

  thisContext.translateToCenter = function (x, y) {
    return [x - thisContext.width / 2 + thisContext.cameraX - thisContext._spriteCanvas.offsetLeft, thisContext.height / 2 - y + thisContext.cameraY + thisContext._spriteCanvas.offsetTop];
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
  thisContext.ready(function () {
    thisContext._spriteCanvas.addEventListener("mousedown", function (event) {
      thisContext.mouseDown = true;

      var _thisContext$translat = thisContext.translateToCenter(event.clientX, event.clientY);

      var _thisContext$translat2 = _slicedToArray(_thisContext$translat, 2);

      thisContext.mouseX = _thisContext$translat2[0];
      thisContext.mouseY = _thisContext$translat2[1];
    });
    window.addEventListener("mouseup", function (event) {
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

    thisContext._onMouseMoveHandler = function (event) {
      var _thisContext$translat11 = thisContext.translateToCenter(event.clientX, event.clientY);

      var _thisContext$translat12 = _slicedToArray(_thisContext$translat11, 2);

      var mouseX = _thisContext$translat12[0];
      var mouseY = _thisContext$translat12[1];

      thisContext._onMouseMoves.forEach(function (func) {
        func(mouseX, mouseY);
      });
    };
    thisContext._spriteCanvas.addEventListener("mousemove", thisContext._onMouseMoveHandler);
    thisContext._onMouseDownHandler = function (event) {
      var _thisContext$translat13 = thisContext.translateToCenter(event.clientX, event.clientY);

      var _thisContext$translat14 = _slicedToArray(_thisContext$translat13, 2);

      var mouseX = _thisContext$translat14[0];
      var mouseY = _thisContext$translat14[1];

      thisContext._onMouseDowns.forEach(function (func) {
        func(mouseX, mouseY);
      });
    };
    thisContext._spriteCanvas.addEventListener("mousedown", thisContext._onMouseDownHandler);
    thisContext._onMouseUpHandler = function (event) {
      var _thisContext$translat15 = thisContext.translateToCenter(event.clientX, event.clientY);

      var _thisContext$translat16 = _slicedToArray(_thisContext$translat15, 2);

      var mouseX = _thisContext$translat16[0];
      var mouseY = _thisContext$translat16[1];

      thisContext._onMouseUps.forEach(function (func) {
        func(mouseX, mouseY);
      });
    };
    thisContext._spriteCanvas.addEventListener("mouseup", thisContext._onMouseUpHandler);

    thisContext._onKeyDownHandler = function (event) {
      var key = Woof.prototype.keyCodeToString(event.keyCode);
      thisContext._onKeyDowns.forEach(function (func) {
        func(key);
      });
    };
    document.body.addEventListener("keydown", thisContext._onKeyDownHandler);
    thisContext._onKeyUpHandler = function (event) {
      var key = Woof.prototype.keyCodeToString(event.keyCode);
      thisContext._onKeyUps.forEach(function (func) {
        func(key);
      });
    };
    document.body.addEventListener("keyup", thisContext._onKeyUpHandler);
  });
  thisContext._onMouseMoves = [];
  thisContext.onMouseMove = function (func) {
    if (typeof func != "function") {
      throw new TypeError("onMouseMove(function) requires one function input.");
    }
    thisContext._onMouseMoves.push(func);
  };
  thisContext._onMouseDowns = [];
  thisContext.onMouseDown = function (func) {
    if (typeof func != "function") {
      throw new TypeError("onMouseDown(function) requires one function input.");
    }
    thisContext._onMouseDowns.push(func);
  };
  thisContext._onMouseUps = [];
  thisContext.onMouseUp = function (func) {
    if (typeof func != "function") {
      throw new TypeError("onMouseUp(function) requires one function input.");
    }
    thisContext._onMouseUps.push(func);
  };

  thisContext._onKeyDowns = [];
  thisContext.onKeyDown = function (func) {
    if (typeof func != "function") {
      throw new TypeError("onKeyDown(function) requires one function input.");
    }
    thisContext._onKeyDowns.push(func);
  };
  thisContext._onKeyUps = [];
  thisContext.onKeyUp = function (func) {
    if (typeof func != "function") {
      throw new TypeError("onKeyUp(function) requires one function input.");
    }
    thisContext._onKeyUps.push(func);
  };

  thisContext._everys = [];
  thisContext.every = function (time, units, func) {
    var milis = Woof.prototype.unitsToMiliseconds(time, units);
    if (typeof func != "function" || typeof time != "number") {
      throw new TypeError("every(time, units, function) requires a number, unit and function input.");
    }
    func();
    thisContext._everys.push(setInterval(func, milis));
  };
  thisContext.forever = function (func) {
    if (typeof func != "function") {
      throw new TypeError("forever(function) requires one function input.");
    }
    thisContext.repeatUntil(function () {
      return false;
    }, func);
  };

  thisContext.when = function (condition, func) {
    if (typeof func != "function" || typeof condition != "function") {
      throw new TypeError("when(conditionFunction, function) requires two function inputs.");
    }
    thisContext.forever(function () {
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
  thisContext.repeat = function (times, func, after) {
    if (typeof func != "function" || typeof times != "number" || after !== undefined && typeof after != "function") {
      throw new TypeError("repeat(times, function, afterFunction) requires a number and a function, and optionally accepts an extra function.");
    }
    thisContext._repeats.push(new Woof.prototype.Repeat(times, func, after));
  };
  thisContext.repeatUntil = function (condition, func, after) {
    if (typeof func != "function" || typeof condition != "function" || after !== undefined && typeof after != "function") {
      throw new TypeError("repeatUntil(conditionFunction, function, afterFunction) requires two functions, and optionally accepts an extra function.");
    }
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
    var milis = Woof.prototype.unitsToMiliseconds(time, units);
    if (typeof func != "function" || typeof time != "number") {
      throw new TypeError("after(time, units, function) requires a number, unit and function input.");
    }
    thisContext._afters.push(setTimeout(func, milis));
  };

  thisContext._renderSprites = function () {
    thisContext._spriteContext.clearRect(0, 0, thisContext.width, thisContext.height);
    thisContext.sprites.forEach(function (sprite) {
      sprite._render(thisContext._spriteContext);
    });
  };

  thisContext.clearPen = function () {
    if (arguments.length > 0) {
      throw new TypeError("clearPen() requires no inputs.");
    }
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
  var _ref3$penDown = _ref3.penDown;
  var penDown = _ref3$penDown === undefined ? false : _ref3$penDown;
  var _ref3$showCollider = _ref3.showCollider;
  var showCollider = _ref3$showCollider === undefined ? false : _ref3$showCollider;
  var _ref3$brightness = _ref3.brightness;
  var brightness = _ref3$brightness === undefined ? 100 : _ref3$brightness;

  if (!project) {
    if (global) {
      this.project = window;
    } else {
      throw new TypeError("When not in global mode, you must supply your {project: project} to each Sprite.");
    }
  } else {
    this.project = project.global ? window : project;
  }
  this.project.sprites.push(this);

  Object.defineProperty(this, 'x', {
    get: function get() {
      return this.privateX;
    },
    set: function set(value) {
      if (typeof value != "number") {
        throw new TypeError("sprite.x can only be set to a number.");
      }
      this.privateX = value;
      this.project.ready(this.trackPen);
    }
  });

  Object.defineProperty(this, 'y', {
    get: function get() {
      return this.privateY;
    },
    set: function set(value) {
      if (typeof value != "number") {
        throw new TypeError("sprite.y can only be set to a number.");
      }
      this.privateY = value;
      this.project.ready(this.trackPen);
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
  this.showCollider = showCollider;
  this.brightness = brightness;

  this.toJSON = function () {
    return { x: _this.x, y: _this.y, angle: _this.angle, rotationStyle: _this.rotationStyle, showing: _this.showing, penDown: _this._penDown, penColor: _this.penColor, penWidth: _this.penWidth, deleted: _this.deleted };
  };

  var _ref4 = [this.x, this.y];
  this.lastX = _ref4[0];
  this.lastY = _ref4[1];

  this.trackPen = function () {
    if (_this._penDown) {
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

  this.rotatedVector = function (x, y) {
    var rotatedX = Math.cos(this.radians()) * (x - this.x) - Math.sin(this.radians()) * (y - this.y) + this.x;
    var rotatedY = Math.sin(this.radians()) * (x - this.x) + Math.cos(this.radians()) * (y - this.y) + this.y;
    return new SAT.Vector(rotatedX, rotatedY);
  };

  this.translatedVector = function (pos, v) {
    return new SAT.Vector(v.x - pos.x, v.y - pos.y);
  };

  this.collider = function () {
    var pos = this.rotatedVector(this.x - this.width / 2, this.y - this.height / 2);
    var v1 = new SAT.Vector(0, 0);
    var v2 = this.translatedVector(pos, this.rotatedVector(this.x + this.width / 2, this.y - this.height / 2));
    var v3 = this.translatedVector(pos, this.rotatedVector(this.x + this.width / 2, this.y + this.height / 2));
    var v4 = this.translatedVector(pos, this.rotatedVector(this.x - this.width / 2, this.y + this.height / 2));

    return new SAT.Polygon(pos, [v1, v2, v3, v4]);
  };

  this._renderCollider = function (context) {
    var collider = this.collider();

    context.save();
    context.beginPath();
    context.moveTo.apply(context, _toConsumableArray(this.project.translateToCanvas(collider.calcPoints[0].x + collider.pos.x, collider.calcPoints[0].y + collider.pos.y)));
    context.lineTo.apply(context, _toConsumableArray(this.project.translateToCanvas(collider.calcPoints[1].x + collider.pos.x, collider.calcPoints[1].y + collider.pos.y)));
    context.lineTo.apply(context, _toConsumableArray(this.project.translateToCanvas(collider.calcPoints[2].x + collider.pos.x, collider.calcPoints[2].y + collider.pos.y)));
    context.lineTo.apply(context, _toConsumableArray(this.project.translateToCanvas(collider.calcPoints[3].x + collider.pos.x, collider.calcPoints[3].y + collider.pos.y)));
    context.lineTo.apply(context, _toConsumableArray(this.project.translateToCanvas(collider.calcPoints[0].x + collider.pos.x, collider.calcPoints[0].y + collider.pos.y)));
    context.strokeStyle = "green";
    context.lineWidth = 4;
    context.stroke();

    context.restore();
  };

  this._render = function (context) {
    if (this.showing && !this.deleted && this.overlap(this.project.bounds())) {
      if (this.showCollider) {
        this._renderCollider(context);
      }

      context.save();
      context.translate(Math.round(this.canvasX()), Math.round(this.canvasY()));
      context.globalAlpha = this.brightness / 100;

      if (this.rotationStyle == "ROTATE") {
        context.rotate(-this.radians());
      } else if (this.rotationStyle == "NO ROTATE") {
        // no rotate
      } else if (this.rotationStyle == "ROTATE LEFT RIGHT") {
          if (this.angle % 360 >= 90 && this.angle % 360 < 270) {
            context.scale(-1, 1);
          } else if (this.angle % 360 >= 0 && this.angle % 360 < 90 || this.angle % 360 <= 360 && this.angle % 360 >= 270) {
            // no rotate
          }
        }

      this.render(context);
      context.restore();
    }
  };

  this.distanceTo = function distanceTo(xGiven, yGiven) {
    if (arguments.length === 1) {
      if ((typeof xGiven === 'undefined' ? 'undefined' : _typeof(xGiven)) == "object") {
        var x = this.x - xGiven.x;
        var y = this.y - xGiven.y;
        return Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
      } else {
        throw new TypeError("distanceTo(sprite) requires one sprite input.");
      }
    } else if (typeof xGiven != "number" || typeof yGiven != "number") {
      throw new TypeError("distanceTo(x,y) requires two number inputs.");
    } else {
      var x = this.x - xGiven;
      var y = this.y - yGiven;
      return Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
    }
  };

  this.move = function () {
    var steps = arguments.length <= 0 || arguments[0] === undefined ? 1 : arguments[0];

    if (typeof steps != "number") {
      throw new TypeError("move(steps) requires one number input.");
    }
    this.privateX += steps * Math.cos(this.radians());
    this.privateY += steps * Math.sin(this.radians());
    this.project.ready(this.trackPen);
  };

  this.setRotationStyle = function (style) {
    if (style == "ROTATE") {
      _this.rotationStyle = "ROTATE";
    } else if (style == "NO ROTATE") {
      _this.rotationStyle = "NO ROTATE";
    } else if (style == "ROTATE LEFT RIGHT") {
      _this.rotationStyle = "ROTATE LEFT RIGHT";
    } else {
      throw TypeError("Unrecognized rotation style: " + style);
    }
  };

  this.radians = function () {
    return _this.angle * Math.PI / 180;
  };

  this.canvasX = function () {
    return _this.x - _this.project.cameraX + _this.project.width / 2;
  };

  this.canvasY = function () {
    return _this.project.height / 2 - (_this.y - _this.project.cameraY);
  };

  this.bounds = function () {
    var halfWidth = _this.width / 2;
    var halfHeight = _this.height / 2;

    var left = _this.x - halfWidth;
    var right = _this.x + halfWidth;
    var bottom = _this.y - halfHeight;
    var top = _this.y + halfHeight;
    return { left: left, right: right, top: top, bottom: bottom };
  };

  this.collisionCanvas = document.createElement('canvas');
  this.collisionContext = this.collisionCanvas.getContext('2d');

  this.touching = function (sprite, precise) {
    if (!((typeof sprite === 'undefined' ? 'undefined' : _typeof(sprite)) == "object")) {
      throw new TypeError("touching(sprite) requires one sprite input.");
    }

    if (_this.deleted || !_this.showing) {
      return false;
    }
    if (sprite.deleted || !sprite.showing) {
      return false;
    }

    if (!detectCollision(_this.collider(), sprite.collider())) {
      return false;
    }

    if (!precise) {
      return true;
    }

    var r1 = _this.bounds();
    var r2 = sprite.bounds();
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
    if (typeof x != "number" || typeof y != "number") {
      throw new TypeError("over(x, y) requires two number inputs.");
    }
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

  Object.defineProperty(this, 'mouseOver', {
    get: function get() {
      if (this.deleted || !this.showing) {
        return false;
      }
      return this.over(this.project.mouseX, this.project.mouseY);
    }
  });

  Object.defineProperty(this, 'mouseDown', {
    get: function get() {
      if (this.deleted || !this.showing) {
        return false;
      }
      return this.mouseOver && this.project.mouseDown;
    }
  });

  this.turnLeft = function () {
    var degrees = arguments.length <= 0 || arguments[0] === undefined ? 1 : arguments[0];

    if (typeof degrees != "number") {
      throw new TypeError("turnLeft(degrees) requires one number input.");
    }
    _this.angle += degrees;
  };

  this.turnRight = function () {
    var degrees = arguments.length <= 0 || arguments[0] === undefined ? 1 : arguments[0];

    if (typeof degrees != "number") {
      throw new TypeError("turnRight(degrees) requires one number input.");
    }
    _this.angle -= degrees;
  };

  this.sendToBack = function () {
    if (arguments.length > 0) {
      throw new TypeError("sendToBack() requires no inputs.");
    }
    var sprites = this.project.sprites;
    sprites.splice(0, 0, sprites.splice(sprites.indexOf(this), 1)[0]);
  };

  this.sendToFront = function () {
    if (arguments.length > 0) {
      throw new TypeError("sendToFront() requires no inputs.");
    }
    var sprites = this.project.sprites;
    sprites.splice(sprites.length, 0, sprites.splice(sprites.indexOf(this), 1)[0]);
  };

  Object.defineProperty(this, 'penDown', {
    get: function get() {
      return function () {
        _this._penDown = true;
      };
    },
    set: function set(value) {
      _this._penDown = value;
    }
  });
  this.penUp = function () {
    _this._penDown = false;
  };

  this.show = function () {
    _this.showing = true;
  };
  this.hide = function () {
    _this.showing = false;
  };

  this.pointTowards = function (x2, y2) {
    if (arguments.length === 1) {
      if ((typeof x2 === 'undefined' ? 'undefined' : _typeof(x2)) == "object") {
        this.angle = Math.atan2(x2.y - this.y, x2.x - this.x) * 180 / Math.PI;
      } else {
        throw new TypeError("pointTowards(sprite) requires one sprite input.");
      }
    } else if (typeof x2 != "number" || typeof y2 != "number") {
      throw new TypeError("pointTowards(x, y) requires two number inputs.");
    } else {
      this.angle = Math.atan2(y2 - this.y, x2 - this.x) * 180 / Math.PI;
    }
  };

  this._onMouseDowns = [];
  this.onMouseDown = function (func) {
    if (typeof func != "function") {
      throw new TypeError("onMouseDown(function) requires one function input.");
    }
    _this._onMouseDowns.push(func);
  };
  this._onMouseDownHandler = function (event) {
    var _project$translateToC3 = _this.project.translateToCenter(event.clientX, event.clientY);

    var _project$translateToC4 = _slicedToArray(_project$translateToC3, 2);

    var mouseX = _project$translateToC4[0];
    var mouseY = _project$translateToC4[1];

    if (_this.showing && _this.over(mouseX, mouseY)) {
      _this._onMouseDowns.forEach(function (func) {
        func(mouseX, mouseY);
      });
    }
  };
  this._onMouseUps = [];
  this.onMouseUp = function (func) {
    if (typeof func != "function") {
      throw new TypeError("onMouseUp(function) requires one function input.");
    }
    _this._onMouseUps.push(func);
  };
  this._onMouseUpHandler = function (event) {
    var _project$translateToC5 = _this.project.translateToCenter(event.clientX, event.clientY);

    var _project$translateToC6 = _slicedToArray(_project$translateToC5, 2);

    var mouseX = _project$translateToC6[0];
    var mouseY = _project$translateToC6[1];

    if (_this.showing && _this.over(mouseX, mouseY)) {
      _this._onMouseUps.forEach(function (func) {
        func(mouseX, mouseY);
      });
    }
  };
  this.project.ready(function () {
    _this.project._spriteCanvas.addEventListener("mousedown", _this._onMouseDownHandler);
    _this.project._spriteCanvas.addEventListener("mouseup", _this._onMouseUpHandler);
  });

  this.delete = function () {
    if (arguments.length > 0) {
      throw new TypeError("delete() requires no inputs.");
    }
    if (this.deleted) {
      return;
    }
    this.showing = false;
    this.deleted = true;
    if (this.project.sprites.includes(this)) {
      this.project.sprites.splice(this.project.sprites.indexOf(this), 1);
      this.project._spriteCanvas.removeEventListener("mousedown", this._onClickHandler);
    }
  };
};

Woof.prototype.Text = function () {
  var _this4 = this;

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

  this.type = "text";
  // TODO remove text align or make the collider take it into account
  Woof.prototype.Sprite.call(this, arguments[0]);
  this.text = text;
  this.size = Math.abs(size);
  this.color = color;
  this.fontFamily = fontFamily;
  this.textAlign = textAlign;

  Object.defineProperty(this, 'width', {
    get: function get() {
      var _this2 = this;

      var width;
      this._applyInContext(function () {
        width = _this2.project._spriteContext.measureText(_this2.textEval()).width;
      });
      return width;
    },
    set: function set(value) {
      throw new TypeError("You cannot modify the width of Text. You can only change its size.");
    }
  });

  Object.defineProperty(this, 'height', {
    get: function get() {
      var _this3 = this;

      var height;
      this._applyInContext(function () {
        height = _this3.project._spriteContext.measureText("M").width;
      });
      return height;
    },
    set: function set(value) {
      throw new TypeError("You cannot modify the height of Text. You can only change its size.");
    }
  });

  this._applyInContext = function (func) {
    _this4.project._spriteContext.save();

    _this4.project._spriteContext.font = _this4.size + "px " + _this4.fontFamily;
    _this4.project._spriteContext.fillStyle = _this4.color;
    _this4.project._spriteContext.textAlign = _this4.textAlign;

    func();

    _this4.project._spriteContext.restore();
  };

  this.textEval = function () {
    if (typeof _this4.text == "function") {
      try {
        return _this4.text();
      } catch (e) {
        console.error("Error with text function: " + e.message);
      }
    } else {
      return _this4.text;
    }
  };

  this.render = function (context) {
    _this4._applyInContext(function () {
      context.fillText(_this4.textEval(), 0, _this4.height / 2);
    });
  };
};

Woof.prototype.Circle = function () {
  var _this5 = this;

  var _ref8 = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  var _ref8$project = _ref8.project;
  var project = _ref8$project === undefined ? undefined : _ref8$project;
  var _ref8$radius = _ref8.radius;
  var radius = _ref8$radius === undefined ? 10 : _ref8$radius;
  var _ref8$color = _ref8.color;
  var color = _ref8$color === undefined ? "black" : _ref8$color;

  this.type = "circle";
  Woof.prototype.Sprite.call(this, arguments[0]);
  this.radius = Math.abs(radius);
  this.color = color;

  Object.defineProperty(this, 'width', {
    get: function get() {
      return 2 * this.radius;
    },
    set: function set(value) {
      throw new TypeError("You cannot modify the width of Circle. You can only change its radius.");
    }
  });

  Object.defineProperty(this, 'height', {
    get: function get() {
      return 2 * this.radius;
    },
    set: function set(value) {
      throw new TypeError("You cannot modify the height of Circle. You can only change its radius.");
    }
  });

  this.render = function (context) {
    context.beginPath();
    context.arc(0, 0, _this5.radius, 0, 2 * Math.PI);
    context.fillStyle = _this5.color;
    context.fill();
  };
};

Woof.prototype.Rectangle = function () {
  var _this6 = this;

  var _ref9 = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  var _ref9$project = _ref9.project;
  var project = _ref9$project === undefined ? undefined : _ref9$project;
  var _ref9$height = _ref9.height;
  var height = _ref9$height === undefined ? 10 : _ref9$height;
  var _ref9$width = _ref9.width;
  var width = _ref9$width === undefined ? 10 : _ref9$width;
  var _ref9$color = _ref9.color;
  var color = _ref9$color === undefined ? "black" : _ref9$color;

  this.type = "rectangle";
  Woof.prototype.Sprite.call(this, arguments[0]);
  this.rectangleHeight = Math.abs(height);
  this.rectangleWidth = Math.abs(width);
  this.color = color;

  Object.defineProperty(this, 'width', {
    get: function get() {
      return this.rectangleWidth;
    },
    set: function set(value) {
      if (typeof value != "number") {
        throw new TypeError("rectangle.width can only be set to a number.");
      }
      this.rectangleWidth = value;
    }
  });

  Object.defineProperty(this, 'height', {
    get: function get() {
      return this.rectangleHeight;
    },
    set: function set(value) {
      if (typeof value != "number") {
        throw new TypeError("rectangle.height can only be set to a number.");
      }
      this.rectangleHeight = value;
    }
  });

  this.render = function (context) {
    context.fillStyle = _this6.color;
    context.fillRect(-_this6.width / 2, -_this6.height / 2, _this6.width, _this6.height);
  };
};

Woof.prototype.Line = function () {
  var _this7 = this;

  var _ref10 = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  var _ref10$project = _ref10.project;
  var project = _ref10$project === undefined ? undefined : _ref10$project;
  var _ref10$width = _ref10.width;
  var width = _ref10$width === undefined ? 1 : _ref10$width;
  var _ref10$x = _ref10.x1;
  var x1 = _ref10$x === undefined ? 10 : _ref10$x;
  var _ref10$y = _ref10.y1;
  var y1 = _ref10$y === undefined ? 10 : _ref10$y;
  var _ref10$color = _ref10.color;
  var color = _ref10$color === undefined ? "black" : _ref10$color;

  this.type = "line";
  // TODO make this a helper to create a rectangle so that we can more easily reason about lines and colliders
  Woof.prototype.Sprite.call(this, arguments[0]);
  this.x1 = x1;
  this.y1 = y1;
  this.color = color;
  this.lineWidth = Math.abs(width);

  Object.defineProperty(this, 'width', {
    get: function get() {
      return this.lineWidth;
    },
    set: function set(value) {
      if (typeof value != "number") {
        throw new TypeError("line.width can only be set to a number.");
      }
      this.lineWidth = value;
    }
  });

  Object.defineProperty(this, 'height', {
    get: function get() {
      return Math.sqrt(Math.pow(this.x - this.x1, 2) + Math.pow(this.y - this.y1, 2));
    },
    set: function set(value) {
      throw new TypeError("You cannot set line.height directly. You can only modify line.height by changing the length of your line through moving its points.");
    }
  });

  this.render = function (context) {
    context.beginPath();
    context.moveTo(0, 0);
    context.lineTo(_this7.x1 - _this7.x, -_this7.y1 + _this7.y);
    context.strokeStyle = _this7.color;
    context.lineWidth = _this7.lineWidth;
    context.stroke();
  };
};

Woof.prototype.Image = function () {
  var _this8 = this;

  var _ref11 = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  var _ref11$project = _ref11.project;
  var project = _ref11$project === undefined ? undefined : _ref11$project;
  var _ref11$url = _ref11.url;
  var url = _ref11$url === undefined ? "https://i.imgur.com/SMJjVCL.png/?1" : _ref11$url;
  var height = _ref11.height;
  var width = _ref11.width;

  this.type = "image";
  Woof.prototype.Sprite.call(this, arguments[0]);
  this.imageHeight = Math.abs(height);
  this.imageWidth = Math.abs(width);

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

  Object.defineProperty(this, 'width', {
    get: function get() {
      return this.imageWidth || this.image.width;
    },
    set: function set(value) {
      if (typeof value != "number") {
        throw new TypeError("image.width can only be set to a number.");
      }
      this.imageWidth = value;
    }
  });

  Object.defineProperty(this, 'height', {
    get: function get() {
      return this.imageHeight || this.image.height;
    },
    set: function set(value) {
      if (typeof value != "number") {
        throw new TypeError("image.width can only be set to a number.");
      }
      this.imageHeight = value;
    }
  });

  this.render = function (context) {
    context.drawImage(_this8.image, -_this8.width / 2, -_this8.height / 2, _this8.width, _this8.height);
  };
};

Woof.prototype.customSprite = function (render) {
  return function () {
    var _ref12 = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    var _ref12$project = _ref12.project;
    var project = _ref12$project === undefined ? undefined : _ref12$project;

    Woof.prototype.Sprite.call(this, arguments[0]);
    this.render = render;
  };
};

Woof.prototype.Repeat = function (times, func, after) {
  var _this9 = this;

  this.func = func;
  this.times = times;
  this.done = false;

  this.next = function () {
    if (_this9.done) {
      return;
    }
    if (_this9.times <= 0) {
      _this9.done = true;
      if (after) {
        after();
      }
      return;
    } else {
      _this9.func();
      _this9.times--;
    }
  };
};

Woof.prototype.RepeatUntil = function (condition, func, after) {
  var _this10 = this;

  // TODO if (typeof condition !== "string") { throw Error("You must give repeatUntil a string condition in quotes. You gave it: " + condition); }
  this.func = func;
  this.condition = condition;
  this.done = false;

  this.next = function () {
    if (_this10.done) {
      return;
    }
    var cond;
    try {
      cond = _this10.condition();
    } catch (e) {
      console.error("Error in Repeat Until condition");
      throw e;
    }

    if (cond) {
      _this10.done = true;
      if (after) {
        after();
      }
      return;
    } else {
      _this10.func();
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
  } else if (keyCode == 9) {
    return "TAB";
  } else if (keyCode == 13) {
    return "ENTER";
  } else if (keyCode == 16) {
    return "SHIFT";
  } else if (keyCode == 17) {
    return "CTRL";
  } else if (keyCode == 18) {
    return "ALT";
  } else if (keyCode == 27) {
    return "ESCAPE";
  } else if (keyCode == 32) {
    return "SPACE";
  } else if (keyCode == 192) {
    return "`";
  } else if (keyCode == 186) {
    return ";";
  } else if (keyCode == 222) {
    return "'";
  } else if (keyCode == 189) {
    return "-";
  } else if (keyCode == 187) {
    return "=";
  } else if (keyCode == 219) {
    return "[";
  } else if (keyCode == 220) {
    return "\\";
  } else if (keyCode == 191) {
    return "/";
  } else if (keyCode == 190) {
    return ".";
  } else if (keyCode == 191) {
    return "/";
  } else if (keyCode == 188) {
    return ",";
  } else if (keyCode == 20) {
    return "CAPS LOCK";
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
    throw TypeError("Unrecognized Time");
  }
};

Woof.prototype.random = function (a, b) {
  if (typeof a != "number" || typeof b != "number") {
    throw new TypeError("random(a, b) requires two number inputs.");
  }

  var min = Math.min.apply(Math, [a, b]),
      max = Math.max.apply(Math, [a, b]);

  var rand = Math.random() * (max - min) + min;
  if (Number.isInteger(min) && Number.isInteger(max)) {
    return Math.round(rand);
  } else {
    return rand;
  }
};

Woof.prototype.dayOfMonth = function () {
  if (arguments.length > 0) {
    throw new TypeError("dayOfMonth() requires no inputs.");
  }
  var date = new Date();
  return date.getDate();
};

Woof.prototype.dayOfWeek = function () {
  if (arguments.length > 0) {
    throw new TypeError("dayOfWeek() requires no inputs.");
  }
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
  if (arguments.length > 0) {
    throw new TypeError("hourMilitary() requires no inputs.");
  }
  var date = new Date();
  return date.getHours();
};

Woof.prototype.hour = function () {
  if (arguments.length > 0) {
    throw new TypeError("hour() requires no inputs.");
  }
  var date = new Date();
  var hour = date.getHours();
  return hour <= 12 ? hour : hour - 12;
};

Woof.prototype.minute = function () {
  if (arguments.length > 0) {
    throw new TypeError("minute() requires no inputs.");
  }
  var date = new Date();
  return date.getMinutes();
};

Woof.prototype.year = function () {
  if (arguments.length > 0) {
    throw new TypeError("year() requires no inputs.");
  }
  var date = new Date();
  return date.getFullYear();
};

Woof.prototype.months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
Woof.prototype.month = function () {
  if (arguments.length > 0) {
    throw new TypeError("month() requires no inputs.");
  }
  return Woof.prototype.months[new Date().getMonth()];
};

Woof.prototype.second = function () {
  if (arguments.length > 0) {
    throw new TypeError("second() requires no inputs.");
  }
  var date = new Date();
  return date.getSeconds();
};

Woof.prototype.randomColor = function () {
  if (arguments.length > 0) {
    throw new TypeError("randomColor() requires no inputs.");
  }
  return "rgb(" + Woof.prototype.random(0, 255) + ", " + Woof.prototype.random(0, 255) + ", " + Woof.prototype.random(0, 255) + ")";
};

Woof.prototype.RIGHT = 0;
Woof.prototype.LEFT = 180;
Woof.prototype.UP = 90;
Woof.prototype.DOWN = 270;

Number.prototype.between = function (a, b) {
  if (typeof a != "number" || typeof b != "number") {
    throw new TypeError("between(a, b) requires two number inputs.");
  }
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
  if (typeof callback != "function" || typeof limit != "number") {
    throw new TypeError("throttle(function, limit) requires one function input and one number.");
  }
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

Woof.prototype.rgb = function (red, green, blue) {
  return "rgb(" + red + ", " + green + ", " + blue + ")";
};

Woof.prototype.extend = function (a, b) {
  for (var key in b) {
    a[key] = b[key];
  }
  return a;
};

Woof.prototype.importCodeURL = function (url, callback) {
  var lib = document.createElement("script");
  lib.type = "text/javascript";
  lib.src = url;
  lib.onload = callback;
  document.body.appendChild(lib);
};

if (JSON.parse(document.currentScript.getAttribute('global')) !== false) {
  Woof.prototype.extend(window, new Woof({ global: true, fullScreen: true }));
}
