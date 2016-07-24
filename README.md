# WoofJS - *JavaScript Unleashed*

WoofJS is a JavaScript framework for creating games by [The Coding Space](http://thecodingspace.com).

If you're new to JavaScript, [you may want to get acquainted with its basic syntax and paradigm](https://github.com/getify/You-Dont-Know-JS/blob/master/up%20&%20going/ch1.md).

## Getting Started

We reccomend you File>Clone this JSBin to get started: [https://jsbin.com/lekovu/edit?js,output](https://jsbin.com/lekovu/edit?js,output)

Alternatively, you can put Woof between your HTML `<head>` tags.

```html
<script src="https://cdn.rawgit.com/stevekrouse/WoofJS/f62682d2f1b40fb204894b217f00d3f91f79e2e9/woof.js"></script>
```

## [Demo](https://jsbin.com/ciwame/edit?js,console,output)

```javascript
var circle = new Circle({})
forever(() => {
  circle.radius = circle.distanceTo(mouseX, mouseY)
})
circle.onMouseDown(() => {
  circle.color = randomColor()
})
```

## Creating Sprites

To create a new sprite, start by typing one of the following lines:


```javascript
var IMAGE_NAME = new Image({});
var TEXT_NAME = new Text({});
var CIRCLE_NAME = new Circle({});
var RECTANGLE_NAME = new Rectangle({});
var LINE_NAME = new Line({});
```

*Pro tip: Be sure to change the `SPRITE_NAME` to a name of your choice!*

### Sprite Options

You may add any of the following options to any of your sprites:

```javascript
var IMAGE_NAME = new Image({x: 100, y: 20, angle: UP, rotationStyle: "ROTATE", showing: true});
var TEXT_NAME = new Text({x: 50, y: -100, angle: DOWN, rotationStyle: "NO ROTATE", showing: true});
var CIRCLE_NAME = new Circle({x: 0, y: 0, angle: 90, rotationStyle: "ROTATE LEFT RIGHT", showing: false});
var RECTANGLE_NAME = new Rectangle({x: 62, y: 12, angle: 0, rotationStyle: "ROTATE", showing: false});
var LINE_NAME = new Line({x: maxX, y: maxY, angle: 0, rotationStyle: "ROTATE", showing: false});
```

### Specific Options

Each sprite has its own specific options. For example, `Image` has `url`, `Circle` has `radius`, and text has `fontFamily`:

```javascript
var IMAGE_NAME = new Image({url: "https://i.imgur.com/SMJjVCL.png/?1",width: 30, height: 30});
var TEXT_NAME = new Text({text: "Hello world!", size: 12, color: "rgb(100, 50, 240)", fontFamily: "arial", textAlign: "left"});
var CIRCLE_NAME = new Circle({radius: 10, color: "#ffffff"});
var RECTANGLE_NAME = new Rectangle({width: 20, height: 55, color: "pink"});
var LINE_NAME = new Line({x: -100, y: 100, x1: 10, y1: 20, color: "pink", lineWidth: 10});
```

## <img src="http://i.imgur.com/8AtJrAa.png"/> Motion

![move 10 steps](http://i.imgur.com/MwoSN7w.png) `NAME.move(10);`

![turn right](http://i.imgur.com/9Vk3QcG.png) `NAME.turnRight(15);`

![turn left](http://i.imgur.com/Mj8jC77.png) `NAME.turnLeft(15);`

-----

![point in direction](http://i.imgur.com/ISLFDID.png)

```javascript
NAME.angle = LEFT;
NAME.angle = RIGHT;
NAME.angle = UP;
NAME.angle = DOWN;
NAME.angle = 47.7;
```

![point towards mouse](http://i.imgur.com/XxlWh5Y.png) `NAME.pointTowards(mouseX, mouseY);`

![point towards (sprite)](http://i.imgur.com/eQsdxvR.png) `NAME.pointTowards(NAME.x, NAME.Y);`

---

![go to x, y](http://i.imgur.com/Fm23VH2.png) `NAME.x = ...;` `NAME.y = ...;`

![go to mouse pointer](http://i.imgur.com/YMAFBEY.png) `NAME.x = mouseX;` `NAME.y = mouseY;`

![go to sprite](http://i.imgur.com/BBZisqR.png) `NAME.x = otherNAME.x;` `NAME.y = otherNAME.y;`

---

![change x by](http://i.imgur.com/YD4fLDE.png) `NAME.x += ...;`

![change y by](http://i.imgur.com/H39ry0g.png) `NAME.y += ...;`

![set x to](http://i.imgur.com/9FPGyxO.png) `NAME.x = ...;`

![set y to](http://i.imgur.com/BtAGQFz.png) `NAME.y = ...;`

---

![set rotation left-right](http://i.imgur.com/LWlXtDL.png) `NAME.setRotationStyle(“ROTATE LEFT RIGHT”)`

![all around](http://i.imgur.com/KUsAXXl.png) `NAME.setRotationStyle(“ROTATE”)`

![don't rotate](http://i.imgur.com/C37qd9h.png) `NAME.setRotationStyle(“NO ROTATE”)`

## <img src="http://i.imgur.com/XWrvYQp.png"/> LOOKS

![show](http://i.imgur.com/e6P95R0.png) `NAME.show();`

![hide](http://i.imgur.com/23UatF5.png) `NAME.hide();`

---

![change image](http://i.imgur.com/Q0xS7Ff.png) `IMAGE_NAME.setImageURL('...')`

*You can only `setImageURL()` for Images.*

Change the color for rectangles, text, lines and circles:

```javascript
RECTANGLE_NAME.color = "purple";
TEXT_NAME.color = "rgb(10, 150, 30)";
LINE_NAME.color = "#ff20ff";
CIRCLE_NAME.color = "green";
```
---

![set size](http://i.imgur.com/dxOrPmu.png)

You set the size in different ways for each type of sprite:


```javascript
IMAGE_NAME.height = ...; IMAGE_NAME.width = ...;

RECTANGLE_NAME.height = ...; RECTANGLE_NAME.width = ...;

CIRCLE_NAME.radius = ...;

LINE_NAME.x1 = ...;
LINE_NAME.y1 = ...;
LINE_NAME.lineWidth = ...;

TEXT_NAME.size = 20;
```
---

![send to back layer](http://i.imgur.com/XpglvJP.png) `NAME.sendToBack();`

![go to front layer](http://i.imgur.com/KumpqgS.png) `NAME.sendToFront();`

---

![change image](http://i.imgur.com/zaj0pl0.png)

Set the backdrop to an image URL:

```javascript
setBackdropURL("http://example.com/img.jpg");
```

Set the backdrop to a color:

```javascript
setBackdropColor("blue");
```

Set the backdrop size:

```javascript
fullScreen = false;
var width = 300;
var height = 400;
setBackdropSize(width, height);
```

## <img src="http://i.imgur.com/uPpqpym.png"/> PEN

![clear](http://i.imgur.com/bAcm6jH.png) `clearPen();`

![pen down](http://i.imgur.com/TWenWap.png) `NAME.penDown();`

![pen up](http://i.imgur.com/5H7ijBw.png) `NAME.penUp();`

![set pen color](http://i.imgur.com/PLtKVcv.png) `NAME.penColor = “blue”;`

![set pen color](http://i.imgur.com/PLtKVcv.png) `NAME.penColor = “#ff20ff”;`

![set pen color](http://i.imgur.com/PLtKVcv.png) `NAME.penColor = “rgb(10, 100, 20)”;`

![set pen size](http://i.imgur.com/OzY5ZjU.png) `NAME.penWidth = 4;`

## <img src="http://i.imgur.com/cF2TnrD.png"/> DATA

![making a variable](http://i.imgur.com/eicY57I.png) `var sampleVariable;`

![setting variable to value](http://i.imgur.com/HYATXXL.png) `sampleVariable = ...;`

You can combine creating/naming a variable with setting it:

```javascript
var sampleVariable = ...;
```

![changing variable](http://i.imgur.com/pKNFyMw.png) `sampleVariable += ...`

![showing a variable](http://i.imgur.com/DG26IcN.png) `new Text({text: () => "variableName: " + variableName});`

("Showing a variable" works by giving a Text Sprite a function instead of a "string in quotes" as its `text` attribute. The Text Sprite constantly reevaluates the function which keeps the value on the screen in sync with the value of the variable.)

---

![making an array](http://i.imgur.com/sfSmoDT.png) `var sampleArray = [];`

![adding thing to array](http://i.imgur.com/0K0nQD3.png) `sampleArray.push(...);`

(You can add *anything* to an array in JavaScript, including numbers, strings, but even Sprites, functions, and other arrays.)

![length](http://i.imgur.com/QgTdyxe.png) `sampleArray.length`

![](http://i.imgur.com/jXty6LT.png) `sampleArray[1]`

![removing things from array](http://i.imgur.com/jap7qfR.png) `sampleArray.remove(thing);`

![checking if thing is in array](http://i.imgur.com/IbZHFpm.png) `sampleArray.includes('...');`

![show array](http://i.imgur.com/YIG9stl.png) `new Text({text: () => "listName: " + listName});`

Do something for each thing in an array:

```javascript
sampleArray.forEach(thing => {
  console.log(thing)
});
```
---

Check if a condition holds for at least one thing in an array:

```javascript
if (sampleArray.some(thing => thing.over(mouseX, mouseY))) {
  ...
}
```

---

Check if a condition holds for everything in an array:

```javascript
if(sampleArray.every(thing => thing.touching(...))) {
  ...
}
```

---

Find something in an array:

```javascript
var needle = sampleArray.find(thing => thing.touching(...));
if(needle) {
  console.log(needle);
}
```

## <img src="http://i.imgur.com/NAhXXuW.png"/> Events

*Warning: The shape of events in Scratch prevent you from putting an event inside other blocks. Although JavaScript doesn't prevent you from putting events inside other blocks, you should avoid it. For example, don't place an `onMouseDown` event inside a `forever` block.*

![on flag click](http://i.imgur.com/1TFhnMR.png)

```javascript
ready(() => {
  ...
});
```

**Note: Unlike in Scratch, using `ready()` is reccomended but not always required.**

---

![onclick](http://i.imgur.com/XuPircO.png)

```javascript
onMouseDown(() => {
  ...
});
```

On mouse up:

```javascript
onMouseUp(() => {
  ...
});
```

On mouse move:

```javascript
onMouseMove(() => {
  ...
});
```

---

![onclick](http://i.imgur.com/z15mnPj.png)

```javascript
NAME.onMouseDown(() => {
  ...
});
```

On mouse up:

```javascript
NAME.onMouseUp(() => {
  ...
});
```

---

![If pressing ...](http://i.imgur.com/CoXW12B.png)

```javascript
onKeyDown(() => {
  ...
});
```

![If pressing ...](http://i.imgur.com/TDClulO.png)

```javascript
onKeyDown(key => {
 if (key == 'A') {
   ...
 }
});
```

![](http://i.imgur.com/UauTNwu.png)

```javascript
onKeyDown(key => {
 if (key == 'UP') {
   ...
 }
});
```

## <img src="http://i.imgur.com/Tz78euG.png"/> Sensing

![touching mouse](http://i.imgur.com/QTpWOxV.png) `NAME.mouseOver`

![touching edge](http://i.imgur.com/yEXInKi.png)

If you want to see if the center of your sprite is outside of a boundary, here are some expressions that could be helpful:

```javascript
NAME.x > maxX
NAME.x < minX
NAME.y > maxY
NAME.y < minY
```

![touching NAME](http://i.imgur.com/s26w6pc.png) `NAME.touching(OTHER_NAME)`

**NOTE: touching detects the rectangular boundary of a sprite, so if you have an image with a large transparent border, you will need to trim your image to make touching accurate.**

---

![distance to mouse pointer](http://i.imgur.com/cIY3SYy.png) `NAME.distanceTo(mouseX, mouseY);`

![distance to other thing](http://i.imgur.com/y6sXGTK.png) `NAME.distanceTo(OTHER_NAME);`

---

![If pressing ...](http://i.imgur.com/bZnzRKH.png) `keysDown.includes('SPACE');`

List of keys currently pressed: `keysDown`

---

![mouse x](http://i.imgur.com/JcKLf1r.png) `mouseX`

![mouse y](http://i.imgur.com/j8CFqUt.png) `mouseY`

---

![x position of...](http://i.imgur.com/afLdt8K.png) `NAME.x`

![y position of...](http://i.imgur.com/B7vDhj2.png) `NAME.y`

---

Previous mouse X: `pMouseX`

Previous mouse Y: `pMouseY`

---

Mouse X speed: `mouseXSpeed`

Mouse Y speed: `mouseYSpeed`

---

Right edge of the screen: `maxX`

Left edge of the screen: `minX`

Top edge of the screen: `maxY`

Bottom edge of the screen: `minY`

---

Width of the screen: `width`

Height of the screen: `height`

---

![](http://i.imgur.com/1kOHRyz.png) `hour();`

Hour in military time: `hourMilitary();`

![](http://i.imgur.com/7in6ifA.png) `minute();`

![](http://i.imgur.com/hWI9CTr.png) `second();`

![](http://i.imgur.com/WhsQf1m.png) `dayOfMonth();`

![](http://i.imgur.com/gL5xkbe.png) `dayOfWeek();`

![](http://i.imgur.com/w5cJ5at.png) `month();`

![](http://i.imgur.com/isWxU8C.png) `year();`

## <img src="http://i.imgur.com/851mEzr.png"/> OPERATORS

![](http://i.imgur.com/nsDkCkt.png) `... + ...`

![](http://i.imgur.com/XSAATIP.png) `... - ...`

![](http://i.imgur.com/ujnGpE6.png) `... * ...`

![](http://i.imgur.com/B0BGkCJ.png) `... / ...`

---

![pick random number](http://i.imgur.com/fAHuDwy.png) `random(..., ...);`

Random X value on the screen between `minX` and `maxX`: `randomX()`

Random Y value on the screen between `minY` and `maxY`: `randomY()`

Random color: `randomColor()`

---

![](http://i.imgur.com/2hqoHfh.png) `... < ...`

![](http://i.imgur.com/qX7dmwt.png) `... > ...`

![](http://i.imgur.com/7f8FRbZ.png) `... == ...`

Less Than or Equal To: `... <= ...`

Greater Than or Equal To: `... >= ...`

Not Equals: `... != ...`

Between Two Numbers : `NAME.x.between(minX, maxX)`

---

![and](http://i.imgur.com/UYhM5tp.png) `... && ...`

![or](http://i.imgur.com/PT3Iln0.png) `... || ...`

![not](http://i.imgur.com/fHrS9ZK.png) `!(...)`

---

![](http://i.imgur.com/VqgL2io.png) `"hello" + "world"`

![](http://i.imgur.com/hIRi6xQ.png) `"world".substring(0,1)`

![](http://i.imgur.com/qsTRaCx.png) `"world.length`

---

![](http://i.imgur.com/NFoY9l8.png) `... % ...`

![](http://i.imgur.com/tkvyjRT.png) `Math.round(...)`

## <img src="http://i.imgur.com/bRcYPen.png"/> More Blocks

![Make Block](http://i.imgur.com/AZlRb6h.png)

You can create a function with a name:

```javascript
var namedFunction = (input1, input2) => {
  // do stuff here with input1 and input2
}
```

You can run a function by putting parentheses next to its name:

```javascript
namedFunction(1, 2)
```

You need to do this even if the function takes no parameters:

```javascript
namedFunctionWithoutParameters()
```

But you can also create a function without a name, which is called an anonymous function:

```javascript
forever(() => {
  sprite.x++;
})
```

## <img src="http://i.imgur.com/NFykqPj.png"/> Sound

![Play a sound](http://i.imgur.com/L8znmOb.png)

```javascript
var bruce = new Audio('http://mhoerner.dyndns.org/mp3/Bruce%20Springsteen/Born%20To%20Run/05%20Born%20To%20Run.mp3')
bruce.play()
```

![Pause a sound](http://i.imgur.com/X9kk6yW.png) `bruce.pause()`

To get the URL of an mp3, Google search:

```
intitle:index.of?mp3 NAME-OF-SONG
```

![sound search](http://i.imgur.com/t9XKOpn.png)

## <img src="http://i.imgur.com/lZKvsP5.png"/> Control


![wait](http://i.imgur.com/r6wYX8c.png)

There is no wait block in JavaScript. Instead, you can use `after()`:

```javascript
after(..., "seconds", () => {...});
```

However, `after()` is a poor substitute for Scratch's wait block and you may find some programs very difficult to write without wait. Please accept my apologies on behalf of the designers of JavaScript. 

If you want to wait at regular intervals, use `every()`:

```javascript
every(..., "seconds", () => {
  ...
});
```
---

![repeat](http://i.imgur.com/jwe13bm.png)

```javascript
repeat(10, () => {
  ...
});
```

![forever](http://i.imgur.com/gZOjLDM.png)

```javascript
forever (() => {
  ...
});
```
--- 

![if... then...](http://i.imgur.com/u5rKA36.png)

```javascript
if (...) {
  ...
}
```

![if.. then... else...](http://i.imgur.com/RYOpSaq.png)

```javascript
if (...) {
  ...
} else {
  ...
}
```
--- 

![](http://i.imgur.com/aQ9iJNw.png)

```javascript
repeatUntil(() => ..., () => {
  ...
});
```
---

![](http://i.imgur.com/neWaran.png)

There is no wait-until in JavaScript. You can simulate a wait-until block by specifying a third function to a `repeatUntil`. Refer to the "Control Flow" section below for more details.

```javascript
repeatUntil(() => ..., () => {}, () => {
  ...
});
```

![](http://i.imgur.com/OXlpK9J.png)

`when()` is a short-hand for a `forever`-`if` statement.

```javascript
when(() => ..., () => {
  ...
});
```

![stop(all)](http://i.imgur.com/SWSxdVm.png) `freeze();`

Reverse freeze or stop all: `defrost();`

![cloning](http://i.imgur.com/gNzTpS0.png)

```javascript
// create a list to store all of the clones
var clones = [];
every(4, "seconds", () => {
  // create a clone every 4 seconds
  var clone = new Circle({radius: 10, color: "pink", x:
randomX(), y: randomY()});
  // add each clone to the list
  clones.push(clone);
});

forever(() => {
  // forever, for each clone in clones
  clones.forEach(clone => {
    // move it to the right
    clone.x++;
    // delete it if it goes off the screen
    if (clone.x > maxX) {
      clone.delete();
    }
  })
});
```

Delete an object: `NAME.delete();`

Only allow something to happen once every X miliseconds:

```javascript
onMouseDown(throttle(() => score++, 1000)) // after a mousedown, you won't be able to trigger this event again for 1000 milliseconds 
```

### Control Flow

There are two types of commands in JavaScript:

1) **Synchronous**: "Do this immediately and move on when it's done."

*Synchronous example in real life*: Open heart surgery. When a doctor begins open heart surgery on a patient, she stays in the operating room with the patient until the surgery is done and the patient is stitched back up. She doesn't start open surgery with one patient and then move on to another operating room where she begins operating on a second patient before the first operation is done. She starts and finishes one operation before starting a second.

2) **Asynchronous**: "Start this immediately, but don't wait till it's done. Move on to the next command immediately after you start this command."

*Asynchronous example in real life*: Ordering food or drinks. First, let's imagine what a synchronous restaurant would look like. A waiter would come to your table, take 1 person's order, rush it back to the kitchen, wait for the kitchen to finish with that person's order, and then bring it back to that person. Only once this first order is taken care of would the waiter then ask the second person at the table for their order. Of course this would be ridiculous. It makes much more sense for a restaurant to process its customers' orders “asynchronously.” That is, after a waiter takes one person's order, he is free to take another person's order before finishing the first order to completion. This allows the restaurant to do multiple things at once, which is ultimately faster because some tasks, like chopping vegetables while you wait for a pot of water to heat, make more sense in parallel than sequence. 

Most commands in programming are synchronous. For example, `if`-statements, setting or changing variables, and calling most Woof methods like `rectangle.move(10)` are all synchronous commands.

`forever` is an example of an asynchronous command. Think about it: if `forever` told the computer to wait until it was done before moving on, the computer would never move on to the next line.

`repeat`, `repeatUntil`, `every`, `after` are also asynchronous commands.

Asynchronous commands become quite confusing when you want something to happen after an asynchronous command is *finished*. If you want something after the 10th time you `repeat` it, you can't just put it on the line below the close of the `repeat` block. Why? Because the line below `repeat` happens immediately after the asynchronously command *starts*, not after it finishes. If at the end of ordering a meal, you ask the waiter to refill your water, you expect him to refill it immediately after sending your order to the kitchen, not after you've received all your food, despite this order coming after the food orders. 

But what if, for some perverse reason, you wanted the waiter to wait until *after* you received your food to refill your water? That is, how do we tell the computer to do something after an asynchronous command is *finished*? This is different for each programming language, but for WoofJS, `repeat` and `repeatUntil`, optionally accept a function as an extra parameter to specify what should happen after the asynchonous command is *finished*. This is called a "callback" because that function is "called back" and run *after* the main part of the command is *finished*.

Also, be careful not to wantonly nest asynchronous commands within each other's main body. For example if you want to make an image move in a square for forever, you can't just put four nested repeats inside a forever. If you put a repeat in a forever, that will cause the computer continuously spawning new repeats really quickly. It's like repeatedly asking a waiter for more and more food before your first course has arrived. The waiter and kitchen will spend so much time processing these thousands of orders, it'll likely cause the restaurant to crash! Instead, in Woof, you have to use recursion and tell your repeat code to start-over only after the 4th repeat is finished finished.

Change color to blue after moving to the right 10 times:

```javascript
repeat(10, () => {
  NAME.x++;
}, () => {
  NAME.color = "blue";
});
```

Chaining repeats to slowly draw a square:

```javascript
repeat(100, () => {
  NAME.angle = RIGHT;
  NAME.move(1);
}, () => {
  repeat(100, () => {
    NAME.angle = UP;
    NAME.move(1);
  }, () => {
    repeat(100, () => {
      NAME.angle = LEFT;
      NAME.move(1);
    }, () => {
      repeat(100, () => {
        NAME.angle = DOWN;
        NAME.move(1);
      });
    });
  });
});
```

## Global Mode

When you include the Woof script in your code, it defaults to creating a full-screen project and polluting your global namespace with Woof's methods. We find not having to type "Woof." over and over again makes a huge difference for beginner programmers, especially those new to typing.

However, if you'd like to turn off this mode, simply add `global="false"` in your script tag and create your project manually:

```javascript
var project = new Woof({global: false, width: 300, height: 400});

var IMAGE_NAME = new Woof.Image({project: project, url: "https://i.imgur.com/SMJjVCL.png?1"})
```

## [Making JavaScript Learnable](https://medium.com/@stevekrouse/woof-d9adf2110fc6)

WoofJS was created to be the next step after block-based coding in Scratch. For more details, you can [read our announcement post](https://medium.com/@stevekrouse/woof-d9adf2110fc6).


