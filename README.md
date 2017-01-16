# WoofJS

WoofJS is a *learnable* JavaScript framework for creating games by [The Coding Space](http://thecodingspace.com).

WoofJS was created to be the next step after block-based coding in Scratch. For more details, you can [read our announcement post](https://medium.com/@stevekrouse/woof-d9adf2110fc6).


## Getting Started

We reccomend that you get started with WoofJS on [woofjs.com](http://woofjs.com), because you...

  * can get started with zero set-up
  * use our [interactive and searchable documentation](http://woofjs.com/docs)
  * get access to [our WoofJS curriculum](http://coding.space/woof)
  * create an account to save your work
  * use our text-editor fine-tunned for use with WoofJS, including code-hints and type-a-head
  * iterate quickly with live updates to your output as you type


## Using WoofJS outside of woofjs.com

### Installing WoofJS

Include the following script tag into your code to get the latest version of WoofJS:

```html
<script src="TODO"></script>
```

The latest stable version of WoofJS is:

```html
<script src="https://github.com/stevekrouse/WoofJS/blob/03ca9710d0d0432720b354fe3379bd043185fc4f/woof.js"></script>
```

### Global mode

When you include the Woof script in your code, it defaults to creating a full-screen project and polluting your global namespace with Woof's methods. 

We find not having to type "Woof." over and over again makes a huge difference for beginner programmers, especially those new to typing.

However, if you'd like to turn off this mode, simply add `global="false"` in your script tag and create your project manually:

```javascript
var project = new Woof({global: false, width: 300, height: 400})

var IMAGE_NAME = new Woof.Image({project: project, url: "https://i.imgur.com/SMJjVCL.png?1"})
```

## Reporting a bug

Simply create an issue with a link to the simpliest code you can create that would reproduce the bug, preferably on woofjs.com.


## Contributing

WoofJS is used by hundreds of students all over the world to build games and animations. 

We'd love your help in making it even more learnable and dependable for them.

### The WoofJS directory structure

#### woofjs.com

woofjs.com is hosted on Github pages from this repository. This means that all of the top-level URLs on woofjs.com must be in the top-level of the directory. This includes:

  * index.html
  * create.html
  * full.html
  * teach.html
  * user.html
  * login.html
  * favicon.png
  * etc

The documentation that you find woofjs.com/create is contained within the docs/ folder.

#### woof.js core library

If you'd like to contribute to the core WoofJS library, you will edit the code in src/woofjs.es6.js.

You will then use babel to compile src/woof.es6.js to dist/woof.js with the included .babelrc and the following command:

    babel WoofJS/src/woof.es6.js --watch --out-file WoofJS/dist/woof.js
    
### Getting started

1. Clone WoofJS to your development environment of choice.
2. Take a look at our issues and see if there are any issues that speak to you as good places to tackle first. Pay particular attention to issues labeled "good student projects."
3. Fork the repo, make your changes, and submit a pull request

If you have any questions, please email steve at thecodingspace.com :)


## Liscense

MIT Liscense, so do with our code as you will. If you want help using the code or integrating with WoofJS, we're happy to help :)