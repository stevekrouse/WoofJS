import * as Utils from "./utils.js"

var app = new Vue({
  el: '#page',
  data: {
    code: "",
    status: "NEW",
    error: undefined,
    projects: [],
    codePane: true,
    outputPane: true,
    projectsPane: false,
    docsPane: true,
    projectbar: true,
    previewbar: false,
    docsbar:false,
    codebar:false,
    mouseX: 0,
    mouseY: 0,
    errorLineNumber: undefined,
    renameSprite: false,
    spriteName: '',
    suggestions: [],
    errorMessage: '',
    cursorOnErrorLine: false,
    selectedTheme:'eclipse',
    autoRunChecked: true,
    shortcut: CodeMirror.keyMap["default"] == CodeMirror.keyMap.macDefault ? 'Cmd' : 'Ctrl',     
    projectNameRequest: "NOT LOADING", // or "LOADING" or "NAME TAKEN"
    projectNameInputValue: "",
    projectNameLastKeyIllegal: false,
    usernameLastKeyIllegal: false,
    loginSignUpView: "LOGIN", // or SIGNUP or RESETPASSWORD or RESETPASSWORDSUCCESS
    emailError: false,
    usernameValid: "EMTPY", // TAKEN or VALID or EMPTY or ILLEGAL
    emailValid: "EMTPY", // TAKEN or VALID or NOTEMAIL or EMPTY
    passwordValid: "EMTPY", // VALID or EMPTY or WEAK
    loginError: "NONE", // NONE or USERNOTFOUND or WRONGPASSWORD or INVALIDEMAIL
    loginButtonState: "NORMAL", // NORMAL or LOADING
    signUpButtonState: "DISABLED", // NORMAL or DISABLED or LOADING
    loginPassword: "",
    loginEmail: "",
    resetEmail: "",
    signUpEmail: '',
    signUpPassword: '',
    signUpChecked: true,
    signUpUsername: '',
    loginState: "LOGGEDOUT", // or LOGGEDIN
    userNameForMenu: '',
    userProjectsLink: '',
    migrateUsernameValid: "EMTPY", // TAKEN or VALID or EMPTY or ILLEGAL
    migrateUsernameKeyIllegal: false,
    migrateUsername: '',
    migrateChecked: true,
    migrateButtonState: "DISABLED", // NORMAL or DISABLED or LOADING
    popoutAfterSave: false,
    copiedText: "",
  },
  computed: {
    styles : function() { return {
       // styles for the "Save" button
      'btn-warning': this.status == 'DIRTY',
      'btn-success': this.status == 'SAVED',
      'btn-default': this.status == "NEW"
    } },
    canClean: function(){
      return !this.error 
    },
  },
  methods: {
    getID: Utils.getID,
    processError: function() {
      this.suggestions = []
      this.errorMessage = []
      this.renameSprite = false
      // Remove error line highlight
      if (this.errorLineNumber) {
        editor.removeLineClass(this.errorLineNumber - 1, 'text', 'error-highlight');
      }
      if (this.error.message.includes("Uncaught ReferenceError") || this.error.message.includes("Uncaught TypeError")) {
        // Remove 'Uncaught..' from error message
        this.errorMessage = this.error.message.split(" ").slice(2).join(" ");
        // If error message is 'sprite1 not defined', ask user to rename sprite1
        this.renameSprite = this.error.message.includes('Uncaught ReferenceError: sprite1 is not defined') ? true : false;
        // Get alphanumeric user code
        var userCode = editor.getValue().replace(/(?:https?|ftp?|\.\/)[\n\S]+/g,'').match(/[a-zA-Z0-9]+/g);
        // Add Woof methods to the user code 
        userCode.push("onKeyDown", "onMouseDown", "onMouseUp", "onMouseMove", "penDown", "Image", "Rectangle", "Polygon", "Circle", "Line", "Oval", "move", "turnRight", "turnLeft", "angle", "pointTowards", "setRotationStyle", "show", "hide", "sendToFront", "sendToBack", "play", "Audio", "clearPen", "penUp", "penDown", "Text", "remove", "includes", "forEach", "find", "setBackdropURL", "setBackdropStyle", "after", "every", "repeat", "forever", "if", "else", "mouseX", "mouseY", "repeatUntil", "when", "freeze", "defrost", "delete", "remove", "push", "throttle", "mouseOver", "randomX", "randomY", "touching", "distanceTo", "prompt", "alert", "keysDown", "mouseDown", "pMouseX", "pMousecY", "mouseXSpeed", "mouseYSpeed", "hour", "hourMilitary", "minute", "second", "dayOfMonth", "dayOfWeek", "month", "year", "mobile", "random", "randomColor", "between", "substring", "round", "sqrt", "abs", "floor", "ceiling", "importCodeURL", "timer", "resetTimer")
        // Search user code for suggestions
        for (var i = 0; i < userCode.length; i++) {
          // Measure the difference between error and user code
          var distance = window.Levenshtein.get(this.findMisspelledWord(this.errorMessage), userCode[i]);
          // Add user code with a distance less than 3 to list of suggestions if it hasn't already been added, it isn't the error, it's longer than a character, and it isn't a numnber
          if (distance < 3 && distance != 0 && this.suggestions.indexOf(userCode[i]) == -1 && userCode[i].length > 1 && isNaN(userCode[i])) {
            this.suggestions.push(userCode[i]);
          }
        }
      }
      else {
        // Split error message by line break
        var errorDesc = this.error.message.split("\n");
        // Display first line of error message
        // Remove 'unknown' from first line if it exists
        var t = errorDesc[0].split(" ");
        this.errorMessage += t[0] == "unknown:" ? t.slice(1, t.length - 1).join(" ") : this.errorMessage += errorDesc[0];
        // Find error line number if it is undefined
        if (!this.error.lineno) {
          var x = errorDesc[0].slice(errorDesc[0].indexOf(":") + 2);
          this.error.lineno = x.slice(x.indexOf("(") + 1, x.indexOf(":"));
        }
      }
      // Show error line number if it is accurate
      if (this.error.lineno <= editor.lineCount()) {
        this.errorLineNumber = this.error.lineno;
        // Add highlight to error line
        editor.addLineClass(this.errorLineNumber - 1, 'text', 'error-highlight');
      } else {
        this.errorLineNumber = undefined
      }
    },
    // Find misspelling in user code
    findMisspelledWord: function(typo) {
      return typo.split(" ")[0].split(".").pop();
    },
    // Change user code if user clicks suggestion
    replaceMisspelledWord: function(x) {
      editor.setValue(editor.getValue().replace(new RegExp("\\b" + this.findMisspelledWord(this.errorMessage) + "\\b", 'g'), x));
    },
    // Rename sprite1 with user input
    getSpriteName: function() {
      editor.setValue(editor.getValue().replace(/sprite1/g, this.spriteName));
      this.spriteName = '';
      this.renameSprite = false;
    },
    // Go to error line
    goToErrorLine: function() {
      editor.scrollIntoView({line: this.errorLineNumber, ch:0}, editor.getScrollInfo().clientHeight / 2);
    },
    cleanAll: function(){
      if (!this.error && this.code != js_beautify(this.code, {space_after_anon_function: true, indent_size: 2, indent_with_tabs: false })){
        var beautiful = js_beautify(editor.getValue(), {space_after_anon_function: true, indent_size: 2, indent_with_tabs: false })
        editor.setValue(beautiful)
      }
    },
    share: function(){
      $('#shareModal').modal('show')
    },
    link: function(){
      return "https://woofjs.com/create.html#" + Utils.getID()
    },
    fullLink: function(){
      return "https://woofjs.com/full.html#" + Utils.getID()
    },
    copyStringToClipboard: function(str) {
      // Create new element
      this.copiedText = str;
      var el = document.createElement('textarea');
      // Set value (string to be copied)
      el.value = str;
      // Set non-editable to avoid focus and move outside of view
      el.setAttribute('readonly', '');
      el.style = {position: 'absolute', left: '-9999px'};
      document.body.appendChild(el);
      // Select text inside element
      el.select();
      // Copy text to clipboard
      document.execCommand('copy');
      // Remove temporary element
      document.body.removeChild(el);
    },
    embed: function(){
      return "<iframe src=\"https://woofjs.com/full#" + Utils.getID() + "\">\n</iframe>"
    },
    selectAll: function(){
      editor.execCommand("selectAll")
    },
    undo: function(){
      editor.execCommand("undo")
    },
    redo: function(){
      editor.execCommand("redo")
    },
    find: function(){
      editor.execCommand("find")
    },
    replace: function(){
      editor.execCommand("replace")
    },
    comment: function(){
      editor.toggleComment()
    },
    copy: function(){
      this.copyStringToClipboard(editor.getSelection())
    },
    cut: function(){
      this.copyStringToClipboard(editor.getSelection())
      editor.replaceSelection("")
    },
    paste: function(){
      editor.replaceSelection(this.copiedText)
    },
    validate: function($event) {
      var newName = $event.target.value

      this.projectNameRequest = 'NOT LOADING'  // reset state so that you can hit save after you change the name after you get a NAME TAKEN error

      this.projectNameLastKeyIllegal = false // take off the animation
      setTimeout(function() {
        var lastKeyPressIllegal = newName.length > 0 && newName[newName.length - 1].match(/\.|#|\$|\/|\[|\]/)
        if (lastKeyPressIllegal) {
          this.projectNameLastKeyIllegal = lastKeyPressIllegal[0]
        } else {
          this.projectNameLastKeyIllegal = false
        }
      }.bind(this), 10)


      this.projectNameInputValue = newName.replace(/ /g, "-")
      this.projectNameInputValue = this.projectNameInputValue.replace(/\.|#|\$|\/|\[|\]/g, "")
    },
    saveName : function() {
      if (app.projectNameRequest == "NOT LOADING"){
        app.projectNameRequest = "LOADING"
        var name = app.projectNameInputValue
        if (name) {
          saveProject(name);
        }
      }
    },
    themeChange: function (event){
      var newTheme = event.target.value;
      app.selectedTheme = newTheme;
      editor.setOption("theme", newTheme);
      if(firebase.auth().currentUser){
        firebase.database().ref("/user/" + firebase.auth().currentUser.uid + "/theme").set(newTheme)
      } 
    },
    switchToSignUp: function(){
      this.loginSignUpView = 'SIGNUP'
    },
    switchToLogin: function(){
      this.loginSignUpView = 'LOGIN'
    },
    switchToPasswordReset: function(){
       this.loginSignUpView = 'RESETPASSWORD'
    },
    usernameValidate: function($event){
      var username = $event.target.value
      if (username == ''){
        this.usernameValid = "EMPTY"
      } else {
        this.usernameLastKeyIllegal = false
        setTimeout(function() {
          var lastKeyPressIllegal = username.length > 0 && username[username.length - 1].match(/\.|#|\$|\/|\[|\]/)
          if (lastKeyPressIllegal) {
            this.usernameLastKeyIllegal = lastKeyPressIllegal[0]
          } else {
            this.usernameLastKeyIllegal = false
          }
        }.bind(this), 10)

        this.signUpUsername= username.replace(" ", "-")
        this.signUpUsername = this.signUpUsername.replace(/\.|#|\$|\/|\[|\]/g, "")
        this.usernameValid = "VALID"
      }
    },
    migrateUsernameVaidate: function($event){
      var username = $event.target.value
      if (username == ''){
        this.usernameValid = "EMPTY"
      } else {
        this.migrateUsernameKeyIllegal = false
        setTimeout(function() {
          var lastKeyPressIllegal = username.length > 0 && username[username.length - 1].match(/\.|#|\$|\/|\[|\]/)
          if (lastKeyPressIllegal) {
            this.migrateUsernameKeyIllegal = lastKeyPressIllegal[0]
          } else {
            this.migrateUsernameKeyIllegal = false
          }
        }.bind(this), 10)

        this.migrateUsername= username.replace(" ", "-")
        this.migrateUsername = this.migrateUsername.replace(/\.|#|\$|\/|\[|\]/g, "")
        this.migrateUsernameValid = "VALID"
      }
    },
    // Checks for success or error on blur
    emailValidate: function($event){
      var email = $event.target.value
      if (email == ''){
        this.emailValid = "EMPTY"
      } else if (!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)){
        this.emailValid = "NOTEMAIL"
      } else if (/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)){
        this.emailValid = "VALID"
      }
    },
    // Checks for success or error on blur
    passwordValidate: function($event){
      var password = $event.target.value
      if (password == ''){
        this.passwordValid = "EMPTY"
      } else if (!/^.{6,}$/.test(password)){
        this.passwordValid = "WEAK"
      } else {
        this.passwordValid = "VALID"
      }
    },
    // Checks for success on every input
    emailSuccessValidate: function($event){
      var email = $event.target.value
      if (/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)){
        this.emailValid = "VALID"
      }
    },
    // Checks for success on every input
    passwordSuccessValidate: function($event){
      var password = $event.target.value
      if (/^.{6,}$/.test(password)){
        this.passwordValid = "VALID"
      }
    },
  }
})

// Initalizes the popover for the comment code button in the tools menu
$(document).ready(function(){
    $('[data-toggle="popover"]').popover();   
});

var clipboard = new Clipboard('.btn-clipboard');
Vue.nextTick(function() {
    $('[data-toggle="tooltip"]').tooltip({
        trigger: 'manual'
    });
    clipboard.destroy()
    clipboard = new Clipboard('.btn-clipboard');
    clipboard.on('success', function(e) {
        $(e.trigger).tooltip('show')
        setTimeout(function() {
            $(e.trigger).tooltip('hide')
        }, 1000)
    });

})

var myCode = false
scratch.src = scratch.src // the documentation sometimes doesn't load unless you remind it to here, strange VueJS bug
projectsIframe.src = projectsIframe.src // ditto for the project's iframe

var config = {
  apiKey: "AIzaSyBYHv7dCiD0bWiHRlcp4VIZCIqzoMnB4yY",
  authDomain: "woofjs-d1b27.firebaseapp.com",
  databaseURL: "https://woofjs-d1b27.firebaseio.com",
  storageBucket: "woofjs-d1b27.appspot.com",
  messagingSenderId: "397293370524"
};
firebase.initializeApp(config);

function clearLoginSignupModal() {
  app.emailError = false;
  app.usernameValid = "EMTPY";
  app.emailValid = "EMTPY";
  app.passwordValid = "EMTPY";
  app.loginError = "NONE";
  app.loginButtonState = "NORMAL";
  app.signUpButtonState = "DISABLED";
  app.loginPassword = "";
  app.loginEmail = "";
  app.resetEmail = "";
  app.signUpEmail = '';
  app.signUpPassword = '';
  app.signUpChecked = true;
  app.signUpUsername = '';
}

function loginWithEmail(email, pass){
  firebase.auth().signInWithEmailAndPassword(email, pass)
    .then(function() {
      $('#loginModal').modal('hide');
      clearLoginSignupModal();
      app.projects = []

    })
    .catch(function(error) {
      if (error.code === 'auth/wrong-password') {
        app.loginError = "WRONGPASSWORD"
        app.loginButtonState = "NORMAL"
      } else if (error.code === 'auth/invalid-email') {
        app.loginError = "INVALIDEMAIL"
        app.loginButtonState = "NORMAL"
      } else {
        app.loginError = "USERNOTFOUND"
        app.loginButtonState = "NORMAL"
      }
    })
}

function migrate(){
  if (app.migrateUsernameValid == 'VALID' && app.migrateButtonState != 'LOADING') {
    app.migrateButtonState = "LOADING"

    var exists
    var ref = firebase.database().ref("uniqueUsername");

    ref.child(app.migrateUsername).once('value', function(snapshot) {
      exists = (snapshot.val() !== null);
      if (exists) {
        app.migrateUsernameValid = 'TAKEN'
        app.migrateButtonState = "NORMAL"
      } else {

        var user = firebase.auth().currentUser;

        user.updateProfile({
          displayName: app.migrateUsername,
          recieveUpdates: app.migrateChecked,
          usernameUnique: true
        })

        firebase.database().ref("uniqueUsername/" + app.migrateUsername).set({
          username: app.migrateUsername,
          uid: user.uid
        })

        app.userNameForMenu = app.migrateUsername

        var ref = firebase.database().ref("user");
        ref.child(user.uid).once('value', function(snapshot) {
          var createdDateVar = snapshot.val().createdDate;
          var emailVar = snapshot.val().email;

          var updates = {};

          updates['/user/' + user.uid] = {
            createdDate: createdDateVar,
            displayName: app.migrateUsername,
            email: emailVar,
            recieveUpdates: app.migrateChecked,
            usernameUnique: true
          }

          $('#migrateModal').modal('hide');
          app.migrateButtonState = "NORMAL"
          app.migrateUsername = ''
          app.migrateUsernameValid = 'EMPTY'

          return firebase.database().ref().update(updates);
        });

      }
    });

  } 
}

function login() {
  app.loginButtonState = "LOADING"

  if (!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(app.loginEmail)){
    var ref = firebase.database().ref("user");
    ref.orderByChild("displayName").equalTo(app.loginEmail).on("value", function(snapshot) {
      if (snapshot.numChildren()==1){
        loginWithEmail(snapshot.val()[Object.keys(snapshot.val())[0]].email, app.loginPassword)
      } else if (snapshot.numChildren()>1){
        app.loginError = "USERNAMENOTUNIQUE"
        app.loginButtonState = "NORMAL"
      }else{
        app.loginError = "USERNOTFOUND"
        app.loginButtonState = "NORMAL"
      }
    });
  } else {
    loginWithEmail(app.loginEmail, app.loginPassword)
  }
}

function signUp() {
  var email = app.signUpEmail;
  var password = app.signUpPassword;
  if (email == ''){
    app.emailValid = "EMPTY"
  } else if (!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)){
    app.emailValid = "NOTEMAIL"
  } else if (/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)){
    app.emailValid = "VALID"
  } 
  if (password == ''){
    app.passwordValid = "EMPTY"
  } else if (!/^.{6,}$/.test(password)){
    app.passwordValid = "WEAK"
  } else {
    app.passwordValid = "VALID"
  }

  if (app.usernameValid == 'VALID' && app.emailValid == 'VALID' && app.passwordValid == 'VALID' && app.signUpButtonState != 'LOADING') {
    app.signUpButtonState = "LOADING"

    var exists
    var ref = firebase.database().ref("uniqueUsername");
    ref.child(app.signUpUsername).once('value', function(snapshot) {
      exists = (snapshot.val() !== null);
      if (exists) {
        app.usernameValid = 'TAKEN'
        app.signUpButtonState = "NORMAL"
      } else {
        firebase.auth().createUserWithEmailAndPassword(app.signUpEmail, app.signUpPassword)
          .then(function() {

            $('#loginModal').modal('hide');

            var user = firebase.auth().currentUser;

            user.updateProfile({
              displayName: app.signUpUsername
            })

            
            app.userNameForMenu = app.signUpUsername
            app.projects = []

            firebase.database().ref("uniqueUsername/" + app.signUpUsername).set({
              username: app.signUpUsername,
              uid: user.uid
            })

            firebase.database().ref('/user/' + user.uid).once('value').then(function(snapshot) {
              if (!snapshot.val()) {
                firebase.database().ref("/user/" + user.uid).set({
                  displayName: app.signUpUsername,
                  email: user.email,
                  createdDate: firebase.database.ServerValue.TIMESTAMP,
                  recieveUpdates: app.signUpChecked,
                  usernameUnique: true
                })
              }
            });

          }).catch(function(error) {
            // Handle EMAIL Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            if (error.code === 'auth/email-already-in-use') {
              app.emailValid = "TAKEN"
              app.signUpButtonState = "auth/invalid-email"
            } else if (error.code === 'auth/invalid-email') {
              app.emailValid = "NOTEMAIL"
              app.signUpButtonState = "NORMAL"
            } else if (error.code === 'auth/weak-password') {
              app.passwordValid = "WEAK"
              app.signUpButtonState = "NORMAL"
            }

          });
      }
    });
  }
}

