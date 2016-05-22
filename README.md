# WoofJS - *JavaScript Unleashed*

WoofJS is a JavaScript library for making web and mobile games and animations.

It was originally inspired by Scratch and can help ease the trasition to JavaScript.

WoofJS is developed with :heart: by [The Coding Space](http://thecodingspace.com).

<b>Notice</b>: *This is new software and is under rapid development, so expect things to break and be frequently changed. We expect our first stable release will come out by the end of Summer 2016. Until our first stable release, this software <b>only runs on desktop Chrome</b>, at which point we will support all modern desktop and mobile browsers.*

## Getting Started

You can either <a href="https://jsbin.com/lekovu/edit?js,output" target="_blank">clone this JSBin</a> or follow the steps below to setup your first WoofJS project.

1) Throw the Woof library between the `<head>` tags.
```html
<script src="https://cdn.rawgit.com/stevekrouse/WoofJS/6ebb55005e12a248de96a929cc1abdd94ff250f3/woof.js"></script>
```
2) Throw in some JavaScript, and tell Woof to fetch it.
```javascript
var project = new Woof.Project({fullScreen: true, debug: ["project.keysDown", "project.mouseX", "project.mouseY", "timer"]}); 
// Set the backdrop URL (preferably of similar dimensions to your canvas)
project.setBackdropURL("http://efdreams.com/data_images/dreams/sky/sky-05.jpg");

// Add an image via a url, and optionally setting its x and y
var rectangle = project.addImage({url: "http://www.urdu-english.com/images/lessons/beginner/shapes/shapes-pics/rectangle.png", x: 0, y: 0});

// Make it move with the arrow keys by checking which keys are down every 40 milliseconds
project.forever(() => {
  if (project.keysDown.includes("LEFT")){
    // move left by 5
    rectangle.x -= 5; 
  }
  if (project.keysDown.includes("RIGHT")){
    rectangle.x +=5; 
  }
  if (project.keysDown.includes("UP")){
    rectangle.y += 5; 
  }
  if (project.keysDown.includes("DOWN")){
    rectangle.y -= 5; 
  }
});

// make the timer start at 20
var timer = 20;
// add text that diplays the timer
var timerText = project.addText({x: 0, y: project.maxY - 20, size: 20, color: "white"});
project.every("1", "second", () => {
  // stop everything when the timer reaches 0
  if (timer === 0){ project.stopAll(); }
  // make the timer go down every second
  timer--;
  // change the text to refer to the timer's new value every second
  timerText.text = "Timer: " + timer;
});
```

## Woof.Project

Create a project: 

```javascript
var project = new Woof.Project({fullScreen: true, debug: ["project.keysDown", "project.mouseX", "project.mouseY"]});
```
  - Create a project with a height and width: ``var project = new Woof.Project({height: 500, width: 350});`
  - Create a project with a pre-existing `<canvas id="project">` element by id: ``var project = new Woof.Project({id: "project"});`
  - Set/change the backdrop to an image URL: `project.setBackdropURL("http://example.com/img.jpg");`
  - Set/change the backdrop to an color: `project.setBackdropColor("blue");`
  - Stop all: `project.stopAll();`
  - Mouse X: `project.mouseX`
  - Mouse Y: `project.mouseY`
  - Mouse down?: `project.mouseDown`
  - Do something on click: `project.onClick((mouseX, mouseY) => { ... });`
  - List of keys currently pressed: `project.keysDown`
  - Is 'A' pressed?: `project.keysDown.includes('A')`
  - Right edge of the screen: `project.maxX`
  - Left edge of the screen: `project.minX`
  - Top edge of the screen: `project.maxY`
  - Bottom edge of the screen: `project.minY`
  - Random X value on the screen: `project.randomX()`
  - Rnadom Y value on the screen: `project.randomY()`
  - Width of the screen: `project.width`
  - Height of the screen: `project.height`
  

### Project Control Flow

There are two types of commands in JavaScript:

1) **Synchronous**: "Do this immediately and then move on when it's done."

2) **Asynchronous**: "Start this immediately, but don't wait till it's done. Just go ahead and move on to the next command immediately after you start this command."

Most commands are synchronous. For example, if-statements, setting or changing variables, and calling most Woof methods like rectangle.move(10) are all synchronous commands.

`Woof.forever` is an example of an asynchronous command. Think about it: if Woof.forever told the computer to wait until it was done before moving on, it would never move on to the next line.

