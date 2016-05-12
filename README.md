# Woof
*The canvas' best friend*

Woof is a small JavaScript library inspired by Scratch for making interactive canvas games.

## Getting Started

1) Include the Woof library in your code between the `<head>` tags.
```html
<script src="https://cdn.rawgit.com/stevekrouse/WoofJS/fa46b7dac357ad5402c0e2ce6296b06c84c0e7f8/woof.js"></script>
```

2) Add a canvas tag between the `<body>` tags. Give it an ID, width and height.
```html
<canvas id="project" width="400" height="400"></canvas>
```
3) Set up your Woof project by referencing the ID of your canvas.
```javascript
var project = new Woof.Project("project"); 
```
4) Add a backdrop URL (preferably of similar dimensions to your canvas).
```javascript
project.addBackdropURL("http://cdn.mysitemyway.com/etc-mysitemyway/webtreats/assets/posts/857/thumbs/tileable-classic-nebula-space-patterns-6.jpg");
```
5) Add a sprite.
```javascript
var rectangle = project.addSprite();
rectangle.addCostumeURL("http://www.urdu-english.com/images/lessons/beginner/shapes/shapes-pics/rectangle.png");
```
6) Make it move with the arrow keys.
```javascript
project.every(40, "milliseconds", () => {
  if (project.keysDown.includes("LEFT")){
    rectangle.xPosition -= 5; 
  }
  if (project.keysDown.includes("RIGHT")){
    rectangle.xPosition +=5; 
  }
  if (project.keysDown.includes("UP")){
    rectangle.yPosition -= 5; 
  }
  if (project.keysDown.includes("DOWN")){
    rectangle.yPosition += 5; 
  }
});
```
7) Add a timer.
```javascript
var timer = 20;
var timerSprite = project.addTextSprite();
timerSprite.xPosition = 300;
timerSprite.yPosition = 30;
timerSprite.fontSize = 20;
timerSprite.fontColor = "white";
project.every("1", "second", () => {
  timerSprite.text = "Timer: " + timer;
  if (timer === 0){
    project.stopAll();
  }
  timer--;
});
```

## Project API

  - Create a project: `var project = new Woof.Project('canvasID');`
  - Add a backdrop: `project.addBackDropURL("http://example.com/img.jpg");`
  - Change the backdrop: `project.backdrop = 0;`
  - Create a sprite: `var sprite = project.addSprite();`
  - Stop all: `project.stopAll();`
  - Mouse X: `project.mouseX`
  - Mouse Y: `project.mouseY`
  - Mouse down?: `project.mouseDown`
  - List of keys currently pressed: `project.keysDown`
  - Is 'A' pressed?: `project.keysDown.includes('A')`
  - Do this every second: `project.every(1, "second", () => {...});`
  - Do this after one second: `project.after(1, "second", () => {...});`

## Sprite API
  
  - Create new sprite: `var sprite = project.addSprite();`
  - Add a costume: `rectangle.addCostumeURL("http://www.urdu-english.com/images/lessons/beginner/shapes/shapes-pics/rectangle.png");`
`
  - Change the costume: `project.costume = 0;`
  - Set the X position: `sprite.xPosition = 200;`
  - Change the Y position: `sprite.yPosition += 10;`
  - Set the angle: `sprite.angle = 30;`
  - Don't rotate the sprites costume when the angle changes: `sprite.setRotationStyle("NO ROTATE");`
  - Hide the sprite: `sprite.showing = false;`
  - Move the sprite in the direction of the angle: `sprite.move(10);`
  - Touching another sprite?: `if (sprite.touching(sprite2)) { ... }`
  - Mouse over this sprite?: `if (sprite.mouseOver()) { ... }`
  - Clicking on this sprite?: `if (project.mouseDown && sprite.mouseOver()) { ... }`
  - Send this sprite to the back layer: `sprite.sendToBack();`
  - Send this sprite to the front layer: `sprite.sendToFront();`
  - Point the sprite towards another sprite: `sprite.pointTowards(sprite2)`
  - Point the sprite towards an X,Y position: `sprite.pointTowards(project.mouseX, project.mouseY)`
  - Delete this sprite: `sprite.delete();`

## Text API

The `Woof.TextSprite` inherits `Woof.Sprite`, so many of its methods work the same. For example, `xPosition`, `yPosition`, `showing`, and `delete` all work on `TextSprite`. 

These are the `TextSprite`-specific methods:

  - Create new text sprite: `textSprite = project.addTextSprite();`
  - Set the text value: `textSprite.text = "Sample Text";`
  - Set the font size: `textSprite.fontSize = 20;`
  - Set the font color: `textSprite.fontColor = "white";`
  - Set the font color to a hex value: `textSprite.fontColor = "#32CD32";`
  - Set the font family: `textSprite.fontFamily = "arial";`
  - Set the text-align: `textSprite.textAlign: "center";`

## Helper Functions

1) Get a random integer between any two numbers
```javascript
var number = Woof.randomInt(10, 20);
```