function resetPassword(){
  app.resetButtonState = "LOADING"
  firebase.auth().sendPasswordResetEmail(app.resetEmail).then(function() {
    app.loginSignUpView = "RESETPASSWORDSUCCESS"
    clearLoginSignupModal();
  }, function(error) {
    app.loginSignUpView = "RESETPASSWORDSUCCESS"
    clearLoginSignupModal();
  })
}

function handleLogin(userName, uid) {
  app.userNameForMenu = userName
  app.userProjectsLink  = "./user.html#" + uid
  app.loginState = "LOGGEDIN"
}

function handleLogout() {
  app.loginState = "LOGGEDOUT"
  myCode = false
  clearLoginSignupModal()
}

var authChanged = false
firebase.auth().onAuthStateChanged(function(user) {
  if (!authChanged){
    authChanged = true
    if (user){
      ga('set', 'userId', user.uid);
    }
  }      
  
  // if user is logging in
  if (user){
    // get and set editor theme
    firebase.database().ref('/user/' + user.uid + '/theme').once('value').then(function(snapshot) {
      if (snapshot.val()) {
        app.selectedTheme = snapshot.val();
        editor.setOption("theme", snapshot.val());
      }
    })
    
    if (user.displayName){
      handleLogin(user.displayName, user.uid)

      var ref = firebase.database().ref("user");
      ref.child(user.uid).once('value', function(snapshot) {
        if (!snapshot.val().usernameUnique){
          app.migrateUsername = ''
          $('#migrateModal').modal('show')
        }
      });
    } else if (app.signUpUsername){
      handleLogin(app.signUpUsername, user.uid)
    }
    
    // this puts the user's most recent project under their name
    firebase.database().ref('/code-meta-data/').orderByChild("uid").equalTo(user.uid).once('value').then(function(snapshot) {
      if (snapshot.val()){
        app.projects = []
        for (var key in snapshot.val()) {
          var project = snapshot.val()[key]
          var t = project.currentVersionTime
          app.projects.push({key: key, time: t, code: project.code})
        }
      } 
      // sort the proejcts by most recently touched
      app.projects.sort(function(a,b) {
        if (a.time < b.time)
          return 1;
        if (a.time > b.time)
          return -1;
        return 0;
      })
    });
  } else {
    handleLogout()
  }
});

