# WoofJS - *JavaScript Unleashed*

WoofJS is a JavaScript framework for making web and mobile games and animations.

It was originally inspired by Scratch and can help ease the trasition to JavaScript.

WoofJS is developed with :heart: by [The Coding Space](http://thecodingspace.com).

<b>Notice</b>: *This is new software and is under rapid development, so expect things to break and be frequently changed. We expect our first stable release will come out by the end of Summer 2016. Until our first stable release, this software <b>only runs on desktop Chrome</b>, at which point we will support all modern desktop and mobile browsers.*

## Getting Started

You can either <a href="https://jsbin.com/lekovu/edit?js,output" target="_blank">clone this JSBin</a> or follow the steps below to setup your first WoofJS 

1) Put Woof between the `<head>` tags.
```html
<script src="https://cdn.rawgit.com/stevekrouse/WoofJS/dcb1f497a859c5b60053abb7e6a9df0cbc72b4fd/woof.js" global="true"></script>
```
2) Throw in some JavaScript, and tell Woof to fetch it.
```javascript
// tell us the mouse coordinates
addDebug("mouseX");
addDebug("mouseY");

// Set the backdrop URL (preferably of similar dimensions to your canvas)
setBackdropURL("http://i.imgur.com/lyyFGm4.jpg");

// Add an image via a url
var dawg = addImage({url: "http://i.imgur.com/SMJjVCL.png", x: 0, y: 0, imageHeight: 100, imageWidth: 135});

// Make it move with the arrow keys by checking which keys are down
forever(() => {
  if (keysDown.includes("LEFT")){
    dawg.x -= 5;  // move left by 5
  }
  if (keysDown.includes("RIGHT")){
    dawg.x +=5; 
  }
  if (keysDown.includes("UP")){
    dawg.y += 5; 
  }
  if (keysDown.includes("DOWN")){
    dawg.y -= 5; 
  }
});

var timer = 20;  // make the timer start at 20
var timerText = project.addText({x: 0, y: project.maxY - 20, size: 20, color: "white", dynamicText: "'Time Left: ' + timer"}); // add text that diplays the timer (dynamicText updates automatically)
every("1", "second", () => {
  if (timer === 0){ project.stopAll(); } // stop everything when the timer reaches 0
  timer--;   // make the timer go down every second
});
```

### Setting the Backdrop

  - Set the backdrop to an image URL: 
  

```javascript
setBackdropURL("http://example.com/img.jpg");
```

  - Set the backdrop to a color: 

```javascript
setBackdropColor("blue");
```
  
### Sensing
  
  - Mouse X: `mouseX`
  - Mouse Y: `mouseY`
  - Mouse down?: `mouseDown`
  - List of keys currently pressed: `keysDown`
  - Is 'A' pressed?: `keysDown.includes('A')`
  - Is the space key pressed?: `keysDown.includes(' ')`
  - Is the up key pressed?: `keysDown.includes('UP')`
  - Right edge of the screen: `maxX`
  - Left edge of the screen: `minX`
  - Top edge of the screen: `maxY`
  - Bottom edge of the screen: `minY`
  - Random X value on the screen between `minX` and `maxX`: `randomX()`
  - Random Y value on the screen between `minY` and `max: `randomY()`
  - Width of the screen: `width`
  - Height of the screen: `height`


### Debugging
 
  - Adding an expression to the bottom-left corner of the screen: `addDebug("mouseX");`
  - Setting the color of the debug expressions: `debugColor = "white";`

  
### Responding to Events

- Do something on-click once: `onClick((mouseX, mouseY) => { ... });`

  
### Stopping Everything

To stop your whole project and freeze everything on the screen:


```javascript
stopAll();
```

## Woof Objects (Images, Text, Rectangles, and Circles)

When creating a new Image, Text, Rectangle or Circle, you may use the following parameters:

```javascript
  var IMAGE_NAME = addImage({x: 0, y: 0, angle: 0, rotationStyle: "ROTATE", showing: true});
  var TEXT_NAME = addText({x: 0, y: 0, angle: 0, rotationStyle: "ROTATE", showing: true});
  var CIRCLE_NAME = addCircle({x: 0, y: 0, angle: 0, rotationStyle: "ROTATE", showing: true});
  var RECTANGLE_NAME = addRectangle({x: 0, y: 0, angle: 0, rotationStyle: "ROTATE", showing: true});
