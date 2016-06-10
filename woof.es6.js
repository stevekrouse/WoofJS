var Woof = {};

Woof.keyCodeToString = keyCode => {
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

Woof.unitsToMiliseconds = (time, units) => {
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

Woof.randomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

Woof.repeat = (times, func) => {
  for (var i = 0; i < times; i++){
    func(i+1);
  }
};

Woof.dayOfMonth = () =>{
  var date = new Date();
  return date.getDate();
};

Woof.dayOfWeek = () => {
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

Woof.hourMilitary =  () => {
  var date = new Date();
  return date.getHours();
};

Woof.hour = () => {
  var date = new Date();
  var hour = date.getHours();
  return hour <= 12 ? hour : hour - 12;
};

Woof.minute =  () => {
  var date = new Date();
  return date.getMinutes();
};

Woof.second = () => {
  var date = new Date();
  return date.getSeconds();
};

Woof.randomColor = function(){
  return "rgb(" + Woof.randomInt(0, 255) + ", " + Woof.randomInt(0, 255) + ", " + Woof.randomInt(0, 255)+ ")";
}

Woof.RIGHT = 0;
Woof.LEFT = 180;
Woof.UP = 90;
Woof.DOWN = 270;

Woof.Project = function({canvasId = undefined, fullScreen = false, height = 500, width = 350, debug = []} = {}) {
  this.sprites = [];
  this.backdrop = undefined;
  this.debug = debug;
  this.stopped = false;
  if (fullScreen) {
    width = window.innerWidth;
    height = window.innerHeight;
    document.body.style.margin = 0;
    document.body.style.padding = 0;
  } 
  
  if (canvasId) {
    try {
      this._canvas = document.getElementById(canvasId);
    } catch (e){
      console.error(e);
      throw Error("Could not find a canvas on the page with id " + canvasId);
    }
  } else {
    this._canvas = document.createElement("canvas");
    this._canvas.id = "project";
    this._canvas.width = width;
    this._canvas.height = height;
    this._canvas.style.display = "block";
    document.body.appendChild(this._canvas);
  }
  this._context = this._canvas.getContext("2d");
  this.setCanvasSize = () => {
    this.height = this._canvas.height;
    this.width = this._canvas.width;
    this.minX = -this.width / 2;
    this.maxX = this.width / 2;
    this.minY = -this.height / 2;
    this.maxY = this.height / 2;
  };
  this.setCanvasSize();
  if (fullScreen) {
    window.addEventListener("resize", () => {
      this._canvas.width = window.innerWidth;
      this._canvas.height = window.innerHeight;
      this.setCanvasSize();
    });
  }
  
  this.randomX = () => {
    return Woof.randomInt(this.minX, this.maxX);
  };
  
  this.randomY = () => {
    return Woof.randomInt(this.minY, this.maxY);
  };
  
  this.addText = options => {
    var sprite = new Woof.Text(this, options);
    this.sprites.push(sprite);
    return sprite;
  };
  
  this.addCircle = options => {
    var sprite = new Woof.Circle(this, options);
    this.sprites.push(sprite);
    return sprite;
  };
  
  this.addRectangle = options => {
    var sprite = new Woof.Rectangle(this, options);
    this.sprites.push(sprite);
    return sprite;
  };
  
  this.addLine = options => {
    var sprite = new Woof.Line(this, options);
    this.sprites.push(sprite);
    return sprite;
  };
  
  this.addImage = options => {
    var sprite = new Woof.Image(this, options);
    this.sprites.push(sprite);
    return sprite;
  };
  
  this.setBackdropURL = function(url){    
    var backdrop = new Image();
    backdrop.src = url;
    this.backdrop = backdrop;
  };
  
  this.setBackdropColor = function(color){    
    this.backdrop = color;
  };
  
  this.firebaseConfig = config => {
    this.firebase = new Woof.Firebase(config);
    this.getCloud = this.firebase.getCloud;
    this.setCloud = this.firebase.setCloud;
  };
  
  this.stopAll = () => {
    this._render();
    this.stopped = true;
    
    this._everys.forEach(clearInterval);
    this._afters.forEach(clearInterval);
    this._canvas.removeEventListener("mousedown", this._onClickHandler);
    
    this.sprites.forEach(sprite => sprite.delete());
  };
  
  this.translateToCenter = (x, y) => {
    return [(x - this.maxX) - this._canvas.offsetLeft, (this.maxY - y) + this._canvas.offsetTop];
  };
  this.translateToCanvas = (x, y) => {
    return [(x + this.maxX) - this._canvas.offsetLeft, (this.maxY - y) + this._canvas.offsetTop];
  };
  
  this.mouseDown = false;
  this.mouseX = 0;
  this.mouseY = 0;
  this._canvas.addEventListener("mousedown", (event) => {
    this.mouseDown = true;
    [this.mouseX, this.mouseY] = this.translateToCenter(event.clientX, event.clientY);
  });
  this._canvas.addEventListener("mouseup", (event) => {
    this.mouseDown = false;
    [this.mouseX, this.mouseY] = this.translateToCenter(event.clientX, event.clientY);
  });
  this._canvas.addEventListener("touchstart", (event) => {
    this.mouseDown = true;
    [this.mouseX, this.mouseY] = this.translateToCenter(event.clientX, event.clientY);
  });
  this._canvas.addEventListener("touchend", (event) => {
    // for some reason touchend events are firing too quickly
    // and are not getting picked up in 40 ms every-if's
    // so this setTimeout slows things down just enouch so
    // touch events mirror mouse events
    setTimeout(() => {this.mouseDown = false;}, 0);
  });
  this._canvas.addEventListener("mousemove", (event) => { 
    [this.mouseX, this.mouseY] = this.translateToCenter(event.clientX, event.clientY);
  });
  this._canvas.addEventListener("touchmove", event => {
    [this.mouseX, this.mouseY] = this.translateToCenter(event.targetTouches[0].clientX, event.targetTouches[0].clientY);
    event.preventDefault();
  });
  
  this.keysDown = [];
  document.body.addEventListener("keydown", event => {
    var key = Woof.keyCodeToString(event.keyCode);
    if (!this.keysDown.includes(key)){
     this.keysDown.push(key); 
    }
  });
  document.body.addEventListener("keyup", event => {
    var key = Woof.keyCodeToString(event.keyCode);
    if (this.keysDown.includes(key)){
      this.keysDown.splice(this.keysDown.indexOf(key), 1);
    }
  });

  this._everys = [];
  this.every = (time, units, func) => {
    func();
    this._everys.push(setInterval(func, Woof.unitsToMiliseconds(time, units)));
  };
  this.forever = (func) => {
    this.repeatUntil("false", func);
  };
  
  this.when = (condition, func) => {
    this.forever(() => {
      var cond;
      try {
        cond = eval(condition);
      } catch (e) {
        console.error("Bad condition in Woof.Project#when: " + condition);
        throw e;
      }
      if (cond) {
        func();
      };
    });
  };
  
  this._repeats = [];
  this.repeat = (times, func, after) => {
    this._repeats.push(new Woof.Repeat(times, func, after));
  };
  this.repeatUntil = (condition, func, after) => {
    this._repeats.push(new Woof.RepeatUntil(condition, func, after));
  };
  this._runRepeats = () => {
    this._repeats.forEach(repeat => {
      repeat.next();
    });
    this._repeats = this._repeats.filter(repeat => {return !repeat.done});
  };
  
  this._afters = [];
  this.after = (time, units, func) => {
    this._afters.push(setTimeout(func, Woof.unitsToMiliseconds(time, units)));
  };
  
  this._onClicks = [];
  this.onClick = func => { this._onClicks.push(func); };
  this._onClickHandler = event => {
    var [mouseX, mouseY] = this.translateToCenter(event.clientX, event.clientY);
    this._onClicks.forEach((func) => {func(mouseX, mouseY)});
  };
  this._canvas.addEventListener("mousedown", this._onClickHandler);

  this.debugText = [];
  for (var i = 0; i < this.debug.length; i++){
    var sprite = new Woof.Text(this, {textAlign: "left"});
    this.debugText.push(sprite);
  }
  
  this._renderDebug = () => {
    for (var i = 0; i < this.debug.length; i++) {
      var expr = this.debug[i];
      var value;
      try { value = eval(expr); } catch(e) { value = e; }
      [this.debugText[i].x, this.debugText[i].y] = [this.minX + 5, this.minY + (12 * (i+1))];
      this.debugText[i].text = `${expr}: ${value}`;
      this.debugText[i]._render(this);
    }
  };
  
  this._renderBackdrop = () => {
    if (this.backdrop instanceof Image) {
      this._context.drawImage(this.backdrop, 0, 0);
    } else if (typeof this.backdrop == "string"){
      this._context.save();
      this._context.fillStyle=this.backdrop;
      this._context.fillRect(0, 0, this.width, this.height);
      this._context.restore();
    }
  };
  
  this._renderSprites = () => {
    this.sprites.forEach((sprite) => {
      sprite._render(this);
    });
  };
  
  this._renderPen = () => {
    this._context.save();
    this.sprites.forEach((sprite) => {
      for (var i = 0; i < sprite.pen.length; i++){
        var last = i == 0 ? false : sprite.pen[i-1];
        var current = sprite.pen[i];
        if (sprite.pen[i] == false){
          //do nothing
        } else if (last === false && current !== false){
           this._context.beginPath();
           this._context.moveTo(...this.translateToCanvas(current.x, current.y));
        } else if (current !== false) {
          this._context.lineTo(...this.translateToCanvas(current.x, current.y));
          this._context.lineCap = "round";
          this._context.strokeStyle = current.color;
          this._context.lineWidth = current.width;
          this._context.stroke();
        }
      }
    });
    
    this._context.restore();
  };
  
  this._render = () => {
    if (this.stopped) return;
    this.renderInterval = window.requestAnimationFrame(this._render);
    this._runRepeats();
    this._context.clearRect(0, 0, this.width, this.height);
    this._renderBackdrop();
    this._renderPen();
    this._renderSprites();
    this._renderDebug();
  };
  this._render();
};

Woof.Sprite = function(project, {x = 0, y = 0, angle = 0, rotationStyle = "ROTATE", showing = true, penColor = "black", penWidth = 1} = {}) {
  this.project = project;
  this.x = x;
  this.y = y;
  this.angle = angle;
  this.rotationStyle = rotationStyle;
  this.showing = showing;
  this.penDown = false;
  this.penColor = penColor;
  this.penWidth = penWidth;
  this.deleted = false;
  
  this.pen = [];
  this.trackPen = () => {
    var last = this.pen.length == 0 ? false : this.pen[this.pen.length - 1];
    if (this.penDown) {
      if(last === false || !(last.x == this.x && last.y == this.y)) {
        this.pen.push({x: this.x, y: this.y, color: this.penColor, width: this.penWidth});
      } 
    } else if (!this.penDown && last !== false) {
      this.pen.push(false);
    }
  };
  
  this._render = function() {
    this.trackPen();
    if (this.showing) {
      this.project._context.save();
      this.project._context.translate(this.canvasX(), this.canvasY());
      if (this.rotationStyle == "ROTATE") {
        this.project._context.rotate(-this.radians());
      } else if (this.rotationStyle == "NO ROTATE"){
          // no rotate
      } else if (this.rotationStyle == "ROTATE LEFT RIGHT"){
        if (this.angle%360 >= 90 && this.angle%360 < 270){
          this.project._context.translate(this.width, 0);
          this.project._context.scale(-1, 1);
        } else if (this.angle%360 >=0 && this.angle%360 < 90 || this.angle%360 <= 360 && this.angle%360 >=270){
          // no rotate
        }
      }
      
      if (this instanceof Woof.Image) {
        this.imageRender();
      } else if (this instanceof Woof.Text) {
        this.textRender();
      } else if (this instanceof Woof.Circle) {
        this.circleRender();
      } else if (this instanceof Woof.Rectangle) {
        this.rectangleRender();
      } else if (this instanceof Woof.Line) {
        this.lineRender();
      }
      this.project._context.restore();
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
  this.project._canvas.addEventListener("mousedown", this._onClickHandler);
  
  this.delete = () => {
    this.showing = false;
    this.deleted = true;
    if (this.project.sprites.includes(this)){
      this.project.sprites.splice(this.project.sprites.indexOf(this), 1);
      this.project._canvas.removeEventListener("mousedown", this._onClickHandler);
    }
  };
};

Woof.Text = function(project, {text = "Text", dynamicText = undefined, size = 12, color = "black", fontFamily = "arial", textAlign = "center"} = {}) {
  Woof.Sprite.call(this, project, arguments[1]);
  this.text = text;
  this.size = size;
  this.color = color;
  this.fontFamily = fontFamily;
  this.textAlign = textAlign;
  this.dynamicText = dynamicText;
  
  this.width = () => {
    var width;
    this._applyInContext(() => {
      width = this.project._context.measureText(this.text).width;
    });
    return width;
  };
  
  this.height = () => {
    var height;
    this._applyInContext(() => {
      height = this.project._context.measureText("M").width;
    });
    return height;
  };
  
  this._applyInContext = (func) => {
    this.project._context.save();
    
    this.project._context.font = this.size + "px " + this.fontFamily;
    this.project._context.fillStyle = this.color;
    this.project._context.textAlign = this.textAlign;
    
    func();
    
    this.project._context.restore();
  };
  
  this.textRender = () => {
    this._applyInContext(() => {
      var text;
      try { text = this.dynamicText ? eval(this.dynamicText) : this.text; } catch (e) { console.error("Error with dynamicText: '" + this.dynamicText + "'"); throw e; }
      this.project._context.fillText(text, 0, 0);
    });
  };
};

Woof.Circle = function(project, {radius = 10, color = "black"} = {}) {
  Woof.Sprite.call(this, project, arguments[1]);
  this.radius = radius;
  this.color = color;
  
  this.width = () => {
    return 2 * this.radius;
  };
  
  this.height = () => {
    return 2 * this.radius;
  };
  
  this.circleRender = () => {
    this.project._context.beginPath();
    this.project._context.arc(0, 0, this.radius, 0, 2*Math.PI);
    this.project._context.fillStyle=this.color;
    this.project._context.fill();
  };
};

Woof.Rectangle = function(project, {rectangleHeight = 10, rectangleWidth = 10, color = "black"} = {}) {
  Woof.Sprite.call(this, project, arguments[1]);
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
    this.project._context.fillStyle=this.color;
    this.project._context.fillRect(-this.width() / 2, -this.height() / 2, this.width(), this.height());
  };
};

Woof.Line = function(project, {lineWidth = 1, x1 = 10, y1 = 10, color = "black"} = {}) {
  Woof.Sprite.call(this, project, arguments[1]);
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
    this.project._context.beginPath();
    this.project._context.moveTo(0, 0);
    this.project._context.lineTo(this.x1 - this.x, -this.y1 + this.y);
    this.project._context.strokeStyle = color;
    this.project._context.lineWidth = lineWidth;
    this.project._context.stroke();
  };
};

Woof.Image = function(project, {url = "http://www.loveyourdog.com/image3.gif", imageHeight, imageWidth} = {}) {
  Woof.Sprite.call(this, project, arguments[1]);
  this.imageHeight = imageHeight;
  this.imageWidth = imageWidth;
  
  this.setImageURL = function(url){    
    this.image = new Image();
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
    this.project._context.drawImage(this.image, -this.width() / 2, -this.height() / 2, this.width(), this.height());
  };
};

Woof.Repeat = function(times, func, after) {
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

Woof.RepeatUntil = function(condition, func, after){
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

Woof.Firebase = function(config){
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