var makeClean = function() {
  app.status = "SAVED"
  Utils.currentHash = window.location.hash
}

var makeDirty = function() {
  app.status = "DIRTY"
}

var popout = function() {
  if (app.status == "SAVED"){
    window.open("./full.html#" + Utils.getIDWithRevision(), "_blank")
  } else {
    // remember this save was initiated by clicking popout, so we remember to open the popout after saving is completed
    app.popoutAfterSave = true;
    save();
  }
}

// set the text in the editor
var editorVal = "setBackdropURL('./images/outerspace.jpg')\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n"
if (Utils.getID() != ''){
  editorVal = "// Loading..."
  firebase.database().ref('/code-meta-data/' + Utils.getID()).once('value').then(function(snapshot) {
    if (snapshot.val()){
      myCode = firebase.auth().currentUser && snapshot.val()["uid"] == firebase.auth().currentUser.uid
      
      var revision = parseInt(window.location.hash.substring(1, window.location.hash.length).split("/")[1])
      var keys = Object.keys(snapshot.val()["version"])
      if (!isNaN(revision) && (revision !== 0 && revision !== -1 * keys.length) && Math.abs(revision) < keys.length + 1){
        if (revision < 0){
          revision = keys.length + revision // -1 gives the previous revision
        }
        var key = keys[revision - 1] // 1-indexed, so the first version is 1
        
        firebase.database().ref('/code/' + Utils.getID() + '/' + key).once('value').then(function(snapshot) {
          editor.setValue(snapshot.val().code)
        })
      } else {
        myCode = firebase.auth().currentUser && snapshot.val()["uid"] == firebase.auth().currentUser.uid
        editor.setValue(snapshot.val().currentVersionText)
      }
      makeClean()
    } else {
      alert("Could not find a project with the name: " + Utils.getID())
      editor.setValue("")
    }
  });
}

