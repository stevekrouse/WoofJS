"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

// We include SAT.js here as our only "external" dependency to help us detect when rotated sprites intersect. It's not really an "external" dependency because we include it here internally.
// SAT.js - Version 0.6.0 - Copyright 2012 - 2016 - Jim Riecken <jimr@jimr.ca> - released under the MIT License. https://github.com/jriecken/sat-js 
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

// alias Image to BrowserImage because we will overwrite Image with Woof.Image
window.BrowserImage = Image;

function Woof() {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      _ref$global = _ref.global,
      global = _ref$global === undefined ? false : _ref$global,
      _ref$fullScreen = _ref.fullScreen,
      fullScreen = _ref$fullScreen === undefined ? false : _ref$fullScreen,
      _ref$height = _ref.height,
      height = _ref$height === undefined ? 500 : _ref$height,
      _ref$width = _ref.width,
      width = _ref$width === undefined ? 350 : _ref$width;

  if (window.global) throw new Error("You must turn off global mode in the Woof script tag if you want to create your own Woof object.");
  this.global = global;
  // thisContext is either the Woof object or the window, depending on whether or not you start Woof in global mode
  var thisContext = this.global ? window : this;

  thisContext.global = global;
  thisContext.sprites = [];
  thisContext.backdrop = { color: null, type: null, url: null, size: "100% 100%", repeat: "no-repeat" };
  thisContext.stopped = true;
  // internally named fullScreen1 because the keyword "fullScreen" on the global scope was wonky in firefox
  thisContext.fullScreen1 = fullScreen;

  thisContext._cameraX = 0;
  thisContext._cameraY = 0;
  Object.defineProperty(thisContext, 'cameraX', {
    get: function get() {
      return thisContext._cameraX;
    },
    set: function set(value) {
      // whenever the camera is changed, update relevant values
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
      // whenever the camera is changed, update relevant values
      thisContext.maxY = value + this.height / 2;
      thisContext.minY = value - this.height / 2;
      thisContext.mouseY += value - thisContext._cameraY;
      thisContext._cameraY = value;
    }
  });

  Object.defineProperty(thisContext, 'fullScreen', {
    get: function get() {
      return thisContext.fullScreen1;
    },
    set: function set(value) {
      thisContext.fullScreen1 = value;
    }
  });

  if (thisContext.fullScreen1) {
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
    document.documentElement.style.width = "100%";
    document.documentElement.style.height = "100%";
    document.body.style.width = "100%";
    document.body.style.height = "100%";

    // create the main div that Woof lives in
    thisContext._mainDiv = document.createElement("div");
    document.body.appendChild(thisContext._mainDiv);
    thisContext._mainDiv.id = "project";
    thisContext._mainDiv.style.position = "relative";
    thisContext._mainDiv.style.width = "100%";
    thisContext._mainDiv.style.height = "100%";

    // create the canvas where we will draw sprites
    thisContext._spriteCanvas = document.createElement("canvas");
    thisContext._mainDiv.appendChild(thisContext._spriteCanvas);
    thisContext._spriteCanvas.id = "sprites";
    thisContext._spriteCanvas.width = width;
    thisContext._spriteCanvas.height = height;
    thisContext._spriteCanvas.style.zIndex = 3;
    thisContext._spriteCanvas.style.position = "absolute";

    // create the canvas where we will draw the pen
    thisContext._penCanvas = document.createElement("canvas");
    thisContext._mainDiv.appendChild(thisContext._penCanvas);
    thisContext._penCanvas.id = "pen";
    thisContext._penCanvas.width = width;
    thisContext._penCanvas.height = height;
    thisContext._penCanvas.style.zIndex = 2;
    thisContext._penCanvas.style.position = "absolute";

    // create the div where we show the backdrop using CSS
    thisContext._backdropDiv = document.createElement("div");
    thisContext._mainDiv.appendChild(thisContext._backdropDiv);
    thisContext._backdropDiv.id = "backdrop";
    thisContext._backdropDiv.width = width;
    thisContext._backdropDiv.height = height;
    thisContext._backdropDiv.style.zIndex = 1;
    thisContext._backdropDiv.style.position = "absolute";
    thisContext._backdropDiv.style.width = "100%";
    thisContext._backdropDiv.style.height = "100%";

    thisContext._spriteContext = thisContext._spriteCanvas.getContext("2d");
    thisContext._penContext = thisContext._penCanvas.getContext("2d");

    thisContext._runReadys();
  });

  thisContext.setBackdropSize = function (width, height) {
    if (typeof width != "number" || typeof height != "number") {
      throw new TypeError("setBackdropSize(width, height) requires two number inputs.");
    }
    if (thisContext.fullScreen1) {
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

      // when you change the canvas size, you have to copy the pen data onto the newly-sized canvas
      var penData = thisContext._penContext.getImageData(0, 0, width, height);
      thisContext._penCanvas.width = thisContext.width;
      thisContext._penCanvas.height = thisContext.height;
      thisContext._penContext.putImageData(penData, 0, 0);

      thisContext._backdropDiv.style.width = thisContext.width;
      thisContext._backdropDiv.style.height = thisContext.height;
      setTimeout(thisContext._renderBackdrop);
    });
  };
  thisContext._setCanvasSize(width, height);
  window.addEventListener("resize", function () {
    if (thisContext.fullScreen1) {
      thisContext._setCanvasSize(window.innerWidth, window.innerHeight);
    }
  });

  thisContext.bounds = function () {
    return { left: thisContext.minX, right: thisContext.maxX, bottom: thisContext.minY, top: thisContext.maxY };
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
    var _thisContext$backdrop = thisContext.backdrop,
        size = _thisContext$backdrop.size,
        type = _thisContext$backdrop.type,
        url = _thisContext$backdrop.url,
        color = _thisContext$backdrop.color,
        repeat = _thisContext$backdrop.repeat;


    thisContext._backdropDiv.style.background = type === 'url' ? "url('" + url + "')" : color;
    thisContext._backdropDiv.style.backgroundRepeat = repeat;
    thisContext._backdropDiv.style.backgroundSize = size;
  };

  thisContext.setBackdropURL = function (url) {
    if (typeof url != "string") {
      throw new TypeError("setBackDropUrl(url) requires one string input.");
    }
    thisContext.backdrop.url = url;
    thisContext.backdrop.type = 'url';

    var img = new BrowserImage();
    img.onload = function () {
      thisContext.ready(thisContext._renderBackdrop);
    };
    img.onerror = function (e) {
      var error = new Error();
      error.type = "ImageLoadError";
      error.url = url;
      throw error;
    };
    img.src = url;
  };

  thisContext.setBackdropStyle = function (coverOrContain) {
    coverOrContain = coverOrContain.split(' ');
    if (coverOrContain.length > 2) {
      throw Error("setBackdropStyle can take one or two arguments, separated by a space.");
    }
    //match each part of the input, maybe it looks like '50% 50px' or 'auto auto' or just '3em'
    //regex translates to: the word cover on its own, the word contain on its own, at least one digit followed by 'em', at least on digit followed by 'px', at least one digit followed by '%'
    var acceptableSizes = [/^cover$/, /^contain$/, /^\d+em$/, /^\d+px$/, /^\d+%$/, /^auto$/];

    if (!coverOrContain.every(function (prop) {
      return acceptableSizes.some(function (each) {
        return prop.match(each);
      });
    })) {
      throw Error("setBackdropStyle only understands sizes such as 5em, 50px, 50% and the keywords cover, contain, and auto");
    }

    thisContext.backdrop.size = coverOrContain.join(' ');
    thisContext.ready(thisContext._renderBackdrop);
  };
  thisContext.setBackdropRepeat = function (repeatString) {
    var acceptableValues = ["repeat", "no-repeat", "repeat-x", "repeat-y", "space", "round"];
    if (!acceptableValues.includes(repeatString)) {
      throw Error("setBackdropRepeat can only understand one of the following: " + acceptableValues.join(', '));
    }
    thisContext.backdrop.repeat = repeatString;
    thisContext.ready(thisContext._renderBackdrop);
  };

  thisContext.setBackdropColor = function (color) {
    if (typeof color != "string") {
      throw new TypeError("setBackdropColor(color) takes one string input.");
    }
    thisContext.backdrop.color = color;
    thisContext.backdrop.type = 'color';
    thisContext.ready(thisContext._renderBackdrop);
  };

  // WARNING - freeze is notoriously difficult to get right
  // Any change you make to it will have unintended consequenses.
  // Only change this code if absolutely neccesary and after rigerous testing.
  thisContext.freezing = false; // whether or not a freeze is currently in progress
  thisContext.freeze = function () {
    if (arguments.length > 0) {
      throw new TypeError("freeze() requires no inputs.");
    }
    if (thisContext.freezing || thisContext.stopped) {
      return;
    }
    thisContext.freezing = true;
    thisContext.after(10, "miliseconds", function () {
      thisContext.stopped = true;
      thisContext.freezing = false;
    });
  };
  thisContext.defrost = function () {
    if (arguments.length > 0) {
      throw new TypeError("defrost() requires no inputs.");
    }
    thisContext.stopped = false;
  };

  // the HTML canvas puts (0, 0) in the top-left corner of the screen
  // the x-axis works as you'd expect, with x increasing as you move left-to-right
  // the y-axis works counter-intuitively, decreasing as you move up, and increasing as you move down
  // translateToCenter maps coordinates from the HTML canvas to the Scratch-world where (0,0) is in the center of the screen  
  thisContext.translateToCenter = function (x, y) {
    return [x - thisContext.width / 2 + thisContext.cameraX - thisContext._spriteCanvas.offsetLeft, thisContext.height / 2 - y + thisContext.cameraY + thisContext._spriteCanvas.offsetTop];
  };
  // translateToCanvas (the opposite of translateToCenter) maps coordinates from the Scratch-world to the HTML canvas world with (0,0) in the top-left  
  thisContext.translateToCanvas = function (x, y) {
    return [x + thisContext.maxX - thisContext._spriteCanvas.offsetLeft, thisContext.maxY - y + thisContext._spriteCanvas.offsetTop];
  };

  // Below is where we handle mouse and keyboard events
  // The strategy is:
  // 1. Listen to all mouse and keyboard events
  // 2. Keep global values updated, including which keys are down, and whether the mouse is down
  // 3. Run events if we have them for that corresponding event
  thisContext.mouseDown = false;
  thisContext.mouseX = 0;
  thisContext.mouseY = 0;
  thisContext.pMouseX = 0;
  thisContext.pMouseY = 0;
  thisContext.mouseXSpeed = 0;
  thisContext.mouseYSpeed = 0;
  thisContext.keysDown = [];

  //modify keysDown.includes() to not be case-sensitive and to accept more user input possibilities
  thisContext.keysDown.oldIncludes = thisContext.keysDown.includes;
  thisContext.keysDown.includes = function (arg) {
    var key = arg.toUpperCase();

    if (key === "UP ARROW") {
      key = "UP";
    } else if (key === "LEFT ARROW") {
      key = "LEFT";
    } else if (key === "RIGHT ARROW") {
      key = "RIGHT";
    } else if (key === "DOWN ARROW") {
      key = "DOWN";
    } else if (key === "RETURN") {
      key = "ENTER";
    } else if (key === "CONTROL") {
      key = "CTRL";
    } else if (key === "OPTION") {
      key = "ALT";
    } else if (key === "ESC") {
      key = "ESCAPE";
    } else if (key === "SPACE BAR" || key === "SPACEBAR") {
      key = "SPACE";
    } else if (key === "CAPS") {
      key = "CAPS LOCK";
    } else if (key === "DEL" || key === "BACKSPACE") {
      key = "DELETE";
    } else if (key === "CMD" || key === "WINDOWS" || key === "SEARCH") {
      key = "COMMAND";
    }

    return this.oldIncludes(key);
  };

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
      var _thisContext$translat11 = thisContext.translateToCenter(event.clientX, event.clientY),
          _thisContext$translat12 = _slicedToArray(_thisContext$translat11, 2),
          mouseX = _thisContext$translat12[0],
          mouseY = _thisContext$translat12[1];

      thisContext._onMouseMoves.forEach(function (func) {
        func(mouseX, mouseY);
      });
    };
    thisContext._spriteCanvas.addEventListener("mousemove", thisContext._onMouseMoveHandler);
    thisContext._onMouseDownHandler = function (event) {
      var _thisContext$translat13 = thisContext.translateToCenter(event.clientX, event.clientY),
          _thisContext$translat14 = _slicedToArray(_thisContext$translat13, 2),
          mouseX = _thisContext$translat14[0],
          mouseY = _thisContext$translat14[1];

      thisContext._onMouseDowns.forEach(function (func) {
        func(mouseX, mouseY);
      });
    };
    thisContext._spriteCanvas.addEventListener("mousedown", thisContext._onMouseDownHandler);
    thisContext._onMouseUpHandler = function (event) {
      var _thisContext$translat15 = thisContext.translateToCenter(event.clientX, event.clientY),
          _thisContext$translat16 = _slicedToArray(_thisContext$translat15, 2),
          mouseX = _thisContext$translat16[0],
          mouseY = _thisContext$translat16[1];

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
  // The following methods is where we keep track of user's events
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
    if (typeof func != "function" || typeof time != "number" && typeof time != "function") {
      throw new TypeError("every(time, units, function) requires a number/function, time unit and function input.");
    }
    // if the user inputs something like () => random(1, 10) for the time parameter, re-evaluate the function every time it's run, and update the frequency
    if (typeof time == "function") {
      if (typeof time() != "number") {
        throw new TypeError("every(time, units, function) requires a time function that returns a number");
      }

      // create a variable that will be used to store the value of the previous setTimeout()
      var theFunction = function theFunction(timeoutValue) {
        var ms = Woof.prototype.unitsToMiliseconds(time(), units);
        func();
        // if the previous setTimeout() value is in the ._everys array, remove it
        if (timeoutValue && thisContext._everys.includes(timeoutValue)) {
          thisContext._everys.splice(thisContext._everys.indexOf(timeoutValue), 1);
        }
        // use setTimeout() here instead of setInterval() because the interval has to be able to change
        // pass an anonymous function so we can pass the argument lastTimeout to theFunction()
        var lastTimeout = setTimeout(function () {
          theFunction(lastTimeout);
        }, ms);
        thisContext._everys.push(lastTimeout);
      };
      theFunction();
    } else {
      var milis = Woof.prototype.unitsToMiliseconds(time, units);
      func();
      thisContext._everys.push(setInterval(func, milis));
    }
  };

  // thisContext.every = (time, units, func) => {
  //   var milis = Woof.prototype.unitsToMiliseconds(time, units);
  //   if (typeof func != "function" || typeof time != "number") { throw new TypeError("every(time, units, function) requires a number, unit and function input."); }
  //   func();
  //   thisContext._everys.push(setInterval(func, milis));
  // };

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

  // Woof repeats differ from a traditional JavaScript while or for-loop:
  // 1. JavaScript loops are synchronous, and Woof loops are asynchronous
  // 2. JavaScript loops are wicked fast, and Woof loops happen as fast as Woof forevers (about 30 times per second, in line with 30fps) which allow users to animate with them
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

  // The timer begins when Woof is loaded
  thisContext.woofEpoch = new Date();
  thisContext.timer = function () {
    if (arguments.length > 0) {
      throw new TypeError("timer() requires no inputs.");
    }
    var date = new Date();
    return (date - thisContext.woofEpoch) / 1000;
  };
  thisContext.resetTimer = function () {
    if (arguments.length > 0) {
      throw new TypeError("resetTimer() requires no inputs.");
    }
    thisContext.woofEpoch = new Date();
  };

  thisContext._render = function () {
    thisContext._runRepeats(); // we need to run the repeats even if stopped because the defrost() code likely lives in a repeat
    thisContext._calculateMouseSpeed();
    thisContext.renderInterval = window.requestAnimationFrame(thisContext._render); // WARNING this line makes render recursive. Only call is once and it will continue to call itself ~30fps.
    if (thisContext.stopped) {
      return;
    }
    thisContext._renderSprites();
  };
  thisContext.ready(thisContext._render);

  thisContext.collider = function () {
    return new SAT.Polygon(new SAT.Vector(), [new SAT.Vector(-thisContext.width / 2, thisContext.height / 2), new SAT.Vector(-thisContext.width / 2, -thisContext.height / 2), new SAT.Vector(thisContext.width / 2, -thisContext.height / 2), new SAT.Vector(thisContext.width / 2, thisContext.height / 2)]);
  };
};

