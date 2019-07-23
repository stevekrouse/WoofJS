import * as Utils from "./utils.js"

var getID = function() {
  // returns the name of a project, not inlcuding the current revision
  return window.location.hash.substring(1, window.location.hash.length).split("/")[0];
}
var getIDWithRevision = function() {
  // returns the name of a project, not inlcuding the current revision
  return window.location.hash.substring(1, window.location.hash.length);
}
var getCurrentRevisionCode = function(revisions) {
  // returns the code that corresponds to the current project and revision
  var revision = parseInt(window.location.hash.substring(1, window.location.hash.length).split("/")[1])
  
  var keys = Object.keys(revisions)
  if (keys.length > 1){
    keys = keys.slice(1, keys.length)
  }
  
  
  var key
  if (!isNaN(revision) && (revision !== 0 && revision !== -1 * keys.length) && Math.abs(revision) < keys.length + 1){
    if (revision < 0){
      revision = keys.length + revision // -1 gives the previous revision
    }
    key = keys[revision - 1]
  } else {
    key = keys[keys.length - 1]
  }
  return revisions[key].code
}
var currentHash = window.location.hash

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
    seenError: true,
  },
  computed: {
    styles : function() { return {
       // styles for the "Save" icon
      'glyphicon-floppy-remove': this.status == 'DIRTY', 
      'glyphicon-floppy-saved': this.status == 'SAVED' || this.status == "NEW"
    } },
    canClean: function(){
      // whether or not the code can be "cleaned" or if its already pristine
      return !this.error && this.code != js_beautify(this.code, {space_after_anon_function: true, indent_size: 2, indent_with_tabs: false })
    },
  },
  methods: {
    getID: getID,
    showError: function(){
      this.seenError = true
      if (this.error.message.includes('Uncaught ReferenceError: sprite1 is not defined')) {
        var spriteName = prompt("Error on line " + this.error.lineno  + "\n\n" + "You need to rename 'sprite1'. What would you like to name it?", "unicornSprite");    
        if (spriteName !== null) {   
            editor.setValue(editor.getValue().replace(/sprite1/g, spriteName));
        }  
      }
      else if (this.error.message.includes("Uncaught ReferenceError")) {
        var message = this.error.message.replace("Uncaught ReferenceError: ", "")
        alert("Error on line " + this.error.lineno  + "\n\n" + message + ". Check the spelling of your variable definitions.")
      }
      else {
         alert("Error on line " + this.error.lineno  + "\n\n" + this.error.message)
      }
    },
    cleanAll: function(){
      var beautiful = js_beautify(editor.getValue(), {space_after_anon_function: true, indent_size: 2, indent_with_tabs: false })
      editor.setValue(beautiful)
    },
  },
  watch: {
    error: function(newError) {
      if (newError && newError.lineno) {
        CodeMirror.commands.markGutter(editor, "error", newError.lineno, newError.message)
      }
    }
  }
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
  
function handleLogin(userName, uid) {
  $('#loggedin-name').html(userName + ' <span class="caret"></span>')
  $('#login-projects').attr("href", "./user.html#" + uid )
  $('#logggedin').removeClass("hide")
  $('#login').addClass('hide')
}

function handleLogout() {
  $('#logggedin').addClass("hide")
  $('#login').removeClass("hide")
  myCode = false
}