// we add the project name to the hash on save
// this code prevents that from triggering a page reload
window.addEventListener("hashchange", function() {
  if (Utils.currentHash != window.location.hash) {
    window.location.reload()
  }
})

var saveProject = function(name){
  firebase.database().ref('/code/' + name).limitToLast(1).once('value').then(function(snapshot) {
    if (snapshot.val()){
      if (firebase.auth().currentUser && snapshot.val()[Object.keys(snapshot.val())[0]].uid == firebase.auth().currentUser.uid) {
        // if the project exists and you own it, push the new code as a revision
        $('#saveModal').modal('hide');
        app.projectNameRequest = "NOT LOADING"
        saveProjectFirebase({name: name, newProject: false})
      } else {
        // if the project exists and you don't own it
        app.projectNameRequest = "NAME TAKEN"
      }
    } else {
      // if the project doesn't exist, save a new project
      $('#saveModal').modal('hide');
      app.projectNameRequest = "NOT LOADING"
      saveProjectFirebase({name: name, newProject: true})
    }
  });
}

function saveProjectFirebase({name, newProject}) {
  var updates = {}

  var revisionId = firebase.database().ref().child("/code/" + name).push().key
  updates["/code/" + name + "/" + revisionId] = {
    code: editor.getValue(),
    time: firebase.database.ServerValue.TIMESTAMP,
    uid: firebase.auth().currentUser && firebase.auth().currentUser.uid
  }
  
  if (newProject) {
    if (firebase.auth().currentUser) {
      updates["/code/" + name + "/--uid"] = firebase.auth().currentUser.uid
    }
    updates["/code-meta-data/"+ name + "/projectCreatedTime"] = firebase.database.ServerValue.TIMESTAMP
  }
  updates["/code-meta-data/"+ name + "/currentVersionText"] = editor.getValue()
  updates["/code-meta-data/"+ name + "/currentVersionTime"] = firebase.database.ServerValue.TIMESTAMP
  updates["/code-meta-data/"+ name + "/uid"] = firebase.auth().currentUser && firebase.auth().currentUser.uid
  updates["/code-meta-data/"+ name + "/version/" + revisionId] = firebase.database.ServerValue.TIMESTAMP
  
  firebase.database().ref().update(updates).then(function(){
    window.location.hash = name
    setUserUploadImageListener() // sync user-uploaded photos for this project name
    myCode = firebase.auth().currentUser
    // This save was initiated by the user clicking the popout button
    // Now that the project is saved, popout the project in a new window
    if(app.popoutAfterSave){
      app.popoutAfterSave = false;
      popout();
    }
    makeClean()
  }).catch(function(error){
    alert("Unable to save project: " + error)
  });
}