`Woof.repeat`, `Woof.repeatUntil`, `Woof.every`, `Woof.after` are also asynchronous. 

This second type allows us to do useful things - like do this 10 times - but it's also confusing because if you want to have something happen after the 10th time, you can't just put it on the line below the `Woof.repeat`. Why? Because the line below `Woof.repeat` happens immediately after the asynchronously command *starts*, not after it ends. 

So what you have to do give your "after" code to the async function as it's 3rd parameter and it'll make sure to run it after the async function is really finished. This works for `Woof.repeat` and `Woof.repeatUntil`.

Also, be sure not to nest async commands within each other. For example if you want to make an image move in a square for forever, you can't just put four nested repeats inside a forever. Instead you have to use recursion and tell your repeat code to start over only after the 4th repeat is finished finished. (If you put a repeat in a forever, it'll  keep starting new repeats for forever really quickly.)


  - Repeat 10 times: 

```javascript
project.repeat(10, () => { 
  NAME.x++;
});
```

  - Do something after done repeating:

```javascript
project.repeat(10, () => { 
  NAME.x++;
}, () => {
  NAME.color = "blue";
});
```

  - Chaining repeats:

```javascript
project.repeat(100, () => {
  NAME.angle = Woof.RIGHT;
  NAME.move(1);
}, () => { 
  project.repeat(100, () => {
    NAME.angle = Woof.UP;
    NAME.move(1);
  }, () => { 
    project.repeat(100, () => {
      NAME.angle = Woof.LEFT;
      NAME.move(1);
    }, () => { 
      project.repeat(100, () => {
        NAME.angle = Woof.DOWN;
        NAME.move(1);
      });
    });
  });
});
```

  - Repeat constantly until (you have to put the condition in "quotes"): 

```javascript
project.repeatUntil("IMAGE_NAME.y < project.minY", () => {
  IMAGE_NAME.y -= SPEED;
});
```

  - Do seomthing after a `repeatUntil`:

```javascript
project.repeatUntil("IMAGE_NAME.y < project.minY", () => {
  IMAGE_NAME.y -= SPEED;
}, () => {
  project.stopAll();  
});
```  

  - Do this constantly forever: 

```javascript
project.forever(() => { 
  CIRCLE_NAME.radius = CIRCLE_NAME.distanceTo(project.mouseX, project.mouseY);
});
```
  
  - Do this every second: 

```javascript
var timer = 20;
var timerText = project.addText({x: 0, y: project.maxY - 20, size: 20, color: "white"});
project.every("1", "second", () => {
  if (timer === 0){ project.stopAll(); }
  timer--;
  timerText.text = "Timer: " + timer;
});
```

  - Do this when a condition (in "quotes") is true. This is a short-hand for a forever-if statement.

```javascript
project.when('project.keysDown.includes("LEFT")', () => {
    rectangle.x -= 5; 
});
```
  
  - Do this after one second: `project.after(1, "second", () => {...});`


## Woof.Image, Woof.Text, Woof.Rectangle and Woof.Circle General Functions

In Woof you can create `Woof.Image`, `Woof.Text`, `Woof.Rectangle` and `Woof.Circle`.  The General Functions work on all of them. 

When creating a new `Woof.Image`, `Woof.Text`, `Woof.Rectangle` or `Woof.Circle`, you may use the following parameters:

```javascript
  var IMAGE_NAME = project.addImage({x: 0, y: 0, angle: 0, rotationStyle: "ROTATE", showing: true});
  var TEXT_NAME = project.addText({x: 0, y: 0, angle: 0, rotationStyle: "ROTATE", showing: true});
  var CIRCLE_NAME = project.addCircle({x: 0, y: 0, angle: 0, rotationStyle: "ROTATE", showing: true});
  var RECTANGLE_NAME = project.addRectangle({x: 0, y: 0, angle: 0, rotationStyle: "ROTATE", showing: true});
```

  - Set the X position: `NAME.x = 200;`
  - Change the Y position: `NAME.y += 10;`
  - Set the angle: `NAME.angle = 30;`
  - Set the angle using direction: `NAME.angle = Woof.LEFT;` 
  - Turn left: `NAME.turnLeft(10);`
  - Turn right: `NAME.turnRight(10);`
  - Don't rotate the sprites costume when the angle changes: `NAME.setRotationStyle("NO ROTATE");`
  - Rotate left to right when it points in a direction and moves `NAME.setRotationStyle("ROTATE LEFT RIGHT");`
  - Hide: `NAME.showing = false;`
  - Move in the direction of the angle: `NAME.move(10);`
  - Touching another thing?: `if (NAME.touching(OTHER_NAME)) { ... }`
  - Mouse over?: `if (NAME.mouseOver()) { ... }`
  - Do something on click: `NAME.onClick((mouseX, mouseY) => { ... });`
  - Clicking and holding?: `if (NAME.mouseDown()) { ... }`
  - Send to the back layer: `NAME.sendToBack();`
  - Send to the front layer: `NAME.sendToFront();`
  - Point towards another thing: `NAME.pointTowards(OTHER_NAME)`
  - Point towards an X,Y : `NAME.pointTowards(project.mouseX, project.mouseY)`
  - Delete: `NAME.delete();`
  - Get the distance between two things: `NAME.distanceTo(OTHER_NAME);`
  - Get the distance to an X,Y: `NAME.distanceTo(X, Y);`
  - Get the width: `NAME.width()`
  - Get the height: `NAME.height()`

### Woof.Image
In addition to the default parameters (`x`, `y`, `angle`, `rotationStyle`, and `showing`), you may use these parameters to create a new image: 
```javascript 
var IMAGE_NAME = project.addImage({url: "http://www.loveyourdog.com/image3.gif", imageWidth: 30, imageHeight: 30});
```
  - Add another image: `IMAGE_NAME.addImageURL("http://www.urdu-english.com/images/lessons/beginner/shapes/shapes-pics/rectangle.png");`
  - Change the image: `IMAGE_NAME.image = 0;`
  - Set the width: `IMAGE_NAME.imageWidth = 10;`
  - Set the height `IMAGE_NAME.imageHeight = 20;`

### Woof.Circle
In addition to the default parameters (`x`, `y`, `angle`, `rotationStyle`, and `showing`), you may use these parameters to create a new circle: 
```javascript
var CIRCLE_NAME = project.addCircle({radius: 10, color: "black"});
```
  - Change the radius: `CIRCLE_NAME.radius = 15;`
  - Change the color: `CIRCLE_NAME.color = "blue";`

## Woof.Rectangle

In addition to the default parameters (`x`, `y`, `angle`, `rotationStyle`, and `showing`), you may use these parameters to create a new rectangle: 
```javascript
var RECTANGLE_NAME = project.addRectangle({rectangleHeight: 10, rectangleWidth: 20, color: "pink"});
```
  - Change the width: `RECTANGLE_NAME.rectangleWidth = 20;`
  - Change the height: `RECTANGLE_NAME.rectangleHeight = 45;`
  - Change the color: `RECTANGLE_NAME.color = "purple";`

### Woof.Text

In addition to the default parameters (`x`, `y`, `angle`, `rotationStyle`, and `showing`), you may use these parameters to create a new text: 
```javascript 
var TEXT_NAME = project.addText({text: "Text", size: 12, color: "black", fontFamily: "arial", textAlign: "center"});
```
  - Set the text value: `TEXT_NAME.text = "Sample Text";`
  - Set the font size: `TEXT_NAME.size = 20;`
  - Set the font color: `TEXT_NAME.color = "white";`
  - Set the font color to a hex value: `TEXT_NAME.color = "#32CD32";`
  - Set the font family: `TEXT_NAME.fontFamily = "arial";`

## Helper Functions

1) Get a random integer between any two numbers
```javascript
var number = Woof.randomInt(10, 20);
```
2) Repeat something 10 times
```javascript
Woof.repeat(10, (time) => {
  console.log(`I'm going to repeat this ${10-time} more times!`)
});
```
3) Get a random integer between any two numbers: `Woof.randomInt(10, 20);`

4) Get the current hour: `Woof.hour();`

5) Get the current hour in military time: `Woof.hourMilitary();`

6) Get the current minute: `Woof.minute();`

7) Get the current second: `Woof.second();`

8) Get the current day of the month (1-31): `Woof.dayOfMonth();`

9) Get the current day of the week (Monday-Sunday): `Woof.dayOfWeek();`

10) Random color: `Woof.randomColor()`

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

  - What takes Pixi.js [80 lines](http://www.goodboydigital.com/pixijs/examples/8/), takes WoofJS [20](https://jsbin.com/fuheki/edit?js,output).