Woof.prototype.Sprite = function () {
  var _this = this;

  var _ref3 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      _ref3$project = _ref3.project,
      project = _ref3$project === undefined ? undefined : _ref3$project,
      _ref3$x = _ref3.x,
      x = _ref3$x === undefined ? 0 : _ref3$x,
      _ref3$y = _ref3.y,
      y = _ref3$y === undefined ? 0 : _ref3$y,
      _ref3$angle = _ref3.angle,
      angle = _ref3$angle === undefined ? 0 : _ref3$angle,
      _ref3$rotationStyle = _ref3.rotationStyle,
      rotationStyle = _ref3$rotationStyle === undefined ? "ROTATE" : _ref3$rotationStyle,
      _ref3$showing = _ref3.showing,
      showing = _ref3$showing === undefined ? true : _ref3$showing,
      _ref3$penColor = _ref3.penColor,
      penColor = _ref3$penColor === undefined ? "black" : _ref3$penColor,
      _ref3$penWidth = _ref3.penWidth,
      penWidth = _ref3$penWidth === undefined ? 1 : _ref3$penWidth,
      _ref3$penDown = _ref3.penDown,
      penDown = _ref3$penDown === undefined ? false : _ref3$penDown,
      _ref3$showCollider = _ref3.showCollider,
      showCollider = _ref3$showCollider === undefined ? false : _ref3$showCollider,
      _ref3$brightness = _ref3.brightness,
      brightness = _ref3$brightness === undefined ? 100 : _ref3$brightness;

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
      this.project.ready(this.trackPen); // any change to x, is tracked for the pen
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
      this.project.ready(this.trackPen); // any change to y to tracked for the pen
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

  // SAT collision for touching, works with rotated sprites
  this.rotatedVector = function (x, y) {
    var rotatedX;
    var rotatedY;
    // If sprite is a line, offsets positioning by half the height as line is drawn from endpoints, not center
    if (this.type == 'line') {
      rotatedX = Math.cos(this.radians()) * (x - this.x) - Math.sin(this.radians()) * (y - this.y + this.height / 2) + this.x;
      rotatedY = Math.sin(this.radians()) * (x - this.x) + Math.cos(this.radians()) * (y - this.y + this.height / 2) + this.y;
    } else {
      rotatedX = Math.cos(this.radians()) * (x - this.x) - Math.sin(this.radians()) * (y - this.y) + this.x;
      rotatedY = Math.sin(this.radians()) * (x - this.x) + Math.cos(this.radians()) * (y - this.y) + this.y;
    }
    return new SAT.Vector(rotatedX, rotatedY);
  };

  // Makes collider vector vertices relative to the point 'pos'
  this.translatedVector = function (pos, v) {
    return new SAT.Vector(v.x - pos.x, v.y - pos.y);
  };

  // Creates collider from vector vertices
  this.collider = function () {
    // If sprite is a circle, create circle collider
    if (this.type == "circle") {
      return new SAT.Circle(new SAT.Vector(this.x, this.y), this.radius);
    }
    // If sprite is a polygon, create polygon collider
    else if (this.type == "polygon") {
        var pos = this.rotatedVector(this.x, this.y);
        var vs = [new SAT.Vector(this.length * 1, this.length * 0)];
        for (var i = 1; i < this.sides; i++) {
          vs.push(new SAT.Vector(this.length * Math.cos(i * (2 * Math.PI / this.sides)), this.length * Math.sin(i * (2 * Math.PI / this.sides))));
        }
        return new SAT.Polygon(pos, vs).rotate(this.radians());
      }
      // Otherwise, create 4-sided collider around sprite
      else {
          var pos = this.rotatedVector(this.x - this.width / 2, this.y - this.height / 2);
          var v1 = new SAT.Vector(0, 0);
          var v2 = this.translatedVector(pos, this.rotatedVector(this.x + this.width / 2, this.y - this.height / 2));
          var v3 = this.translatedVector(pos, this.rotatedVector(this.x + this.width / 2, this.y + this.height / 2));
          var v4 = this.translatedVector(pos, this.rotatedVector(this.x - this.width / 2, this.y + this.height / 2));
          return new SAT.Polygon(pos, [v1, v2, v3, v4]);
        }
  };

  // for debugging purposes, this function displays the collider on the screen according to type of sprite
  this._renderCollider = function (context) {
    var collider = this.collider();

    context.save();
    context.beginPath();

    if (collider.constructor.name == "Circle") {
      context.arc.apply(context, _toConsumableArray(this.project.translateToCanvas(collider.pos.x, collider.pos.y)).concat([collider.r, 0, 2 * Math.PI]));
    } else {
      context.moveTo.apply(context, _toConsumableArray(this.project.translateToCanvas(collider.calcPoints[0].x + collider.pos.x, collider.calcPoints[0].y + collider.pos.y)));

      for (var i = 1; i < this.collider().edges.length; i++) {
        context.lineTo.apply(context, _toConsumableArray(this.project.translateToCanvas(collider.calcPoints[i].x + collider.pos.x, collider.calcPoints[i].y + collider.pos.y)));
      }
      context.lineTo.apply(context, _toConsumableArray(this.project.translateToCanvas(collider.calcPoints[0].x + collider.pos.x, collider.calcPoints[0].y + collider.pos.y)));
    }

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
      if ((typeof xGiven === "undefined" ? "undefined" : _typeof(xGiven)) == "object") {
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
    var steps = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;

    if (typeof steps != "number") {
      throw new TypeError("move(steps) requires one number input.");
    }
    // we modify privateX and privateY here before tracking pen so that the pen thinks they changed at the same time
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
    if (!((typeof sprite === "undefined" ? "undefined" : _typeof(sprite)) == "object")) {
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

    // this code scans the pixels of both sprites to see if they are touching
    // it's very slow so we turn it off by default
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

    var _project$translateToC = _this.project.translateToCanvas(left, top),
        _project$translateToC2 = _slicedToArray(_project$translateToC, 2),
        canvasLeft = _project$translateToC2[0],
        canvasTop = _project$translateToC2[1];

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
    var left = _ref6.left,
        right = _ref6.right,
        top = _ref6.top,
        bottom = _ref6.bottom;


    if (_this.collider().constructor.name == "Circle") {
      return SAT.testPolygonCircle(_this.project.collider(), _this.collider(), new SAT.Response());
    }
    return SAT.testPolygonPolygon(_this.project.collider(), _this.collider(), new SAT.Response());
  };

  this.over = function (x, y) {
    if (typeof x != "number" || typeof y != "number") {
      throw new TypeError("over(x, y) requires two number inputs.");
    }
    if (_this.deleted || !_this.showing) {
      return false;
    }

    var collider = _this.collider();

    // If shape is an oval, find point in oval. SAT.js does not include this in library. 
    // This is more exact than a collider polygon drawn around it.
    if (_this.type == "oval") {
      return Math.pow(x - _this.x, 2) / Math.pow(_this.width / 2, 2) + Math.pow(y - _this.y, 2) / Math.pow(_this.height / 2, 2) <= 1;
    }
    // If collider is a circle, find point in circle
    else if (collider.constructor.name == "Circle") {
        return SAT.pointInCircle(new SAT.Vector(x, y), _this.collider());
      }
      // Otherwise look for point in polygon
      else {
          return SAT.pointInPolygon(new SAT.Vector(x, y), _this.collider());
        }
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
    var degrees = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;

    if (typeof degrees != "number") {
      throw new TypeError("turnLeft(degrees) requires one number input.");
    }
    _this.angle += degrees;
  };

  this.turnRight = function () {
    var degrees = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;

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
      if ((typeof x2 === "undefined" ? "undefined" : _typeof(x2)) == "object") {
        // if no y2 and x2 is an object, we will assume it's a sprite and point towards it
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

  // track user events specfically for this sprite
  this._onMouseDowns = [];
  this.onMouseDown = function (func) {
    if (typeof func != "function") {
      throw new TypeError("onMouseDown(function) requires one function input.");
    }
    _this._onMouseDowns.push(func);
  };
  this._onMouseDownHandler = function (event) {
    var _project$translateToC3 = _this.project.translateToCenter(event.clientX, event.clientY),
        _project$translateToC4 = _slicedToArray(_project$translateToC3, 2),
        mouseX = _project$translateToC4[0],
        mouseY = _project$translateToC4[1];

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
    var _project$translateToC5 = _this.project.translateToCenter(event.clientX, event.clientY),
        _project$translateToC6 = _slicedToArray(_project$translateToC5, 2),
        mouseX = _project$translateToC6[0],
        mouseY = _project$translateToC6[1];

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

  var _ref7 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      _ref7$project = _ref7.project,
      project = _ref7$project === undefined ? undefined : _ref7$project,
      _ref7$text = _ref7.text,
      text = _ref7$text === undefined ? "Text" : _ref7$text,
      _ref7$size = _ref7.size,
      size = _ref7$size === undefined ? 12 : _ref7$size,
      _ref7$color = _ref7.color,
      color = _ref7$color === undefined ? "black" : _ref7$color,
      _ref7$fontFamily = _ref7.fontFamily,
      fontFamily = _ref7$fontFamily === undefined ? "arial" : _ref7$fontFamily,
      _ref7$textAlign = _ref7.textAlign,
      textAlign = _ref7$textAlign === undefined ? "center" : _ref7$textAlign;

  this.type = "text";
  Woof.prototype.Sprite.call(this, arguments[0]);
  this.text = text;
  this.size = Math.abs(size);
  this.color = color;
  this.fontFamily = fontFamily;
  // TODO remove text align or make the collider take it into account
  // currently, the collider doesn't know about textAlign so things can be quite inaccurate
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
        // the height of text is notoriously difficult to measure
        // the width of the letter "M" in that font is usually a good proxy
        height = _this3.project._spriteContext.measureText("M").width;
      });
      return height;
    },
    set: function set(value) {
      throw new TypeError("You cannot modify the height of Text. You can only change its size.");
    }
  });

  // this function saves us from copy-and-pasing the font declarations all over
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
      // if we get a functions for text, evaluate it every time we are asked to render the text
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

  var _ref8 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      _ref8$project = _ref8.project,
      project = _ref8$project === undefined ? undefined : _ref8$project,
      _ref8$radius = _ref8.radius,
      radius = _ref8$radius === undefined ? 10 : _ref8$radius,
      _ref8$color = _ref8.color,
      color = _ref8$color === undefined ? "black" : _ref8$color;

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

  var _ref9 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      _ref9$project = _ref9.project,
      project = _ref9$project === undefined ? undefined : _ref9$project,
      _ref9$height = _ref9.height,
      height = _ref9$height === undefined ? 10 : _ref9$height,
      _ref9$width = _ref9.width,
      width = _ref9$width === undefined ? 10 : _ref9$width,
      _ref9$color = _ref9.color,
      color = _ref9$color === undefined ? "black" : _ref9$color;

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

Woof.prototype.Oval = function () {
  var _this7 = this;

  var _ref10 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      _ref10$project = _ref10.project,
      project = _ref10$project === undefined ? undefined : _ref10$project,
      _ref10$height = _ref10.height,
      height = _ref10$height === undefined ? 50 : _ref10$height,
      _ref10$width = _ref10.width,
      width = _ref10$width === undefined ? 20 : _ref10$width,
      _ref10$color = _ref10.color,
      color = _ref10$color === undefined ? "green" : _ref10$color;

  this.type = "oval";
  Woof.prototype.Sprite.call(this, arguments[0]);
  this.ovalHeight = Math.abs(height);
  this.ovalWidth = Math.abs(width);
  this.color = color;

  Object.defineProperty(this, 'width', {
    get: function get() {
      return this.ovalWidth;
    },
    set: function set(value) {
      if (typeof value != "number") {
        throw new TypeError("oval.width can only be set to a number.");
      }
      this.ovalWidth = value;
    }
  });

  Object.defineProperty(this, 'height', {
    get: function get() {
      return this.ovalHeight;
    },
    set: function set(value) {
      if (typeof value != "number") {
        throw new TypeError("oval.height can only be set to a number.");
      }
      this.ovalHeight = value;
    }
  });

  this.render = function (context) {
    context.fillStyle = _this7.color;
    context.beginPath();
    context.ellipse(0, 0, this.ovalWidth/2, this.ovalHeight/2, 0, 0,  2*Math.PI);
    context.fill();
  };
};

Woof.prototype.Polygon = function () {
  var _this8 = this;

  var _ref11 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      _ref11$project = _ref11.project,
      project = _ref11$project === undefined ? undefined : _ref11$project,
      _ref11$sides = _ref11.sides,
      sides = _ref11$sides === undefined ? 3 : _ref11$sides,
      _ref11$length = _ref11.length,
      length = _ref11$length === undefined ? 100 : _ref11$length,
      _ref11$color = _ref11.color,
      color = _ref11$color === undefined ? "black" : _ref11$color;

  this.type = "polygon";
  Woof.prototype.Sprite.call(this, arguments[0]);
  this.polygonSides = Math.abs(sides);
  this.polygonLength = Math.abs(length);
  this.color = color;

  Object.defineProperty(this, 'sides', {
    get: function get() {
      return this.polygonSides;
    },
    set: function set(value) {
      if (typeof value != "number" || value < 3) {
        throw new TypeError("polygon.sides can only be set to a number that is greater than or equal to 3.");
      }
      this.polygonSides = sides;
    }
  });

  Object.defineProperty(this, 'length', {
    get: function get() {
      return this.polygonLength;
    },
    set: function set(value) {
      if (typeof value != "number") {
        throw new TypeError("polygon.length can only be set to a number.");
      }
      this.polygonLength = value;
    }
  });

  this.render = function (context) {
    context.fillStyle = _this8.color;
    context.beginPath();
    context.moveTo(length * 1, length * 0);
    for (i = 1; i < sides; i++) {
      context.lineTo(length * Math.cos(i * (2 * Math.PI / sides)), length * Math.sin(i * (2 * Math.PI / sides)));
    }
    context.fill();
  };
};

// Creates a 'line' sprite by rendering a rotated rectangle
Woof.prototype.Line = function () {
  var _this9 = this;

  var _ref12 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      _ref12$project = _ref12.project,
      project = _ref12$project === undefined ? undefined : _ref12$project,
      _ref12$width = _ref12.width,
      width = _ref12$width === undefined ? 1 : _ref12$width,
      _ref12$x = _ref12.x1,
      x1 = _ref12$x === undefined ? 10 : _ref12$x,
      _ref12$y = _ref12.y1,
      y1 = _ref12$y === undefined ? 10 : _ref12$y,
      _ref12$color = _ref12.color,
      color = _ref12$color === undefined ? "black" : _ref12$color;

  this.type = "line";
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

  // Sets height property to hypotenuse of triangle created from x and x1 and y and y1 - this is the length of the 'line'
  Object.defineProperty(this, 'height', {
    get: function get() {
      return Math.sqrt(Math.pow(this.x - this.x1, 2) + Math.pow(this.y - this.y1, 2));
    },
    set: function set(value) {
      throw new TypeError("You cannot set line.height directly. You can only modify line.height by changing the length of your line through moving its points.");
    }
  });

  // Rotates rectangle by the angle between x1 and x and y1 and y
  // Add 90 to the angle because "height" and "width" are essentially reversed in comparison to a rectangle sprite
  Object.defineProperty(this, 'angle', {
    get: function get() {
      return Math.atan2(-this.x1 + this.x, this.y1 - this.y) * 180 / Math.PI + 90;
    },
    set: function set(value) {
      throw new TypeError("You cannot set line.angle directly. You can only modify line.angle by changing the position of the line's points.");
    }
  });

  // using move() with lines is tricky, so throw an error (should probably be fixed at some point)
  this.move = function () {
    throw new TypeError("You cannot move lines with move() unfortunately! Change the x, y, x1, and y1 values instead.");
  };

  // subtract 90 from the angle of a line before calculating radians (undoing the correction in line.angle above)
  this.radians = function () {
    return (this.angle - 90) * Math.PI / 180;
  };

  this.render = function (context) {
    context.fillStyle = _this9.color;
    context.fillRect(-_this9.width / 2, -_this9.height, _this9.width, _this9.height);
  };
};

Woof.prototype.Image = function () {
  var _this10 = this;

  var _ref13 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      _ref13$project = _ref13.project,
      project = _ref13$project === undefined ? undefined : _ref13$project,
      _ref13$url = _ref13.url,
      url = _ref13$url === undefined ? "./images/SMJjVCL.png" : _ref13$url,
      height = _ref13.height,
      width = _ref13.width;

  this.type = "image";
  Woof.prototype.Sprite.call(this, arguments[0]);
  this.imageHeight = Math.abs(height);
  this.imageWidth = Math.abs(width);

  this.setImageURL = function (url) {
    this.image = new window.BrowserImage();
    this.image.src = url;
    this.image.onerror = function (e) {
      var error = new Error();
      error.type = "ImageLoadError";
      error.url = url;
      throw error;
    };
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
    // checking if the image is loaded and not broken via https://stackoverflow.com/a/34726863/2180575
    if (_this10.image.complete && _this10.image.naturalHeight !== 0) {
      context.drawImage(_this10.image, -_this10.width / 2, -_this10.height / 2, _this10.width, _this10.height);
    }
  };
};

Woof.prototype.Sound = function () {
  var _ref14 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      _ref14$url = _ref14.url,
      url = _ref14$url === undefined ? '' : _ref14$url,
      _ref14$loop = _ref14.loop,
      loop = _ref14$loop === undefined ? "false" : _ref14$loop,
      _ref14$volume = _ref14.volume,
      volume = _ref14$volume === undefined ? "normal" : _ref14$volume,
      _ref14$speed = _ref14.speed,
      speed = _ref14$speed === undefined ? "normal" : _ref14$speed;

  // Create new audio object with given url
  this.audio = new Audio(url);
  this.audio.loop = loop;

  // Store allowed audio speed and volume values
  this.audioSettings = {
    speed: {
      slow: 0.5,
      normal: 1,
      fast: 2
    },
    volume: {
      mute: 0,
      low: 0.5,
      normal: 1
    }
  };

  // Convert given value to corresponding audio object value
  // Throw error if given value not found in allowed values
  var soundVolumeToAudioVolume = function soundVolumeToAudioVolume(val) {
    if (typeof val == "number") {
      if (val >= 0 && val <= 1) {
        return val;
      } else {
        throw Error("Volume can only be set to a number value between 0 and 1.");
      }
    } else if (typeof val == "string") {
      if (val == "mute") {
        return 0;
      } else if (val == "low") {
        return 0.5;
      } else if (val == "normal") {
        return 1;
      } else {
        throw Error('Volume can only be set to a string value of "mute", "low", or "normal".');
      }
    } else {
      throw Error(val + " is not an accepted value for volume.");
    }
  };

  var soundSpeedToAudioSpeed = function soundSpeedToAudioSpeed(val) {
    if (typeof val == "number") {
      if (val >= 0.5 && val <= 2) {
        return val;
      } else {
        throw Error("Speed can only be set to a number value between 0.5 and 2.");
      }
    } else if (typeof val == "string") {
      if (val == "slow") {
        return 0.5;
      } else if (val == "normal") {
        return 1;
      } else if (val == "fast") {
        return 2;
      } else {
        throw Error('Speed can only be set to a string value of "slow", "normal", or "fast".');
      }
    } else {
      throw Error(val + " is not an accepted value for speed.");
    }
  };

  this.audio.playbackRate = soundSpeedToAudioSpeed(speed);
  this.audio.volume = soundVolumeToAudioVolume(volume);

  // Allow user to get and set speed
  Object.defineProperty(this, 'speed', {
    get: function get() {
      return this.audio.playbackRate;
    },
    set: function set(value) {
      this.audio.playbackRate = soundSpeedToAudioSpeed(value);
    }
  });

  // Allow user to get and set volume
  Object.defineProperty(this, 'volume', {
    get: function get() {
      return this.audio.volume;
    },
    set: function set(value) {
      this.audio.volume = soundVolumeToAudioVolume(value);
    }
  });

  // Allow user to get and set loop
  Object.defineProperty(this, 'loop', {
    get: function get() {
      return this.audio.loop;
    },
    set: function set(value) {
      if (typeof value != "boolean") {
        throw new Error("Loop must be set to true or false.");
      }
      this.audio.loop = value;
    }
  });

  // Play the sound
  this.startPlaying = function () {
    this.audio.play();
  };

  // Stop the sound
  this.stopPlaying = function () {
    this.audio.pause();
  };

  // Check if the sound has been played
  this.neverPlayed = function () {
    return this.audio.played.length === 0;
  };
};

// this function allows a user a custom sprite with its own render method
// this is new and not really used so probably needs to be fleshed out
Woof.prototype.customSprite = function (subClass) {
  if (!subClass.render) {
    throw new TypeError("customSprites must contain a render function");
  } // TODO more errors like these, probably for width and height
  return function () {
    var _ref15 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        _ref15$project = _ref15.project,
        project = _ref15$project === undefined ? undefined : _ref15$project;

    Woof.prototype.Sprite.call(this, arguments[0]);
    Woof.prototype.extend(this, subClass);
  };
};

Woof.prototype.Repeat = function (times, func, after) {
  var _this11 = this;

  this.func = func;
  this.times = Math.floor(times);
  this.done = false;

  this.next = function () {
    if (_this11.done) {
      return;
    }
    if (_this11.times <= 0) {
      _this11.done = true;
      if (after) {
        after();
      }
      return;
    } else {
      _this11.func();
      _this11.times--;
    }
  };
};

Woof.prototype.RepeatUntil = function (condition, func, after) {
  var _this12 = this;

  // TODO if (typeof condition !== "string") { throw Error("You must give repeatUntil a string condition in quotes. You gave it: " + condition); }
  this.func = func;
  this.condition = condition;
  this.done = false;

  this.next = function () {
    if (_this12.done) {
      return;
    }
    var cond;
    try {
      cond = _this12.condition();
    } catch (e) {
      console.error("Error in Repeat Until condition");
      throw e;
    }

    if (cond) {
      _this12.done = true;
      if (after) {
        after();
      }
      return;
    } else {
      _this12.func();
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
  } else if (keyCode == 188) {
    return ",";
  } else if (keyCode == 20) {
    return "CAPS LOCK";
  } else if (keyCode == 8) {
    return "DELETE";
  } else if (keyCode == 91) {
    return "COMMAND";
  } else {
    // if it's a number or a letter, return the number/letter as a string
    if (keyCode >= 65 && keyCode <= 90 || keyCode >= 48 && keyCode <= 57) {
      return String.fromCharCode(keyCode);
    }
    // if it's anything other than what's covered above, return the keycode as a string
    else {
        return keyCode.toString();
      }
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

  var min = Math.min(a, b),
      max = Math.max(a, b);
  var rand = Math.random() * (max - min) + min;
  // this will return the number of decimals, and if it's an integer, it will return 0
  // source: http://stackoverflow.com/a/17369384
  var countDecimals = function countDecimals(value) {
    if (value % 1 != 0) return value.toString().split(".")[1].length;
    return 0;
  };
  // store the greater number of decimals and use that to round the number appropriately
  var randDecimals = Math.max(countDecimals(max), countDecimals(min));
  return Math.round(rand * Math.pow(10, randDecimals)) / Math.pow(10, randDecimals);
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

// this is a useful funciton if you want to limit how often a function can be called
// for example, a user can only get a point every 2 seconds
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

// users can use this funcition to import external scripts to their Woof projects, like firebase
Woof.prototype.importCodeURL = function (url, callback) {
  var lib = document.createElement("script");
  lib.type = "text/javascript";
  lib.src = url;
  lib.onload = callback;
  document.body.appendChild(lib);
};

// Detect if the user is on mobile -- return TRUE if on mobile, FALSE otherwise
// sourced from https://coderwall.com/p/i817wa/one-line-function-to-detect-mobile-devices-with-javascript
Woof.prototype.mobile = function () {
  return typeof window.orientation !== "undefined" || navigator.userAgent.indexOf('IEMobile') !== -1;
};

// generate an array with the given parameters (starting value, ending value, incrementation) default incrementation is 1
Woof.prototype.range = function (start, end) {
  var incr = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;

  if (arguments.length < 2 || typeof start != "number" || typeof end != "number" || typeof incr != "number") {
    throw new TypeError("range() requires at least two number inputs.");
  }
  if (incr === 0) {
    throw new TypeError("the third parameter for range() cannot be 0");
  }
  var output = [];
  if (start < end) {
    incr = Math.abs(incr);
    for (var _i = start; _i < end; _i += incr) {
      output.push(_i);
    }
  } else if (start > end) {
    incr = -Math.abs(incr);
    for (var j = start; j > end; j += incr) {
      output.push(j);
    }
  }
  return output;
};

//Math Functions
Woof.prototype.sqrt = function (a) {
  if (typeof a != "number") {
    throw new TypeError("sqrt(a) requires one number input.");
  }
  return Math.sqrt(a);
};

Woof.prototype.abs = function (a) {
  if (typeof a != "number") {
    throw new TypeError("abs(a) requires one number input.");
  }
  return Math.abs(a);
};

Woof.prototype.floor = function (a) {
  if (typeof a != "number") {
    throw new TypeError("floor(a) requires one number input.");
  }
  return Math.floor(a);
};

Woof.prototype.ceiling = function (a) {
  if (typeof a != "number") {
    throw new TypeError("ceiling(a) requires one number input.");
  }
  return Math.ceil(a);
};

Woof.prototype.sin = function (a) {
  if (typeof a != "number") {
    throw new TypeError("sin(a) requires one number input.");
  }
  return Math.sin(a * (Math.PI / 180));
};

Woof.prototype.cos = function (a) {
  if (typeof a != "number") {
    throw new TypeError("cos(a) requires one number input.");
  }
  return Math.cos(a * (Math.PI / 180));
};

Woof.prototype.tan = function (a) {
  if (typeof a != "number") {
    throw new TypeError("tan(a) requires one number input.");
  }
  return Math.tan(a * (Math.PI / 180));
};

Woof.prototype.asin = function (a) {
  if (typeof a != "number") {
    throw new TypeError("asin(a) requires one number input.");
  }
  return Math.asin(a) * (180 / Math.PI);
};

Woof.prototype.acos = function (a) {
  if (typeof a != "number") {
    throw new TypeError("acos(a) requires one number input.");
  }
  return Math.acos(a) * (180 / Math.PI);
};

Woof.prototype.atan = function (a) {
  if (typeof a != "number") {
    throw new TypeError("atan(a) requires one number input.");
  }
  return Math.atan(a) * (180 / Math.PI);
};

Woof.prototype.ln = function (a) {
  if (typeof a != "number") {
    throw new TypeError("ln(a) requires one number input.");
  }
  return Math.log(a);
};

Woof.prototype.log = function (a) {
  if (typeof a != "number") {
    throw new TypeError("log(a) requires one number input.");
  }
  return Math.log(a) / Math.log(10);
};

Woof.prototype.pow = function (a, b) {
  if (typeof a != "number" || typeof b != "number") {
    throw new TypeError("pow(a,b) requires two number inputs.");
  }
  return Math.pow(a, b);
};

var getData = function getData(url, callback) {
  fetch(url, { mode: 'cors', header: { 'Access-Control-Allow-Origin': '*' } }).then(function (result) {
    result.json().then(function (data) {
      callback(data);
    });
  });
};

// find the woof.js script tag in the page
var currentScript = document.currentScript || Array.prototype.slice.call(document.getElementsByTagName('script')).find(function (s) {
  return s.src.includes('woof.js');
});

if (JSON.parse(currentScript.getAttribute('global')) !== false) {
  // unless the script tag containing Woof has an attribute global="false", start Woof in global mode
  Woof.prototype.extend(window, new Woof({ global: true, fullScreen: true }));
}