var save = function(){
  if (app.status == "SAVED") { return }

  if (editor.getValue().startsWith("// Loading...")){
    return // don't allow students to save projects that haven't loaded
  }

  if (myCode && Utils.getID()) {
    saveProject(Utils.getID())
  } else {
    if (Utils.getID()) {
      app.projectNameInputValue = autoIncrimentedName()
    }
    $('#saveModal').modal('show')
  }
}

$('.modal').on('shown.bs.modal', function () {
  $('#projectName').focus() // focus on the project name input box when the modal loads
})

var autoIncrimentedName = function() {
  var projName = Utils.getID();
  var versionNumber = parseInt(projName[projName.length-1])
  if (!isNaN(versionNumber) && projName[projName.length-2] == "-"){
    versionNumber += 1;
    return projName.substring(0, projName.length-1) + versionNumber.toString();
  } else {
    return projName + "-1";
  }
}

// keyboard shortcuts
var mac = CodeMirror.keyMap["default"] == CodeMirror.keyMap.macDefault;
var ctrl = mac ? "Cmd-" : "Ctrl-";
var keymap = {}
keymap[ctrl + "B"] = function(cm) {
   if (cm.getSelection() == ""){
    cm.execCommand("selectAll");
   }
  var beautiful = js_beautify(cm.getSelection(), {space_after_anon_function: true, indent_size: 2, indent_with_tabs: false })
  cm.replaceSelection(beautiful)
}
keymap.Tab = function(cm) {
  var spaces = Array(cm.getOption("indentUnit") + 1).join(" ");
  cm.replaceSelection(spaces, "end", "+input");
}

