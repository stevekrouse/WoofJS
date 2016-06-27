# WoofJS - *JavaScript Unleashed*

WoofJS is a JavaScript framework for making games developed with :heart: by [The Coding Space](http://thecodingspace.com).

## Getting Started

We reccomend you clone this JSBin to get started: [https://jsbin.com/lekovu/edit?js,output](https://jsbin.com/lekovu/edit?js,output)

Alternatively, you can put Woof between the `<head>` tags.
```html
<script src="https://cdn.rawgit.com/stevekrouse/WoofJS/21ec67e3592012375ebc4d11094937d11b461067/woof.js"></script>
```

## Creating Sprites

```javascript
var IMAGE_NAME = new Image();
var TEXT_NAME = new Text();
var CIRCLE_NAME = new Circle();
var RECTANGLE_NAME = new Rectangle();
var LINE_NAME = new Line();
```

### Sprite Options

Every sprite can be created using the following options:

```javascript
var IMAGE_NAME = new Image({x: 100, y: 20, angle: UP, rotationStyle: "ROTATE", showing: true});
var TEXT_NAME = new Text({x: 50, y: -100, angle: DOWN, rotationStyle: "NO ROTATE", showing: true});
var CIRCLE_NAME = new Circle({x: 0, y: 0, angle: 90, rotationStyle: "ROTATE LEFT RIGHT", showing: false});
var RECTANGLE_NAME = new Rectangle({x: 62, y: 12, angle: 0, rotationStyle: "ROTATE", showing: false});
var LINE_NAME = new Rectangle({x: maxX, y: maxY, angle: 0, rotationStyle: "ROTATE", showing: false});
```

### Specific Options

Each sprite has its own specific options:

```javascript
var IMAGE_NAME = new Image({url: "https://i.imgur.com/SMJjVCL.png", imageWidth: 30, imageHeight: 30});
var TEXT_NAME = new Text({text: "Hello world!", size: 12, color: "rgb(100, 50, 240)", fontFamily: "arial", textAlign: "left"});
var CIRCLE_NAME = new Circle({radius: 10, color: "#ffffff"});
var RECTANGLE_NAME = new Rectangle({rectangleHeight: 10, rectangleWidth: 20, color: "pink"});
var LINE_NAME = new Line({x: -100, y: 100, x1: 10, y1: 20, color: "pink", lineWidth: 10});
```

## <img height="45px" img src ="http://i.imgur.com/8AtJrAa.png"/> Motion

![move 10 steps](http://i.imgur.com/MwoSN7w.png) `NAME.move(...);`

![turn right](http://i.imgur.com/9Vk3QcG.png) `NAME.turnRight(...);`

![turn left](http://i.imgur.com/Mj8jC77.png) `NAME.turnLeft(...);`

![point in direction](http://i.imgur.com/ISLFDID.png) 

```javascript
NAME.angle = LEFT;
NAME.angle = RIGHT;
NAME.angle = UP;
NAME.angle = DOWN;
```

![point towrads mouse](http://i.imgur.com/XxlWh5Y.png) `NAME.pointTowards(mouseX, mouseY);`

![point towards (sprite)](http://i.imgur.com/eQsdxvR.png) `NAME.pointTowards(NAME.x, NAME.Y);`

![go to x, y](http://i.imgur.com/Fm23VH2.png) `NAME.x = ...;` `NAME.y = ...;`

![go to mouse pointer](http://i.imgur.com/YMAFBEY.png) `NAME.x = mouseX;` `NAME.y = mouseY;`

![go to sprite](http://i.imgur.com/BBZisqR.png) `NAME.x = otherNAME.x;` `NAME.y = otherNAME.y;`

![change x by](http://i.imgur.com/YD4fLDE.png) `NAME.x += ...;` `NAME.x -= ...;`

![change y by](http://i.imgur.com/H39ry0g.png) `NAME.y += ...;` `NAME.y -= ...;`

![set x to](http://i.imgur.com/9FPGyxO.png) `NAME.x = ...;`

![set y to](http://i.imgur.com/BtAGQFz.png) `NAME.y = ...;`

![set rotation left-right](http://i.imgur.com/LWlXtDL.png) `NAME.setRotationStyle(“ROTATE LEFT RIGHT”)`

![all around](http://i.imgur.com/KUsAXXl.png)   `NAME.setRotationStyle(“ROTATE”)`

![don't rotate](http://i.imgur.com/C37qd9h.png) `NAME.setRotationStyle(“NO ROTATE”)`

## <img height="45px" img src="http://i.imgur.com/XWrvYQp.png"/> LOOKS

![show](http://i.imgur.com/e6P95R0.png) `NAME.showing = true;`

![hide](http://i.imgur.com/23UatF5.png) `NAME. showing = false;`

![send to back layer](http://i.imgur.com/XpglvJP.png) `NAME.sendToBack();`

![go to front layer](http://i.imgur.com/KumpqgS.png) `NAME.sendToFront();`

![set size](http://i.imgur.com/dxOrPmu.png)

```javascript
IMAGE_NAME.imageHeight = ...; IMAGE_NAME.imageWidth = ...;

RECTANGLE_NAME.rectangleHeight = ...; RECTANGLE_NAME.rectangleWidth = ...;

CIRCLE_NAME.radius = ...;

LINE_NAME.x1 = ...;
LINE_NAME.y1 = ...;
LINE_NAME.lineWidth = ...;

TEXT_NAME.size = 20;
```

Change the color:

```javascript
RECTANGLE_NAME.color = "purple";
TEXT_NAME.color = "rgb(10, 150, 30)";
LINE_NAME.color = "#ff20ff";
CIRCLE_NAME.color = "green";
```

Set the text value to an unchanging value: `TEXT_NAME.text = "Sample Text";`

Set the text value to an changing functional expression: `TEXT_NAME.text = () => "Variable Name: " + variableName;`

Set the text font family: `TEXT_NAME.fontFamily = "arial";`

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

## <img height="45px" img src="http://i.imgur.com/uPpqpym.png"/> PEN

![clear](http://i.imgur.com/bAcm6jH.png) `clearPen();`

![pen down](http://i.imgur.com/TWenWap.png) `NAME.penDown = true;`

![pen up](http://i.imgur.com/5H7ijBw.png) `NAME.penDown = false;`

![set pen color](http://i.imgur.com/PLtKVcv.png)= `NAME.penColor = “blue”;`

![set pen color](http://i.imgur.com/PLtKVcv.png)= `NAME.penColor = “#ff20ff”;`

![set pen color](http://i.imgur.com/PLtKVcv.png)= `NAME.penColor = “rgb(10, 100, 20)”;`

![set pen size](http://i.imgur.com/OzY5ZjU.png) `NAME.penWidth = 4;`

## <img height="45px" img src="http://i.imgur.com/cF2TnrD.png"/> DATA

![making a variable](http://i.imgur.com/eicY57I.png) `var sampleVariable;`

![setting variable to value](http://i.imgur.com/HYATXXL.png) `sampleVariable = ...;`

![changing variable](http://i.imgur.com/pKNFyMw.png) `sampleVariable += ...;` `sampleVariable -= ...;`

![making an array](http://i.imgur.com/sfSmoDT.png)  `var sampleArray = [];`

![adding thing to array](http://i.imgur.com/0K0nQD3.png) `sampleArray.push(...);`

![removing things from array](http://i.imgur.com/jap7qfR.png) `sampleArray.splice(startIndex, endIndex);`

![checking if thing is in array](http://i.imgur.com/IbZHFpm.png) `sampleArray.includes('...');`

Do something for each thing in an array:

```javascript
sampleArray.forEach(thing => {
  console.log(thing)
  });
```

Check if a condition holds for at least one thing in an array = 

```javascript
if (sampleArray.some(thing => thing.over(mouseX, mouseY))) {
 doSomething();
}
```

Check if a condition holds for everything in an array = 

```javascript
if(sampleArray.every(thing => thing.touching(...))) {
  doSomething();
}
```

## <img height="45px" img src="http://i.imgur.com/NAhXXuW.png"/> Events

TODO on backdrop click = 

```javascript
onClick(() => {
  ...
});
```

TODO on sprite click = 

```javascript
NAME.onClick(() => {
  ...
});
```

## <img height="45px" img src="http://i.imgur.com/lZKvsP5.png"/> Control

![forever](http://i.imgur.com/gZOjLDM.png) 

```javascript
forever (() > { 
  ...
});
```

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

![stop(all)](http://i.imgur.com/SWSxdVm.png) `freeze();`

Reverse freeze or stop all: `defrost();`

Delete an object: `NAME.delete();`

![cloning](http://i.imgur.com/gNzTpS0.png) 

```javascript
// create a list to store all of the clones
var clones = [];
every(4, "seconds", () => {
  // create a clone every 4 seconds
  var clone = addCircle ({radius: 10, color: "pink", x: 
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

Only allow something to happen once every X miliseconds:

```javascript
onClick(throttle(() => score++, 1000))  // after a click, you won't be able to click for 1 second
```

## <img height="45px" img src="http://i.imgur.com/Tz78euG.png"/> Sensing

![touching mouse](http://i.imgur.com/QTpWOxV.png) `NAME.mouseOver() `

![touching edge](http://i.imgur.com/yEXInKi.png) `NAME.x > maxX` `NAME.x < minX` `NAME.y > maxY` `NAME.y < minY`

![touching NAME](http://i.imgur.com/s26w6pc.png) `NAME.touching(OTHER_NAME)) {...};`

![distance to mouse pointer](http://i.imgur.com/cIY3SYy.png) `NAME.distanceTo(mouseX, mouseY);`

![distance to other thing](http://i.imgur.com/y6sXGTK.png) `NAME.distanceTo(OTHER_NAME);`

![If pressing ...](http://i.imgur.com/bZnzRKH.png) `keysDown.includes(' ');`

TODO Is 'A' pressed?: `keysDown.includes('A')`

TODO Is the up key pressed?: `keysDown.includes('UP')`

TODO other special keys

![mouse x](http://i.imgur.com/JcKLf1r.png) `mouseX`

![mouse y](http://i.imgur.com/j8CFqUt.png) `mouseY`

![x position of...](http://i.imgur.com/afLdt8K.png) `NAME.x`

![y position of...](http://i.imgur.com/B7vDhj2.png) `NAME.y`

Previous mouse X: `pMouseX`

Previous mouse Y: `pMouseY`

Mouse X speed: `mouseXSpeed`

Mouse Y speed: `mouseYSpeed`

List of keys currently pressed: `keysDown`

Is 'A' pressed?: `keysDown.includes('A')`

Is the space key pressed?: `keysDown.includes(' ')`

Is the up key pressed?: `keysDown.includes('UP')`

Right edge of the screen: `maxX`

Left edge of the screen: `minX`

Top edge of the screen: `maxY`

Bottom edge of the screen: `minY`

Random X value on the screen between `minX` and `maxX`: `randomX()`

Random Y value on the screen between `minY` and `maxY`: `randomY()`

Width of the screen: `width`

Height of the screen: `height`

Distance of thing to a point: `NAME.distanceTo(X, Y);`

## <img height="45px" img src="http://i.imgur.com/851mEzr.png"/> OPERATORS

Addition ![](http://i.imgur.com/nsDkCkt.png) `(...) + (...)`

Subtraction ![](http://i.imgur.com/XSAATIP.png) `(...) - (...)`

Multiplication ![](http://i.imgur.com/ujnGpE6.png) `(...) * (...)`

Division ![](http://i.imgur.com/B0BGkCJ.png) `(...) / (...)`

![pick random number](http://i.imgur.com/fAHuDwy.png) `random(..., ...);`

![](http://i.imgur.com/2hqoHfh.png) `... < ...`

![](http://i.imgur.com/qX7dmwt.png) `... > ...`

![](http://i.imgur.com/7f8FRbZ.png) `... == ...`

Less Than or Equal To = `... <= ...`

Greater Than or Equal To = `... >= ...`

And ![and](http://i.imgur.com/UYhM5tp.png) `... && ...`

Or ![or](http://i.imgur.com/PT3Iln0.png) `... || ...`

Not ![not](http://i.imgur.com/2Y4XeP8.png) `... != ...`

Random color: `randomColor()`

TODO Get the current hour: `hour();`

TODO Get the current hour in military time: `hourMilitary();`

TODO Get the current minute: `minute();`

TODO Get the current second: `second();`

TODO Get the current day of the month (1-31): `dayOfMonth();`

TODO Get the current day of the week (Monday-Sunday): `dayOfWeek();`

## <img height="45px" img src="http://i.imgur.com/bRcYPen.png"/> More Blocks

TODO no add extension ![Make Block](http://i.imgur.com/XCrGoqr.png)
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

But you can also create a function without a name, which is called an anonymous function:

```javascript
forever(() => {
  sprite.x++;
})
```

### Control Flow

There are two types of commands in JavaScript:

1) **Synchronous**: "Do this immediately and move on when it's done."

*Synchronous example in real life*: Open heart surgery. When a doctor begins open heart surery on a patient, she stays in the operating room with the patient until the surgery is done and the patient is stitched back up. She doesn't start open surgery with one patient and then move on to another operating room where she begins operating on a second patient before the first operation is done. She starts and finishes one operation before starting a second.

2) **Asynchronous**: "Start this immediately, but don't wait till it's done. Move on to the next command immediately after you start this command."

*Asynchronous example in real life*: Ordering food or drinks. First, let's imagine what a synchronous resturant would look like. A waiter would come to your table, take 1 person's order, rush it back to the kitchen, wait for the kitchen to finish with that person's order, and then bring it back to that person. Finally once this first order is taken care of, the waiter would ask the second person at the table for their order. Of course this would be ridiculous. It makes much more sense for a resturant to process its customers' orders asynchronously. That is, after a waiter takes one person's order, he is free to take another person's order before finishing the first order. This allows the resturant to do multiple things at once, which is ultimately faster for some types of tasks, particularly those that take a lot of time to process.

Most commands are synchronous. For example, if-statements, setting or changing variables, and calling most Woof methods like `rectangle.move(10)` are all synchronous commands.

`forever` is an example of an asynchronous command. Think about it: if `forever` told the computer to wait until it was done, it would never move on to the next line.

`repeat`, `repeatUntil`, `every`, `after` are also asynchronous.

Asynchronous commands become quite confusing when you something happen after an asynchronous command is *finished*. If you want something after the 10th time you `repeat` it, you can't just put it on the line below the `repeat`. Why? Because the line below `repeat` happens immediately after the asynchronously command *starts*, not after it finishes. 

So how do we tell the computer to do something after an asynchronous command is *finished*? This is different for each language, but for Woof's `repeat` and `repeatUntil`, add a function as an extra parameter to those commands that specifies what should happen after the asynchonous command is *finished*. This is called a "callback" because that function is "called back" and run *after* the main part of the command is done.

Also, be sure not to nest async commands within each other's main body. For example if you want to make an image move in a square for forever, you can't just put four nested repeats inside a forever. Instead you have to use recursion and tell your repeat code to start-over only after the 4th repeat is finished finished. (If you put a repeat in a forever, it'll  keep starting new repeats for forever really quickly. It's like repeatedly asking a waiter for seconds before your first course has arrived.)


  - Repeat 10 times: 

```javascript
repeat(10, () => { 
  NAME.x++;
});
```

  - Do something after done repeating:

```javascript
repeat(10, () => { 
  NAME.x++;
}, () => {
  NAME.color = "blue";
});
```

  - Chaining repeats:

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

  - Repeat constantly until (you have to put the condition in a function): 

```javascript
repeatUntil(() => IMAGE_NAME.y < minY, () => {
  IMAGE_NAME.y -= SPEED;
});
```

  - Do seomthing after a `repeatUntil`:

```javascript
repeatUntil(() => IMAGE_NAME.y < minY, () => {
  IMAGE_NAME.y -= SPEED;
}, () => {
  freeze();  
});
```  

  - Do this constantly forever: 

```javascript
forever(() => { 
  CIRCLE_NAME.radius = CIRCLE_NAME.distanceTo(mouseX, mouseY);
});
```
  
  - Do this every second: 

```javascript
var timer = 20;  // make the timer start at 20
var timerText = new Text({x: 0, y: maxY - 20, size: 20, color: "white", text: () => `Time Left: ${timer}`}); // add text that diplays the timer, updating automatically
every(1, "second", () => {
  if (timer === 0){ freeze(); } // freeze the screen when the timer reaches 0
  timer--;   // make the timer go down every second
});
```

  - Do this when a condition (in a function) is true. This is a short-hand for a forever-if statement.

```javascript
when(() => keysDown.includes("LEFT"), () => {
    rectangle.x -= 5; 
});
```
  
  - Do this after one second: 

```javascript
after(1, "second", () => {...});
```

## Global Mode

By default, when you include the Woof script in your code, we default to making a full-screen project and polluting your global namespace with Woof's methods. We find not having to type "Woof." over and over again makes a huge difference for beginnger programmers.

However, if you'd like to turn off this mode, simple add `global="false"` in your script tag.

## [Learnable Programming](http://worrydream.com/LearnableProgramming/)

Despite its many [noted](http://worrydream.com/LearnableProgramming/) flaws, Processing still remains the dominent graphics programming framework for beginners. Woof strives to solve the same problems as Processing, and be a beginner-friendly graphics frameworks for art, animation and game development, but it also hopes to improve upon Processing's main flaws:

  - **opaque parameters setting** - In Woof, all object properties can be set explicitly with dot notation or as named-parameters in the constructor.
  - **side effects in render** - In Woof, you can cause state to change in response to events or intervals. You don't have to hook your effectful code into your render method to make things move.
  - **render** - In Woof, (like ReactJS) we take care of rendering your objects onto the canvas for you. This means you don't even have to think about how your view layer works. It just does.
  - **hidden state** - In Woof, there's no hidden view-layer state. If you make one circle red, only that circle is red.
  - **non-modular** - In Woof, because all view-layer state is encapulated into objects, it allows you to easily build modular and functional code without worrying about side effects.
  - **poor decomposition** - In Woof, you can have infinitely many objects listen to infinitely many events. You don't have to funnel all of your code through the same top-level events that forces you to build tangled code.
  - **lack of identity / metaphor** - Woof steals Scratch's and Smalltalk's everything-is-an-object-that-you-can-see-on-the-screen-immediately metaphor. It also steals LOGO's pen, angles, turning and moving athropomorphic metaphors.

## Showing off

  - Making a page of draggable elements takes Pixi.js [80 lines](http://www.goodboydigital.com/pixijs/examples/8/), while using WoofJS it only takes [20 lines](https://jsbin.com/nepupal/edit?js,output).
  - Making a bunch of crazy bouncing images takes Pixi.js [254 lines](http://www.goodboydigital.com/pixijs/bunnymark/), but only takes WoofJS [32 lines](https://jsbin.com/xivetuf/edit?js,output).
  - Making pong using JQuery and Underscore.js takes [146 lines](https://jenniferdewalt.com/pong.html), while it takes WoofJS [under 60 lines](http://output.jsbin.com/keborur) (and our version has more elements PLUS it works on mobile!).
  - Making this analog clock takes [125 lines](https://jenniferdewalt.com/analog_clock.html) of JavaScript, but only [40 lines](http://output.jsbin.com/yaciqe) using WoofJS.
  - Recreating the viral game [Flappy Bird](http://output.jsbin.com/rarexo) takes under 70 lines using WoofJS.