# WoofJS

WoofJS is a *learnable* JavaScript framework for creating games by [The Coding Space](http://thecodingspace.com).

WoofJS was created to be the next step after block-based coding in Scratch. For more details, you can [read our announcement post](https://medium.com/@stevekrouse/woof-d9adf2110fc6).

## Getting Started with WoofJS.com

![screenshot 2017-03-03 at 10 04 05 am](https://cloud.githubusercontent.com/assets/2288939/23556045/1693c70c-fff9-11e6-950b-5e95c7a0112a.png)

We recommend that you get started with WoofJS on [woofjs.com](http://woofjs.com), because you...

  * can get started with zero set-up
  * use our [interactive and searchable documentation](http://woofjs.com/docs)
  * get access to [our WoofJS curriculum](http://coding.space/woof)
  * create an account to save your work
  * use our text-editor fine-tunned for use with WoofJS, including code-hints and type-a-head
  * iterate quickly with live updates to your output as you type


## Using WoofJS outside of woofjs.com

### Installing WoofJS

#### For development (which always grabs the latest version): 

```html
<script src="https://rawgit.com/stevekrouse/WoofJS/master/dist/woof.js"></script>
```

#### For production (which is tied to a specific commit hash):

Go to rawgit.com and type this in:

    https://github.com/stevekrouse/WoofJS/blob/master/dist/woof.js
    
And grab the link on the left, which should look like:

```html
<script src="https://cdn.rawgit.com/stevekrouse/WoofJS/a3752aea/dist/woof.js"></script>
```

### Global mode

When you include the Woof script in your code, it defaults to creating a full-screen project and polluting your global namespace with Woof's methods. 

We find not having to type "Woof." over and over again makes a huge difference for beginner programmers, especially those new to typing.

However, if you'd like to turn off this mode, simply add `global="false"` in your script tag and create your project manually:

```javascript
var project = new Woof({global: false, width: 300, height: 400})

var IMAGE_NAME = new Woof.Image({project: project, url: "./images/SMJjVCL.png"})
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

The documentation that you find on woofjs.com/create is contained within the docs/ folder.

#### woof.js core library

If you'd like to contribute to the core WoofJS library, you will edit the code in src/woofjs.es6.js , but these edits need to be compiled to dist/woof.js using babel

There are two options to do this:

1. Every time you make changes and want to implement them, enter this command to compile:

    ```
    ./node_modules/.bin/babel WoofJS/src/woof.es6.js --out-file WoofJS/dist/woof.js
    ```
2. Or -- tell babel to always watch for changes and auto-compile (less work for you!). Open a new terminal and run this:

    ```
    ./node_modules/.bin/babel WoofJS/src/woof.es6.js --watch --out-file WoofJS/dist/woof.js
    ```

#### WoofJS.com's Tutorials

WoofJS.com's tutorials actually live at an entirely different repo: https://github.com/stevekrouse/coding.space.

You can find them there in the `woof/` subdirectory. If you'd like to cotribute to the WoofJS curriculum, head on over to that repo.

### Getting started

1. We recommend using https://c9.io as your development environment -- when you create an account, it asks for a credit card, but it won't charge you.

2. Create a new basic HTML workstation, and clone the Woof repository.

    ```
    git clone https://github.com/stevekrouse/WoofJS.git
    ```     
3. Initialize npm (the following command makes this as simple as possible).
    
    ```
    npm init --yes
    ```
4. Install babel-cli and babel-preset-es2015 (npm may give you some warnings but don't worry).

    ```
    npm install babel-cli babel-preset-es2015 --save-dev
    ```
5. Take a look at our issues and see if there are any issues that speak to you as good places to tackle first. Pay particular attention to issues labeled "good student projects."

6. Create a new local branch to work on your issue -- use a descriptive branch name like in this example:

    ```
    git checkout -b more-pokemon-sprites
    ```
7. Once you've  made your changes, commit them to your branch.

    ```
    git commit -m "add more pokemon sprites"
    ```
8. Push your new branch (not master!) to the GitHub repo.

    ```
    git push origin more-pokemon-sprites
    ```
9. Submit a pull request so your changes can be reviewed.

If you have any questions, please email steve at thecodingspace.com :)


## License

MIT License, so do with our code as you will. If you want help using the code or integrating with WoofJS, we're happy to help :)