var editor = CodeMirror(document.getElementById('code'), {
    mode:  "javascript",
    value: editorVal,
    lineNumbers: true,
    lineWrapping: false,
    tabSize: 2,
    indentUnit: 2,
    indentWithTabs: false,
    electricChars: true,
    keyMap: "sublime",
    autoCloseBrackets: true,
    matchBrackets: true,
    autofocus: true,
    smartIndent: true,
    foldGutter: true,
    gutters: ["CodeMirror-lint-markers", "CodeMirror-foldgutter"],
    extraKeys: keymap,
    lint: {
      delay: 800,
      options: {
        "esnext": true,
        "asi": true
      }
    },
    // Added to allow users to see if highlighted error line is selected.
    styleSelectedText: true
});

// Track Codemirror cursor activity
editor.on('cursorActivity', function(){
  var activeLine = editor.getCursor().line + 1;
  // If cursor is on error line, change cursor style
  if (app.errorLineNumber && app.error) {
    if (app.errorLineNumber == activeLine) {
     app.cursorOnErrorLine = true;
    }
    else {
     app.cursorOnErrorLine = false;
    }
  } 
  else {
    app.cursorOnErrorLine = false;
  }
});



onkeydown = function(e){
  if(e.ctrlKey && e.key == '/'){
    e.preventDefault();
  }
  if((e.metaKey || e.ctrlKey) && e.keyCode == 'S'.charCodeAt(0)){
    e.preventDefault();
    save();
  }
}

