# Woof
*The canvas' best friend*

Woof is a small JavaScript library inspired by Scratch for making interactive canvas games.

## Getting Started

1) Include the Woof library in your code between the `<head>` tags.
```html
<script src="https://cdn.rawgit.com/stevekrouse/Woof/master/woof.js"></script>
```

2) Add a canvas tag between the `<body>` tags. Give it an ID, width and height.
```html
<canvas id="project" width="400" height="400"></canvas>
```
3) Set up your Woof project by referencing the ID of your canvas.
```javascript
var project = new Proejct("project");
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
rectangle.every(40, "miliseconds", () => {
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
var timerSprite = project.addSprite();
timerSprite.setText("Timer: " + timer, 300, 30, 20, "white");
scoreSprite.every("1", "second", () => {
  timerSprite.setText("Timer: " + timer, 300, 30, 20, "white");
  if (timer === 0){
    project.stopAll();
  }
  timer--;
});
```

## Project API

  - Create a project: `var project = new Project('canvasID');`
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
  - Add a costume: `project.addCostumeURL("http://example.com/img.jpg");`
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
  - Do this every second: `sprite.every(1, "second", () => {...});`
  - Do this after one second: `sprite.after(1, "second", () => {...});`

## Text API

1) Create a sprite.
```javascript
var timerSprite = project.addSprite();
```
2) Use `sprite.setText(text, x, y, size, font)` every time you want to change the text.
```javascript
var timer = 20;
scoreSprite.every("1", "second", () => {
  timerSprite.setText("Timer: " + timer, 300, 30, 20, "white");
  if (timer === 0){
    project.stopAll();
  }
  timer--;
});
```
