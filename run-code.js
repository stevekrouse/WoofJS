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
    catch (e) {
	errorCallback(e)
    }
}

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
	    // when the woof.js library loads, run the user code
	    const evt = new Event('load', { bubbles: false, cancelable: false });
	    doc.defaultView.dispatchEvent(evt);
            tryRunningCode(doc, codeValue, errorCallback);
        }
    }, 10)
}
    