function WoofJSLint(){
  if (app.error) { return }
  const code = js_beautify(app.code, {space_after_anon_function: true, indent_size: 2, indent_with_tabs: false})
  const regEx = /  ((\w)*\.)?(ready|onKeyDown|onKeyUp|onMouseDown|onMouseUp|onMouseMove|forever|repeatUntil)/g   // matches any event indented with two spaces
  var result;
  while ((result = regEx.exec(code)) !== null) {
    var lineNumber = code.substring(0, result.index).split('\n').length
    CodeMirror.commands.markGutter(editor, "warning", lineNumber, "It's usually a bad idea to have " + result[3] + "'s inside loops and other events.")
  }
}

function autoRunClicked(){
  if (!app.autoRunChecked){
    makeDirty()
    debouncedRunCode()
    setTimeout(function() {WoofJSLint()}, 1000); 
  }
}

// run the code (debounced) on every change to the editor 
editor.on("change", function(){
  if (app.autoRunChecked){
    makeDirty()
    debouncedRunCode()
    setTimeout(function() {WoofJSLint()}, 1000); 
  }
});
runCode()

// focus on the preview when refreshed
 function focusPreview() {
   document.getElementById('preview').focus();
 };

editor.on('inputRead', function(cm, e){
  if (e.text.length == 1 && e.text[0].length == 1 &&  /^[a-zA-Z\.]/.test(e.text[0])) {
    // constantly show autocomplete suggestions
    CodeMirror.commands.autocomplete(editor);
  }
});

// warns the user when they try to close the page without saving
window.onbeforeunload = function(e) {
   if (app.status == "DIRTY") {
     var dialogText = 'Make sure to copy and paste your work somewhere safe.';
     e.returnValue = dialogText;
     return dialogText;
   }
};