var authChanged = false
firebase.auth().onAuthStateChanged(function(user) {
  if (!authChanged){
    authChanged = true
  }
  
  if (user){
    ga('set', 'userId', user.uid); 
    firepad.setUserId(user.uid)
    
    handleLogin(user.displayName, user.uid)
    
    firebase.database().ref('/user/' + user.uid).once('value').then(function(snapshot) {
      var userVal = snapshot.val()
      
      // if the user is logged in, and we don't have their name/email in our database, save it now
      if (!userVal) {
        firebase.database().ref("/user/" + user.uid).set({
          displayName: user.displayName,
          email: user.email,
          createdDate: firebase.database.ServerValue.TIMESTAMP
        })
      }
     
      if (userVal && userVal.team && Object.values(userVal.team).includes(getID())) {
        // do nothing because we've already added this project to the user
      } else {
        firebase.database().ref("/user/" + user.uid + "/team/").push(getID())
      }
    })
    
    // this puts the user's most recent project under their name
    firebase.database().ref('/code/').orderByChild("--uid").equalTo(user.uid).once('value').then(function(snapshot) {
      if (snapshot.val()){
        app.projects = []
        for (var key in snapshot.val()) {
          var project = snapshot.val()[key]
          var versions = Object.keys(project)
          var t = project[versions[versions.length-1]].time
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
  currentHash = window.location.hash
}

var makeDirty = function() {
  app.status = "DIRTY"
}

var popout = function() {
  if (app.status != "DIRTY"){
    window.open("./team-full.html#" + getIDWithRevision(), "_blank")
  } else {
    alert("You must save your project to open it in a new window.")
  }
}

// we add the project name to the hash on save
// this code prevents that from triggering a page reload
window.addEventListener("hashchange", function() {
  if (currentHash != window.location.hash) {
    window.location.reload()
  }
})

var save = function(){
  if (app.status == "SAVED") { return }
  
  if (editor.getValue().startsWith("// Loading...")){
    return // don't allow students to save projects that haven't loaded
  }
  
  var name
  if (myCode) {
    name = getID()
  } else {
    name = window.prompt('Choose a name for your project. You cannot include ".", "#", "$", "[", "]", or spaces in the name of your project.', "my-project") || '';
  }
  if (name.includes('.') || name.includes('/') || name.includes('$') || name.includes("#") || name.includes("[") || name.includes("]") || name.includes(" ")){
    alert('You cannot include ".", "#", "$", "[", "]", or spaces in the name of your project. Try to save again.')
  } else if (name) { 
    firebase.database().ref('/code/' + name).limitToLast(1).once('value').then(function(snapshot) {
      if (snapshot.val()){
        if (firebase.auth().currentUser && snapshot.val()[Object.keys(snapshot.val())[0]].uid == firebase.auth().currentUser.uid) {
            // if the project exists and you own it, push the new code as a revision
            firebase.database().ref().child("/code/" + name).push({
              code: editor.getValue(), 
              time: firebase.database.ServerValue.TIMESTAMP, 
              uid: firebase.auth().currentUser && firebase.auth().currentUser.uid
            }).then(function(){
              window.location.hash = name
              makeClean()
            }).catch(function(error){
              alert("Unable to save project: " + error)
            });
        } else {
          alert("That project name has already been taken. Try another one.")
        }
      } else {
        // else create a new project and push this code as the first revision
        firebase.database().ref().child("/code/" + name + "/--uid").set(firebase.auth().currentUser && firebase.auth().currentUser.uid)
        firebase.database().ref().child("/code/" + name).push({
          code: editor.getValue(), 
          time: firebase.database.ServerValue.TIMESTAMP, 
          uid: firebase.auth().currentUser && firebase.auth().currentUser.uid
        }).then(function(){
          window.location.hash = name
          myCode = firebase.auth().currentUser
          makeClean()
        }).catch(function(error){
          alert("Unable to save project: " + error)
        });
      }
    });
  }
};

// keyboard shortcuts
var mac = CodeMirror.keyMap["default"] == CodeMirror.keyMap.macDefault;
var ctrl = mac ? "Cmd-" : "Ctrl-";
var keymap = {}
keymap[ctrl + "B"] = function(cm) {
  var beautiful = js_beautify(cm.getSelection(), {space_after_anon_function: true, indent_size: 2, indent_with_tabs: false })
  cm.replaceSelection(beautiful)
}
keymap.Tab = function(cm) {
  var spaces = Array(cm.getOption("indentUnit") + 1).join(" ");
  cm.replaceSelection(spaces, "end", "+input");
}

var editor = CodeMirror(document.getElementById('code'), {
    mode:  "javascript",
    //value: editorVal,
    lineNumbers: true,
    lineWrapping: false,
    theme: "eclipse",
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
});

// It's probably a bad idea to have a super large data structure like this in JS
// One bad side effect is that it turns off syntax highlighting in the code below it
const adjs = ["adorable","beautiful","clean","drab","elegant","fancy","glamorous","handsome","long","magnificent","old-fashioned","plain","quaint","sparkling","ugliest","unsightly","wide-eyed","red","orange","yellow","green","blue","purple","gray","black","white","alive","better","careful","clever","dead","easy","famous","gifted","helpful","important","inexpensive","mushy","odd","powerful","rich","shy","tender","uninterested","vast","wrong","angry","clumsy","defeated","embarrassed","fierce","grumpy","helpless","jealous","lazy","mysterious","nervous","obnoxious","panicky","repulsive","scary","thoughtless","uptight","worried","agreeable","brave","calm","delightful","eager","faithful","gentle","happy","jolly","kind","lively","nice","obedient","proud","relieved","silly","thankful","victorious","witty","zealous","broad","chubby","crooked","curved","deep","flat","high","hollow","low","narrow","round","shallow","skinny","square","steep","straight","wide","big","colossal","fat","gigantic","great","huge","immense","large","little","mammoth","massive","miniature","petite","puny","scrawny","short","small","tall","teeny","teeny-tiny","tiny","cooing","deafening","faint","hissing","loud","melodic","noisy","purring","quiet","raspy","screeching","thundering","voiceless","whispering","ancient","brief","early","fast","late","long","modern","old","old-fashioned","quick","rapid","short","slow","swift","young","bitter","delicious","fresh","greasy","juicy","hot","icy","loose","melted","nutritious","prickly","rainy","rotten","salty","sticky","strong","sweet","tart","tasteless","uneven","weak","wet","wooden","yummy","boiling","breeze","broken","bumpy","chilly","cold","cool","creepy","crooked","cuddly","curly","damaged","damp","dirty","dry","dusty","filthy","flaky","fluffy","freezing","hot","warm","wet","abundant","empty","few","full","heavy","light","many","numerous","sparse","substantial"]
const  nouns = ["aardvark","air","airplane","airport","alarm","alligator","almond","alphabet","ambulance","animal","ankle","ant","anteater","antelope","ape","apple","arm","armchair","arrow","asparagus","baby","back","backbone","bacon","badge","badger","bag","bagpipe","bait","bakery","ball","balloon","bamboo","banana","band","bandana","banjo","bank","baseball","basket","basketball","bat","bath","bathroom","bathtub","battery","battle","bay","beach","bead","bean","bear","beard","beast","beat","beauty","beaver","bed","bedroom","bee","beef","beetle","bell","belt","bench","beret","berry","bicycle","bike","bird","birthday","bite","blade","blanket","blob","block","blood","blouse","boar","board","bus","bush","butter","button","cabbage","cactus","cafe","cake","calculator","calendar","calf","camel","camera","camp","candle","canoe","canvas","cap","captain","car","card","cardboard","cardigan","carpenter","carrot","carton","cartoon","cat","caterpillar","cathedral","cattle","cauliflower","cave","CD","ceiling","celery","cello","cement","cemetery","cereal","boat","bobcat","body","bone","bonsai","book","bookcase","booklet","boot","border","bottle","bottom","boundary","bow","bowling","box","boy","brain","brake","branch","brass","bread","break","breakfast","breath","brick","bridge","broccoli","brochure","brother","brush","bubble","bucket","bug","building","bulb","bull","bulldozer","bun","butter","chain","chair","chalk","channel","character","cheek","cheese","cheetah","cherry","chess","chest","chick","chicken","children","chimpanzee","chin","chip","chive","chocolate","church","cicada","cinema","circle","city","clam","clarinet","click","clip","clock","closet","cloth","cloud","coach","coal","coast","coat","cobweb","cockroach","cocoa","coffee","coil","coin","coke","collar","college","colt","comb","comics","comma","computer","cone","copy","corn","cotton","couch","cougar","country","course","court","cousin","cow","crab","crack","cracker","crate","crayfish","crayon","cream","creek","cricket","crocodile","crop","crow","crowd","crown","crumb","cucumber","cup","cupboard","curtain","curve","cushion","cyclone","dad","daffodil","daisy","dance","daughter","deer","denim","dentist","desert","desk","dessert","detective","dew","diamond","dictionary","dinghy","dinosaur","dirt","dish","dock","dog","doll","dollar","door","dragon","dragonfly","drain","drawer","drawing","dress","dresser","drill","drink","drum","dryer","duck","duckling","dungeon","dust","eagle","ear","earth","earthquake","eel","egg","eggplant","elbow","elephant","energy","engine","equipment","eye","eyebrow","face","fact","factory","fairies","family","fan","fang","farm","fat","fear","feast","feather","feet","ferryboat","field","finger","fire","fireplace","fish","fist","flag","flame","flood","floor","flower","flute","fly","foam","fog","food","foot","football","forehead","forest","fork","fountain","fox","frame","freckle","freezer","frog","frost","fruit","fuel","fur","furniture","game","garage","garden","garlic","gas","gate","gear","ghost","giraffe","girl","glass","glove","glue","goal","goat","gold","goldfish","golf","gorilla","government","grape","grass","grasshopper","grater","grease","grill","grin","group","guitar","gum","gym","gymnast","hail","hair","haircut","hall","ham","hamburger","hammer","hamster","hand","handball","handle","hardware","harmonica","harmony","hat","hawk","head","headlight","heart","heat","hedge","height","helicopter","helmet","hem","hen","hill","hip","hippopotamus","hockey","hog","hole","home","honey","hood","hook","horn","horse","hose","hospital","house","hurricane","hyena","ice","icicle","ink","insect","instrument","iron","island","jacket","jade","jaguar","jail","jam","jar","jaw","jeans","jeep","jelly","jellyfish","jet","jewel","joke","journey","judge","judo","juice","jump","jumper","kangaroo","karate","kayak","kettle","key","keyboard","kick","kiss","kitchen","kite","kitten","knee","knife","knight","knot","lace","ladybug","lake","lamb","lamp","land","lasagna","laugh","laundry","leaf","leather","leek","leg","lemonade","leopard","letter","lettuce","library","lift","light","lightning","lily","line","lion","lip","lipstick","liquid","list","litter","lizard","loaf","lobster","lock","locket","locust","look","lotion","love","lunch","lynx","macaroni","machine","magazine","magic","magician","mail","mailbox","mailman","makeup","map","marble","mark","market","mascara","mask","match","meal","meat","mechanic","medicine","memory","men","menu","message","metal","mice","middle","milk","milkshake","mint","minute","mirror","mist","mistake","mitten","Monday","money","monkey","month","moon","morning","mosquito","motorboat","motorcycle","mountain","mouse","moustache","mouth","music","mustard","nail","name","napkin","neck","needle","nest","net","news","night","noise","noodle","nose","note","notebook","number","nut","oak","oatmeal","ocean","octopus","office","oil","olive","onion","orange","orchestra","ostrich","otter","oven","owl","ox","oxygen","oyster","packet","page","pail","pain","paint","pair","pajama","pamphlet","pan","pancake","panda","pansy","panther","pants","paper","parcel","parent","park","parrot","party","pasta","paste","pastry","patch","path","pea","peace","peanut","pear","pedestrian","pelican","pen","pencil","pepper","perfume","person","pest","pet","phone","piano","pickle","picture","pie","pig","pigeon","pillow","pilot","pimple","pin","pipe","pizza","plane","plant","plantation","plastic","plate","playground","plot","pocket","poison","police","policeman","pollution","pond","popcorn","poppy","porcupine","postage","postbox","pot","potato","poultry","powder","power","price","printer","prison","pumpkin","puppy","pyramid","queen","question","quicksand","quill","quilt","rabbit","radio","radish","raft","rail","railway","rain","rainbow","raincoat","rainstorm","rake","rat","ravioli","ray","recorder","rectangle","refrigerator","reindeer","relatives","restaurant","reward","rhinoceros","rice","riddle","ring","river","road","roast","rock","roll","roof","room","rooster","rose","rowboat","rubber","sack","sail","sailboat","sailor","salad","salmon","salt","sand","sandwich","sardine","sauce","sausage","saw","saxophone","scarecrow","scarf","school","scissors","scooter","scorpion","screw","screwdriver","sea","seagull","seal","seaplane","seashore","season","seat","second","seed","sentence","servant","shade","shadow","shallot","shampoo","shark","shears","sheep","sheet","shelf","shell","shield","ship","shirt","shoe","shoemaker","shop","shorts","shoulder","shovel","show","side","sidewalk","sign","signature","silk","silver","singer","sink","sister","skin","skirt","sky","sled","slippers","slope","smoke","snail","snake","sneeze","snow","snowflake","snowman","soap","soccer","sock","sofa","softball","soldier","son","song","sound","soup","soybean","space","spade","spaghetti","spark","sparrow","spear","speedboat","spider","spike","spinach","sponge","spoon","spot","sprout","spy","square","squash","squid","squirrel","stage","staircase","stamp","star","station","steam","steel","stem","step","stew","stick","stitch","stinger","stomach","stone","stool","stopsign","stopwatch","store","storm","story","stove","stranger","straw","stream","string","submarine","sugar","suit","summer","sun","sunshine","sunflower","supermarket","surfboard","surname","surprise","sushi","swallow","swamp","swan","sweater","sweatshirt","sweets","swing","switch","sword","swordfish","syrup","table","tabletop","tadpole","tail","target","tax","taxi","tea","teacher","team","teeth","television","tennis","tent","textbook","theater","thistle","thought","thread","throat","throne","thumb","thunder","thunderstorm","ticket","tie","tiger","tile","time","tire","toad","toast","toe","toilet","tomato","tongue","tooth","toothbrush","toothpaste","top","tornado","tortoise","tower","town","toy","tractor","traffic","trail","train","transport","tray","tree","triangle","trick","trip","trombone","trouble","trousers","truck","trumpet","trunk","t-shirt","tub","tuba","tugboat","tulip","tuna","tune","turkey","turnip","turtle","tv","twig","twilight","twine","umbrella","valley","van","vase","vegetable","veil","vein","vessel","vest","violin","volcano","volleyball","vulture","wagon","wall","wallaby","walnut","walrus","washer","wasp","waste","watch","watchmaker","water","wave","wax","weasel","weather","web","wedge","well","whale","wheat","wheel","wheelchair","whip","whisk","whistle","wilderness","willow","wind","wind chime","window","windscreen","wing","winter","wire","wish","wolf","woman","wood","wool","word","workshop","worm","wound","wren","wrench","wrinkles","wrist","xylophone","yacht","yak","yard"]
const adjLength = adjs.length
const nounLength = nouns.length
function randomName(){
  const randomAdj = adjs[Math.floor(Math.random()*adjLength)]
  const randomNoun = nouns[Math.floor(Math.random()*nounLength)]
  
  return randomAdj + "-" + randomNoun
}

var editorVal = ""
if (getID() == '') {
  const name = randomName()
  window.location.hash = name
  makeClean() // prevents page reload
  
  editorVal += "// Welcome to team " + name + "!\n//\n"
  editorVal += "// Share this link to collaborate:\n//\n"
  editorVal += "// woofjs.com/team#" + name + "\n\n"
  // editorVal += "// Press the Publish button to create a private project that nobody else can edit"
  editorVal += "setBackdropURL('./docs/images/nyc.jpg')\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n"
} 

var firepadRef = firebase.database().ref('/team/' + getID()); 
var firepad = Firepad.fromCodeMirror(firepadRef, editor, {
  defaultText: editorVal,
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
  const regEx = /  ((\w)*\.)?(ready|onKeyDown|onKeyUp|onMouseDown|onMouseUp|onMouseMove)/g   // matches any event indented with two spaces 
  var result;
  while ((result = regEx.exec(code)) !== null) {
    var lineNumber = code.substring(0, result.index).split('\n').length
    CodeMirror.commands.markGutter(editor, "warning", lineNumber, "We reccomend moving this " + result[3] + " event outside all loops and other events.")
  }
}

firepad.on('synced', function(isSynced) {
  // isSynced will be false immediately after the user edits the pad,
  // and true when their edit has been saved to Firebase.
  if (isSynced) {
    makeClean()
  }
  else {
    makeDirty() 
  }
});

// run the code (debounced) on every change to the editor 
editor.on("change", function(){
  debouncedRunCode()
  setTimeout(function() {WoofJSLint()}, 1000); 
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

  try {
    var result = Babel.transform(editor.getValue(), {
      presets: [['es2015', {'modules': false}]], // modules: false to remove strict mode
      retainLines: true
    })
    var code = result.code
    try {
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
        app.seenError = false
        if (error.type == "ImageLoadError") {
          app.error = {message: "There is a problem with your image URL: " + error.url, lineno: code.substring(0, code.indexOf(error.url)).split('\n').length}
        } else {
          app.error = event
        }
        
      });
      var script = document.createElement("script");
      script.type = "text/javascript";
      script.crossorigin = "anonymous"
      script.text = code
      document.getElementById('preview').contentDocument.body.appendChild(script)
    }
    catch (e) {
      app.seenError = false
      app.error = e;
    }
  }
  catch (e) {
    app.seenError = false
    app.error = e
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

var debouncedRunCode = Utils.debounce(runCode, 1000, false)