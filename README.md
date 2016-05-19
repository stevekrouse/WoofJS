# WoofJS - *JavaScript Unleashed*

WoofJS is a JavaScript library for making interactive web and mobile games.

It was originally inspired by Scratch and can help ease the trasition to JavaScript.

WoofJS is developed with :heart: by [The Coding Space](http://thecodingspace.com).

*Notice: this is new software and is under rapid development, so expect things to break and be frequently changed. We expect our first stable release will come out by June 2016.*

## Getting Started

You can either [clone this JSBin](https://jsbin.com/lucuko/edit?html,js,output) or follow the steps below to setup your first WoofJS project.

1) Throw the Woof library between the `<head>` tags.
```html
<script src="https://cdn.rawgit.com/stevekrouse/WoofJS/7e4589e45edbd10cd79223550473a92e02dc61c1/woof.js"></script>
```
2) Throw a `<canvas>` tag between the `<body>` tags.
```html
<canvas id="project" width="350" height="500"></canvas>
```
3) Throw in some JavaScript, and tell Woof to fetch it.
```javascript
// Set up your Woof project by referencing the ID of your canvas, optionally setting debug, so you can see mouseX, mouseY and keysDown.
var project = new Woof.Project("project", {debug: ["project.keysDown", "project.mouseX", "project.mouseY", "timer"]}); 
// Set the backdrop URL (preferably of similar dimensions to your canvas).
project.setBackdropURL("http://cdn.theatlantic.com/assets/media/img/mt/2016/03/RTX283V4/lead_960.jpg?1457553386");

// Add an image via a url, and optionally setting its x and y.
var rectangle = project.addImage({url: "http://www.urdu-english.com/images/lessons/beginner/shapes/shapes-pics/rectangle.png", x: 0, y: 0});

// Make it move with the arrow keys by checking which keys are down every 40 milliseconds
project.every(40, "milliseconds", () => {
  // if the left key is down...
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
  // change the text to refer to the timer's new value every second
  timerText.text = "Timer: " + timer;
  if (timer === 0){
    // stop everything when the timer reaches 0
    project.stopAll();
  }
  // make the timer go down every second
  timer--;
});
```

## Woof.Project

Create a project: 

```javascript
var project = new Woof.Project('canvasID', {debug: ["project.keysDown", "project.mouseX", "project.mouseY"]});
```

  - Set/change the backdrop: `project.setBackdropURL("http://example.com/img.jpg");`
  - Stop all: `project.stopAll();`
  - Mouse X: `project.mouseX`
  - Mouse Y: `project.mouseY`
  - Mouse down?: `project.mouseDown`
  - Do something on click: `project.onClick((mouseX, mouseY) => { ... });`
  - List of keys currently pressed: `project.keysDown`
  - Is 'A' pressed?: `project.keysDown.includes('A')`
  - Do this every second: `project.every(1, "second", () => {...});`
  - Do this after one second: `project.after(1, "second", () => {...});`
  - Right edge of the screen: `project.maxX`
  - Left edge of the screen: `project.minX`
  - Top edge of the screen: `project.maxY`
  - Bottom edge of the screen: `project.minY`
  - Width of the screen: `project.width`
  - Height of the screen: `project.height`

## Woof.Image, Woof.Text, and Woof.Circle General Functions

In Woof you can create `Woof.Image`, `Woof.Text`, and `Woof.Circle`.  The General Functions work on all of them. 

When creating a new `Woof.Image`, `Woof.Text`, or `Woof.Circle`, you may use the following parameters:

```javascript
  var image = project.addImageSprite({x: 0, y: 0, angle: 0, rotationStyle: "ROTATE", showing: true});
  var text = project.addTextSprite({x: 0, y: 0, angle: 0, rotationStyle: "ROTATE", showing: true});
  var circle = project.addCircleSprite({x: 0, y: 0, angle: 0, rotationStyle: "ROTATE", showing: true});
```

  - Set the X position: `NAME.x = 200;`
  - Change the Y position: `NAME.y += 10;`
  - Set the angle: `NAME.angle = 30;`
  - Set the angle using direction: `NAME.angle = Woof.LEFT;` 
  - Don't rotate the sprites costume when the angle changes: `NAME.setRotationStyle("NO ROTATE");`
  - Rotate left to right when it points in a direction and moves `NAME.setRotationStyle("ROTATE LEFT RIGHT");`
  - Hide: `NAME.showing = false;`
  - Move in the direction of the angle: `NAME.move(10);`
  - Touching another thing?: `if (NAME.touching(OTHER_NAME)) { ... }`
  - Mouse over?: `if (NAME.mouseOver()) { ... }`
  - Do something on click: `NAME.onClick((mouseX, mouseY) => { ... });`
  - Clicking and holding?: `if (project.mouseDown && NAME.mouseOver()) { ... }`
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
Create a new image: 
```javascript 
var IMAGE_NAME = project.addImage({url: "http://www.loveyourdog.com/image3.gif", imageWidth: 30, imageHeight: 30});
```
  - Add another image: `IMAGE_NAME.addImageURL("http://www.urdu-english.com/images/lessons/beginner/shapes/shapes-pics/rectangle.png");`
  - Change the image: `IMAGE_NAME.image = 0;`
  - Set the width: `IMAGE_NAME.imageWidth = 10;`
  - Set the height `IMAGE_NAME.imageHeight = 20;`

### Woof.Circle
Create a new circle: 
```javascript
var CIRCLE_NAME = project.addCircle({radius: 10, color: "black"});
```
  - Change the radius: `CIRCLE_NAME.radius = 15;`
  - Change the color: `CIRCLE_NAME.color = "blue";`

### Woof.Text

Create a new text: 
```javascript 
var TEXT_NAME = project.addText({text: "Text", size: 12, color: "black", fontFamily: "arial", textAlign: "center"});
```
  - Set the text value: `TEXT_NAME.text = "Sample Text";`
  - Set the font size: `TEXT_NAME.size = 20;`
  - Set the font color: `TEXT_NAME.color = "white";`
  - Set the font color to a hex value: `TEXT_NAME.color = "#32CD32";`
  - Set the font family: `TEXT_NAME.fontFamily = "arial";`
  - Set the text-align: `TEXT_NAME.textAlign: "center";`

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

## [Learnable Programming](http://worrydream.com/LearnableProgramming/)

Despite its many [noted](http://worrydream.com/LearnableProgramming/) flaws, Processing still remains the dominent graphics programming framework for beginners. Woof strives to solve the same problems as Processing, and be a beginner-friendly graphics frameworks for art, animation and game development, but it also hopes to improve upon Processing's main flaws:

  - **opaque parameters setting** - In Woof, all object properties can be set explicitly with dot notation or as named-parameters in the constructor.
  - **side effects in render** - In Woof, you can cause state to change in response to events or intervals. You don't have to hook your effectful code into your render method to make things move.
  - **render** - In Woof, (like ReactJS) we take care of rendering your objects onto the canvas for you. This means you don't even have to think about how your view layer works. It just does.
  - **hidden state** - In Woof, there's no hidden view-layer state. If you make one circle red, only that circle is red.
  - **non-modular** - In Woof, because all view-layer state is encapulated into objects, it allows you to easily build modular and functional code without worrying about side effects.
  - **poor decomposition** - In Woof, you can have infinitely many objects listen to infinitely many events. You don't have to funnel all of your code through the same top-level events that forces you to build tangled code.
  - **lack of identity / metaphor** - Woof steals Scratch's and Smalltalk's everything-is-an-object-that-you-can-see-on-the-screen metaphor. It also takes the pen, angles, turning and moving athropomorphic metaphors from LOGO.
