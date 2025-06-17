// this is a helper function that should only be called by runCode
function tryRunningCode(doc, codeValue, errorCallback) {
    try {
        var result = Babel.transform(codeValue, {
            presets: [['es2015', {'modules': false}]], // modules: false to remove strict mode
            retainLines: true
        })
        var code = result.code
	var script = doc.createElement("script");
	script.type = "text/javascript";
	script.crossorigin = "anonymous";
	script.text = code;
	doc.body.appendChild(script);
    }
    // this catch is mainly for the Babel.transform:
    //   if the user's code is incorrectly formatted, Babel will
    //   throw an error while trying to parse it
    // This approximates a compile-time error, while run time errors
    //   will need to be handled separately on the document's window
    //     (not done in this file since different uses have different ways of handling them)
    catch (e) {
	errorCallback(e)
    }
}

// this is the main function that should be used
//
// this runs the user's code in the provided document
//
// Parameters:
// doc - an HTML document that code should be run in.
//   It can be either the base document,
//   or the document component of an iframe (iframe.contentWindow.document)
// codeValue - a string containing all the user code to run.
// errorCallback - a function that will handle errors
//
// If codeValue is improperly formatted, codeValue will not be attached to doc,
//   and the errorCallback will be called with the Error event.
// This is not the only way the user's code can create errors! "Run-time" errors are not
//   handled in this process, and the document/window is responsible for catching and
//   processing those errors.
function runCode(doc, codeValue, errorCallback) {
    setTimeout(function() {
        // add a base tag to the page so it knows where to pull relative image urls
        var base = doc.createElement("base");
        base.href = document.baseURI
        doc.body.appendChild(base);
	
        // then we create a script tag with the woof code and add it to the page
        var script = doc.createElement("script");
        script.type = "text/javascript";
        script.src = "./woof.js";
        doc.body.appendChild(script);

        script.onload = function() {
	    // when the woof.js library loads, trigger load events (for Woof setup)
	    const evt = new Event('load', { bubbles: false, cancelable: false });
	    doc.defaultView.dispatchEvent(evt);
	    // then run the user code
            tryRunningCode(doc, codeValue, errorCallback);
        }
    }, 10)
}
    