```

### Detecting

  - Get the x-position: `NAME.x`
  - Get the y-position: `NAME.y`
  - Get the angle: `NAME.angle`
  - Get the width: `NAME.width()`
  - Get the height: `NAME.height()`
  - Touching another thing?: `if (NAME.touching(OTHER_NAME)) { ... }`
  - Mouse over?: `if (NAME.mouseOver()) { ... }`
  - Clicking and holding?: `if (NAME.mouseDown()) { ... }`
  - Get the distance between two things: `NAME.distanceTo(OTHER_NAME);`
  - Get the distance to an X,Y: `NAME.distanceTo(X, Y);`

### Motion

  - Set the X position: `NAME.x = 200;`
  - Change the Y position: `NAME.y += 10;`
  - Set the angle: `NAME.angle = 30;`
  - Set the angle using direction: `NAME.angle = LEFT;` 
  - Turn left: `NAME.turnLeft(10);`
  - Turn right: `NAME.turnRight(10);`
  - Don't rotate the sprites costume when the angle changes: `NAME.setRotationStyle("NO ROTATE");`
  - Rotate left to right when it points in a direction and moves `NAME.setRotationStyle("ROTATE LEFT RIGHT");`
  - Move in the direction of the angle: `NAME.move(10);`
  - Point towards an X,Y : `NAME.pointTowards(mouseX, mouseY)`

### Looks

  - Hide: `NAME.showing = false;`
  - Show: `NAME.showing = true;`
  - Send to the back layer: `NAME.sendToBack();`
  - Send to the front layer: `NAME.sendToFront();`

  
### Pen 


  - Draw a line behind a sprite: `NAME.penDown = true;`
  - Stop drawing a line behind a sprite: `NAME.penDown = false;`
  - Set pen color: `NAME.penColor = "blue";`
  - Set pen width: `NAME.penWidth = 10;`
  - Clear all of the pen paths on the screen: `project.clearPen();`


### Control

  - Delete: `NAME.delete();`
  

### Events 

  - Do something on click: `NAME.onClick((mouseX, mouseY) => { ... });`


### Image
In addition to the default parameters (`x`, `y`, `angle`, `rotationStyle`, and `showing`), you may use these parameters to create a new image: 

```javascript 
var IMAGE_NAME = addImage({url: "http://www.loveyourdog.com/image3.gif", imageWidth: 30, imageHeight: 30});
```
  - Add another image: `IMAGE_NAME.addImageURL("http://www.urdu-english.com/images/lessons/beginner/shapes/shapes-pics/rectangle.png");`
  - Change the image: `IMAGE_NAME.image = 0;`
  - Set the width: `IMAGE_NAME.imageWidth = 10;`
  - Set the height `IMAGE_NAME.imageHeight = 20;`

### Circle
In addition to the default parameters (`x`, `y`, `angle`, `rotationStyle`, and `showing`), you may use these parameters to create a new circle:

```javascript
var CIRCLE_NAME = addCircle({radius: 10, color: "black"});
```
  - Change the radius: `CIRCLE_NAME.radius = 15;`
  - Change the color: `CIRCLE_NAME.color = "blue";`

## Rectangle

In addition to the default parameters (`x`, `y`, `angle`, `rotationStyle`, and `showing`), you may use these parameters to create a new rectangle: 

```javascript
var RECTANGLE_NAME = addRectangle({rectangleHeight: 10, rectangleWidth: 20, color: "pink"});
```
  - Change the width: `RECTANGLE_NAME.rectangleWidth = 20;`
  - Change the height: `RECTANGLE_NAME.rectangleHeight = 45;`
  - Change the color: `RECTANGLE_NAME.color = "purple";`
  

## Line

In addition to the default parameters (`angle`, `rotationStyle`, and `showing`), you may use these parameters to create a new line between (`x`,`y`) and (`x1`, `y1`): 

```javascript
var LINE_NAME = addLine({x: -100, y: 100, x1: 10, y1: 20, color: "pink", lineWidth: 10});
```
  - Change the x startpoint: `LINE_NAME.x = -100;`
  - Change the y startpoint: `LINE_NAME.y = 100;`
  - Change the x endpoint: `LINE_NAME.x1 = 10;`
  - Change the y endpoint: `LINE_NAME.y1 = 20;`
  - Change the width: `LINE_NAME.lineWidth = 5;`
  - Change the color: `LINE_NAME.color = "purple";`

### Text

In addition to the default parameters (`x`, `y`, `angle`, `rotationStyle`, and `showing`), you may use these parameters to create new text: 

```javascript 
var TEXT_NAME = addText({text: "Text", dynamicText: "'Score: ' + score", size: 12, color: "black", fontFamily: "arial", textAlign: "center"});
```
  - Set the text value to an unchanging value: `TEXT_NAME.text = "Sample Text";`
  - Set the text value to an changing string expression: `TEXT_NAME.dynamicText = "'Variable Name: ' + variableName";`
  - Set the font size: `TEXT_NAME.size = 20;`
  - Set the font color: `TEXT_NAME.color = "white";`
  - Set the font color to a hex value: `TEXT_NAME.color = "#32CD32";`
  - Set the font family: `TEXT_NAME.fontFamily = "arial";`
  

### Clones

If you want to make many objects that look and act very similar to each other, it's pretty straight-forward:

```javascript
every(4, "second", () => {
  var CLONE_NAME = addCircle ({radius: 10, color: "pink", x: randomX(), y: randomY()});
  forever(() => { 
    CLONE_NAME.x++; 
    if (CLONE_NAME.x > maxX) {
      CLONE_NAME.delete();
    }
  });
});
```

### Control Flow

There are two types of commands in JavaScript:

1) **Synchronous**: "Do this immediately and move on when it's done."

*Synchronous example in real life*: Open heart surgery. When a doctor begins open heart surery on a patient, she stays in the operating room with the patient until the surgery is done and the patient is stitched back up. She doesn't start open surgery with one patient and then move on to another room where she begins operating on a second patient before the first operation is done. She starts and finishing one operation before starting a second.

2) **Asynchronous**: "Start this immediately, but don't wait till it's done. Move on to the next command immediately after you start this command (which might be before this command is done)."

*Asynchronous example in real life*: Ordering food or drinks. First, let's imagine what a synchronous resturant would look like. A waiter would come to your table, take 1 person's order, rush it back to the kitchen, wait for the kitchen to finish with that person's order, and then bring it back to that person. Finally once this first order is taken care of, the waiter would ask the 2nd person at the table for their order. Of course this would be ridiculous. It makes much more sense for a resturant to process its customers' orders asynchronously. That is, after a waiter takes one person's order, he is free to take another person's order before finishing the first order. This allows the resturant to do multiple things at once, which is ultimately faster for some types of tasks.

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

  - Repeat constantly until (you have to put the condition in "quotes"): 

```javascript
repeatUntil("IMAGE_NAME.y < minY", () => {
  IMAGE_NAME.y -= SPEED;
});
```

  - Do seomthing after a `repeatUntil`:

```javascript
repeatUntil("IMAGE_NAME.y < minY", () => {
  IMAGE_NAME.y -= SPEED;
}, () => {
  stopAll();  
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
var timer = 20;
var timerText = addText({x: 0, y: maxY - 20, size: 20, color: "white"});
every("1", "second", () => {
  if (timer === 0){ stopAll(); }
  timer--;
  timerText.text = "Timer: " + timer;
});
```

  - Do this when a condition (in "quotes") is true. This is a short-hand for a forever-if statement.

```javascript
when('keysDown.includes("LEFT")', () => {
    rectangle.x -= 5; 
});
```
  
  - Do this after one second: 

```javascript
after(1, "second", () => {...});
```

## Helper Functions

1) Get a random integer between any two numbers

```javascript
var number = randomInt(10, 20);
```
2) Repeat something 10 times

```javascript
repeat(10, (time) => {
  console.log(`I'm going to repeat this ${10-time} more times!`)
});
```
3) Get a random integer between any two numbers: `randomInt(10, 20);`

4) Get the current hour: `hour();`

5) Get the current hour in military time: `hourMilitary();`

6) Get the current minute: `minute();`

7) Get the current second: `second();`

8) Get the current day of the month (1-31): `dayOfMonth();`

9) Get the current day of the week (Monday-Sunday): `dayOfWeek();`

10) Random color: `randomColor()`


## Cloud Data via Firebase

Cloud data can be used to create high scores, logins, and multiplayer games.

1) Login to [Firebase](https://firebase.google.com/) with your Google account.

2) Create a new 

3) Make reading and writing to your database possible via the Database rules tab.

4) Whitelist your project's domain via the Auth sign-in tab.

5) Copy the Firebase config into your `Project`:

```javascript
firebaseConfig({
    apiKey: "AIzaSyAWa4XzsdE5haWBWq4fTef2Ko1dpbsE4qM",
    authDomain: "sample-a81f9.firebaseapp.com",
    databaseURL: "https://sample-a81f9.firebaseio.com",
    storageBucket: "",
});
```

6) Set some data:

```javascript
setCloud("high_score", 100);
setCloud("player1", {x: mouseX, y: mouseY});
```

7) Get some data:

```javascript
getCloud("high_score", 0) // returns 100, with a default of 0
setCloud("player1", {x: 0, y: 0}) // returns  {x: 14, y: 104}, with a default of {x: 0, y: 0}
```

## [Learnable Programming](http://worrydream.com/LearnableProgramming/)

Despite its many [noted](http://worrydream.com/LearnableProgramming/) flaws, Processing still remains the dominent graphics programming framework for beginners. Woof strives to solve the same problems as Processing, and be a beginner-friendly graphics frameworks for art, animation and game development, but it also hopes to improve upon Processing's main flaws:

  - **opaque parameters setting** - In Woof, all object properties can be set explicitly with dot notation or as named-parameters in the constructor.
  - **side effects in render** - In Woof, you can cause state to change in response to events or intervals. You don't have to hook your effectful code into your render method to make things move.
  - **render** - In Woof, (like ReactJS) we take care of rendering your objects onto the canvas for you. This means you don't even have to think about how your view layer works. It just does.
  - **hidden state** - In Woof, there's no hidden view-layer state. If you make one circle red, only that circle is red.
  - **non-modular** - In Woof, because all view-layer state is encapulated into objects, it allows you to easily build modular and functional code without worrying about side effects.
  - **poor decomposition** - In Woof, you can have infinitely many objects listen to infinitely many events. You don't have to funnel all of your code through the same top-level events that forces you to build tangled code.
  - **lack of identity / metaphor** - Woof steals Scratch's and Smalltalk's everything-is-an-object-that-you-can-see-on-the-screen metaphor. It also takes the pen, angles, turning and moving athropomorphic metaphors from LOGO.

## Showing off

  - Making a page of draggable elements takes Pixi.js [80 lines](http://www.goodboydigital.com/pixijs/examples/8/), while using WoofJS it only takes [20 lines](https://jsbin.com/fuheki/edit?js,output).
  - Making a bunch of crazy bouncing images takes Pixi.js [254 lines](http://www.goodboydigital.com/pixijs/bunnymark/), but only takes WoofJS [32 lines](http://output.jsbin.com/nuhoben).
  - Making pong using JQuery and Underscore.js takes [146 lines](https://jenniferdewalt.com/pong.html), while it takes WoofJS [under 60 lines](http://output.jsbin.com/keborur) (and our version has more elements PLUS it works on mobile!).
  - Making this analog clock takes [125 lines](https://jenniferdewalt.com/analog_clock.html) of JavaScript, but only [40 lines](http://output.jsbin.com/yaciqe) using WoofJS.
  - Recreating the insanely viral game [Flappy Birds](http://output.jsbin.com/rarexo) takes under 70 lines using WoofJS.
