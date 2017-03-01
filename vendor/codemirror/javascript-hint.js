// CodeMirror, copyright (c) by Marijn Haverbeke and others
// Distributed under an MIT license: http://codemirror.net/LICENSE

(function(mod) {
  if (typeof exports == "object" && typeof module == "object") // CommonJS
    mod(require("../../lib/codemirror"));
  else if (typeof define == "function" && define.amd) // AMD
    define(["../../lib/codemirror"], mod);
  else // Plain browser env
    mod(CodeMirror);
})(function(CodeMirror) {
  var Pos = CodeMirror.Pos;

  function forEach(arr, f) {
    for (var i = 0, e = arr.length; i < e; ++i) f(arr[i]);
  }

  function arrayContains(arr, item) {
    if (!Array.prototype.indexOf) {
      var i = arr.length;
      while (i--) {
        if (arr[i] === item) {
          return true;
        }
      }
      return false;
    }
    return arr.indexOf(item) != -1;
  }

  function scriptHint(editor, keywords, getToken, options) {
    // Find the token at the cursor
    var cur = editor.getCursor(),
      token = getToken(editor, cur);
    if (/\b(?:string|comment)\b/.test(token.type)) return;
    token.state = CodeMirror.innerMode(editor.getMode(), token.state).state;

    // If it's not a 'word-style' token, ignore the token.
    if (!/^[\w$_]*$/.test(token.string)) {
      token = {
        start: cur.ch,
        end: cur.ch,
        string: "",
        state: token.state,
        type: token.string == "." ? "property" : null
      };
    }
    else if (token.end > cur.ch) {
      token.end = cur.ch;
      token.string = token.string.slice(0, cur.ch - token.start);
    }

    var tprop = token;
    // If it is a property, find out what it is a property of.
    while (tprop.type == "property") {
      tprop = getToken(editor, Pos(cur.line, tprop.start));
      if (tprop.string != ".") return;
      tprop = getToken(editor, Pos(cur.line, tprop.start));
      if (!context) var context = [];
      context.push(tprop);
    }
    return {
      list: getCompletions(token, context, keywords, options),
      from: Pos(cur.line, token.start),
      to: Pos(cur.line, token.end)
    };
  }

  function javascriptHint(editor, options) {
    return scriptHint(editor, [],
      function(e, cur) {
        return e.getTokenAt(cur);
      },
      options);
  };
  CodeMirror.registerHelper("hint", "javascript", javascriptHint);

  function getCoffeeScriptToken(editor, cur) {
    // This getToken, it is for coffeescript, imitates the behavior of
    // getTokenAt method in javascript.js, that is, returning "property"
    // type and treat "." as indepenent token.
    var token = editor.getTokenAt(cur);
    if (cur.ch == token.start + 1 && token.string.charAt(0) == '.') {
      token.end = token.start;
      token.string = '.';
      token.type = "property";
    }
    else if (/^\.[\w$_]*$/.test(token.string)) {
      token.type = "property";
      token.start++;
      token.string = token.string.replace(/\./, '');
    }
    return token;
  }

  function coffeescriptHint(editor, options) {
    return scriptHint(editor, coffeescriptKeywords, getCoffeeScriptToken, options);
  }
  CodeMirror.registerHelper("hint", "coffeescript", coffeescriptHint);

  var stringProps = ("charAt charCodeAt indexOf lastIndexOf substring substr slice trim trimLeft trimRight " +
    "toUpperCase toLowerCase split concat match replace search").split(" ");
  var arrayProps = ("length concat join splice push pop shift unshift slice reverse sort indexOf " +
    "lastIndexOf every some filter forEach map reduce reduceRight ").split(" ");
  var coffeescriptKeywords = ("and break catch class continue delete do else extends false finally for " +
    "if in instanceof isnt new no not null of off on or return switch then throw true try typeof until void while with yes").split(" ");
  
  
  var spriteProps = ["brightness = 50", "width", "height",  "x", "y", "angle", "x = 10", "y = 10", "angle = UP", "rotationStyle", "showing", "penColor", "penWidth", "deleted", "showCollider", "toJSON", "lastX", "lastY", "distanceTo(sprite1)", "move(10)", "setRotationStyle('NO ROTATE')", "touching", "over", "turnLeft", "turnRight", "sendToBack()", "sendToFront()", "penUp()", "show()", "hide()", "pointTowards(sprite1)", "onMouseDown(() => {\n  \n})", "onMouseUp(() => {\n  \n})", "delete()"]
  var imageProps = spriteProps.concat(["setImageURL('./images/SMJjVCL.png)", "width = 100", "height = 10"])
  var rectangleProps = spriteProps.concat(["width = 10", "height = 10", "color", "color = 'blue'"])
  var circleProps = spriteProps.concat(["width = 10", "height = 10", "color", "color = 'blue'"])
  var lineProps = spriteProps.concat(["width = 5", "x1 = 100", "y1 = 100", "color = 'red'"])
  var textProps = spriteProps.concat(["text = 'Hello!'", "size = 10", "color = 'green'"])

  function getCompletions(token, context, keywords, options) {
    var found = [],
      start = token.string,
      global = document.getElementById("preview").contentWindow;

    function maybeAdd(str) {
      if (str.lastIndexOf(start, 0) == 0 && !arrayContains(found, str)) found.push(str);
    }

    function gatherCompletions(obj){
      if (typeof obj == "string") forEach(stringProps, maybeAdd);
      else if (obj.type == "image") forEach(imageProps, maybeAdd);
      else if (obj.type == "rectangle") forEach(rectangleProps, maybeAdd);
      else if (obj.type == "circle") forEach(circleProps, maybeAdd);
      else if (obj.type == "line") forEach(lineProps, maybeAdd);
      else if (obj.type == "text") forEach(textProps, maybeAdd);
      else if (obj instanceof Array) forEach(arrayProps, maybeAdd);
      else if (typeof obj == "object") for (var name in obj) maybeAdd(name);
    }

    if (context && context.length) {
      // If this is a property, see if it belongs to some object we can
      // find in the current environment.
      var obj = context.pop(),
        base;
      if (obj.type && obj.type.indexOf("variable") === 0) {
        if (options && options.additionalContext)
          base = options.additionalContext[obj.string];
        if (!options || options.useGlobalScope !== false)
          base = base || global[obj.string];
      }
      else if (obj.type == "string") {
        base = "";
      }
      else if (obj.type == "atom") {
        base = 1;
      }
      else if (obj.type == "function") {
        if (global.jQuery != null && (obj.string == '$' || obj.string == 'jQuery') &&
          (typeof global.jQuery == 'function'))
          base = global.jQuery();
        else if (global._ != null && (obj.string == '_') && (typeof global._ == 'function'))
          base = global._();
      }
      while (base != null && context.length)
        base = base[context.pop().string];
      if (base != null) gatherCompletions(base);
    }
    else {
      var img = 'var imageSprite1 = new Image({\n  url: "./images/SMJjVCL.png" ,\n  width: 284, \n  height: 200, \n  x: 100, \n  y: 20\n})'
      var txt = 'var textSprite1 = new Text({\n  text: () => "Hello world!", \n  size: 16, \n  color: "rgb(100, 50, 240)", \n  fontFamily: "arial"\n})'
      var clc = 'var circleSprite1 = new Circle({\n  radius: 10, \n  color: "blue", \n  x: 0, \n  y: 0\n})'
      var rct = 'var rectangleSprite1 = new Rectangle({\n  width: 20, \n  height: 55, \n  color: "pink"\n})'
      var lne = 'var lineSprite1 = new Line({\n  color: "pink", \n  lineWidth: 10, \n  x: -100, \n  y: 100, \n  x1: 10, \n  y1: 20\n})'
      var iff = 'if () {\n  \n}'
      var elsee = 'else {\n  \n}'
      var woof = [iff, elsee, 'randomColor()', 'when(() => mouseDown, () => {\n  \n})', 'random(0, 10)', "var variable1 = 0", img, txt, clc, rct, lne, "new Image({})", "new Rectangle({})", "new Line({})", "new Text({})", "new Circle({})", "cameraX", "cameraY", "ready", "height", "width", "minX", "maxX", "minY", "maxY", "randomX()", "randomY()","freeze()", "defrost()", "mouseDown", "mouseX", "mouseY", "pMouseX", "pMouseY", "mouseXSpeed", "mouseYSpeed", "keysDown.includes('UP')", "onMouseMove(() => {\n  \n})", "onMouseDown(() => {\n  \n})", "onMouseUp(() => {\n  \n})", "onKeyDown(() => {\n  \n})", "onKeyUp(() => {\n  \n})", "every(1, 'second', () => {\n  \n})", "forever(() => {\n  \n})", "when(() => mouseDown, () => {\n  \n})", "repeat(10, () => {\n  \n})", "repeatUntil(() => mouseDown, () => {\n  \n})", "after(1, 'second', () => {\n  \n})", "clearPen()",]
      
      var backdropMethods = ["setBackdropURL('./images/q6Bqraw.jpg')", 
                             "setBackdropColor('blue')", 
                             "setBackdropStyle('cover')",
                             "setBackdropStyle('50%')",
                             "setBackdropRepeat('no-repeat')",
                             "setBackdropRepeat('repeat-y')",
                             "setBackdropRepeat('repeat-x')",];
      woof = woof.concat(backdropMethods)
      forEach(woof, maybeAdd)
      
      // If not, just look in the global object and any local scope
      // (reading into JS mode internals to get at the local and global variables)
      
      
      //for (var v = token.state.localVars; v; v = v.next) maybeAdd(v.name);
      // for (var v = token.state.globalVars; v; v = v.next) maybeAdd(v.name);
      
      forEach(keywords, maybeAdd);
    }
    return found;
  }
});