function tryRunningCode() {
  app.code = editor.getValue()
  app.error = undefined
  for (var i = 0; i < editor.lineCount(); i++) {
    editor.removeLineClass(i, 'text', 'error-highlight');
  }
  try {
    var result = Babel.transform(editor.getValue(), {
      presets: [['es2015', {'modules': false}]], // modules: false to remove strict mode
      retainLines: true
    })
    var code = result.code
    document.getElementById('preview').contentWindow.addEventListener("mousemove", function(event) {
      app.mouseX = Math.round(document.getElementById('preview').contentWindow.mouseX)
      if (app.mouseX >= Math.round(document.getElementById('preview').contentWindow.maxX - 2)) {
        app.mouseX += " (maxX)"
      }
      if (app.mouseX <= Math.round(document.getElementById('preview').contentWindow.minX + 1)) {
        app.mouseX += " (minX)"
      }
      app.mouseY = Math.round(document.getElementById('preview').contentWindow.mouseY)
      if (app.mouseY >= Math.round(document.getElementById('preview').contentWindow.maxY - 1)) {
        app.mouseY += " (maxY)"
      }
      if (app.mouseY <= Math.round(document.getElementById('preview').contentWindow.minY + 3)) {
        app.mouseY += " (minY)"
      }
    })
    document.getElementById('preview').contentWindow.addEventListener("error", function(event) {
      var error = event.error
      if (error.type == "ImageLoadError") {
        if (error.url === "") {
            var emptyURLTypes = ["setBackdropURL('')", 'setBackdropURL("")', 'url: ""', "url: ''"]
            var emptyURLType = emptyURLTypes.find(t => code.includes(t))
            if (emptyURLType) {
              app.error = {message: "You forgot to include an image or background URL.", lineno: code.substring(0, code.indexOf(emptyURLType)).split('\n').length}
            } else {
              // We can't figure out the lineno if it's set to an empty string variable
              // https://woofjs.com/create#image-url-issue
              app.error = {message: "You forgot to include an image or background URL.", lineno: null}
            }
          } else {
          app.error = {message: "Your image URL (" + error.url +") is misspelled or not correct.", lineno: code.substring(0, code.indexOf(error.url)).split('\n').length}
          }
      }
      else {
        app.error = event
      }
      app.processError()
      CodeMirror.commands.markGutter(editor, "error", app.error.lineno, app.error.message)
    });
    var script = document.createElement("script");
    script.type = "text/javascript";
    script.crossorigin = "anonymous"
    script.text = code
    document.getElementById('preview').contentDocument.body.appendChild(script)
  }
  catch (e) {
    app.error = e
    app.processError()
  }
}

function runCode() {
    
    document.getElementById("preview").remove();
    var iframe = document.createElement("iframe");
    iframe.id = "preview";
    document.getElementById("output").appendChild(iframe);

    setTimeout(function() {

        // add doctype to iframe
        iframe.contentWindow.document.open();
        iframe.contentWindow.document.write('<!DOCTYPE html>');
        iframe.contentWindow.document.close();

        // add a base tag to the page so it knows where to pull relative image urls
        var base = iframe.contentWindow.document.createElement("base");
        base.href = document.baseURI
        iframe.contentWindow.document.body.appendChild(base);

        // then we create a script tag with the woof code and add it to the page
        var script = iframe.contentWindow.document.createElement("script");
        script.type = "text/javascript";
        script.src = "./woof.js";
        iframe.contentWindow.document.body.appendChild(script);

        script.onload = function() {
            // when the woof.js library loads, run the user's code
            var evt = document.createEvent('Event');
            evt.initEvent('load', false, false);
            iframe.contentWindow.dispatchEvent(evt);
            tryRunningCode();
        }
    }, 10)
}

window.onmessage = function(e){
  if (!(e.data instanceof File)){
    return
  }
  if (!firebase.auth().currentUser) {
    alert('Please login to upload images.')
    return
  }
  if (!Utils.getID()) {
    alert('Please save your project to upload images.')
    return
  }
  if (!myCode) {
    alert('Please save this project to your account to upload images.')
  }
  
  var uniqueId = Math.random().toString(36).substring(2) 
           + (new Date()).getTime().toString(36);
  
  var ref = firebase.storage().ref()
    .child('UserImageUpload')
    .child(firebase.auth().currentUser.uid)
    .child(Utils.getID())
    .child(uniqueId)

  var file = e.data
  ref.put(file)
    .then(function(snapshot){
      if (Utils.getID()) {
        firebase.database().ref()
          .child('code-image-uploads')
          .child(Utils.getID())
          .child(uniqueId)
          .set(snapshot.downloadURL)
      }
    }).catch(function(error){
      alert('There was an error uploading your image: ' + error.message)
    })
};

var ref
var setUserUploadImageListener = function() {
  ref && ref.off() 
  ref = firebase.database().ref()
    .child('code-image-uploads')
    .child(Utils.getID())
  ref.on('value', function(snapshot) {
    var addImagesFunc = () => {
      var images = snapshot.val() || {}
      scratch.contentWindow.app.setUserUploadImages(Object.values(images))
    }
    if (scratch.contentWindow.app){
      addImagesFunc()
    } else {
      scratch.contentDocument.addEventListener('DOMContentLoaded', addImagesFunc, false);
    }
  })  
}
Utils.getID() && setUserUploadImageListener()

// helper function to prevent runCode from running too often
var debouncedRunCode = Utils.debounce(runCode, 1000, false)