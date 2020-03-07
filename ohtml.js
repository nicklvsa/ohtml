let GLOB_DATA;

const handleString = (input) => new Function('data', `
    return \`${input}\`
`);

const out = (severity, input) => {
    switch (severity) {
        case 0:
            console.log('[OHTML]: (Log) - ' + input);
            break;
        case 1:
            console.warn('[OHTML]: (Warn) - ' + input);
            break;
        case 2:
            console.error('[OHTML]: (Error) - ' + input);
            break;
        default:
            console.log('[OHTML] (Log) - ' + input);
            break;
    }
};

var parseOHTML = (frag, data, useNodes = true) => {

    //setup empty ref
    let checker = {ref: new Object()};
    const beginner = '%';

    GLOB_DATA = data;

    if (useNodes) {
        const iter = document.createNodeIterator(frag, NodeFilter.SHOW_TEXT, null);
        const nodes = {
          *[Symbol.iterator]() {
              const now = iter.nextNode();
              //let content = iter.nextElementSibling;
              yield now ? { next: now, done: false } : { done: true };
          }
        };
  
        for (node of nodes) {
           // console.log(node.next);
        }
    }  

    const modifierTypes = [
        'render',
        'set'
    ];

    let parseAttrModifier = (render) => {
        if (render != null) {
            for (mod of modifierTypes) {
                if (render.includes(mod)) {

                    const args = [];

                    const modifierType = render.substring(0, render.indexOf('(')).trim();
                    const argString = render.substring(render.indexOf('(') + 1, render.indexOf(')')).trim();
    
                    if (argString.includes(',')) {
                        const argStrings = argString.split(',');
                        for (arg of argStrings) {
                            args.push(arg);
                        }
                    } else {
                        args.push(argString);
                    }

                    switch (modifierType) {
                        case "render":
                            if (args.length == 1) { //args only contains a single element
                                const element = "<" + args + " ohtml>%s</" + args + ">"
                                return element;
                            }
                            return null;
                        case "set": //TODO: implement
                            return null;
                        default:
                            return null;
                    }
                }
            }
        }
    };

    let parseDataHolder = (html) => {
        if (html != null) {
            if (html.includes('$') && html.includes('{') && html.includes('}')) {
                return html.substring(html.indexOf('${') + 2, html.indexOf('}'));
            }
        }
    };

    let getElemAttrs = (elem) => {
        return [].slice.call(elem.attributes).map((attr) => {
            return {
                name: attr.name,
                value: attr.value
            }
        });
    };

    let bindToAttribute = (elem, binder) => {
        const boundTo = binder.split(':')[1];
        const attr = elem.getAttribute(beginner + binder);
        if (GLOB_DATA[attr]) {
            elem.setAttribute(boundTo, GLOB_DATA[attr]);
            elem.removeAttribute(beginner + binder);
        } else {
            elem.setAttribute(boundTo, "");
            elem.removeAttribute(beginner + binder);
        }
        return elem;
    }

    let startParseIf = (looper, statement, elem, callback) => {
        looper.ref = setInterval(() => {
            if (GLOB_DATA[statement]) {
                const query = GLOB_DATA[statement];
                callback(query, elem);
            }
        }, 200);
    };

    let stopParseIf = (parserLoop) => {
        clearInterval(parserLoop.ref);
    };

  frag.querySelectorAll('*').forEach((elem) => {
    elem.getAttributeNames().forEach((name) => {

        if (name.startsWith(':')) { //string binding
            const attr = name.substring(1);
            if (GLOB_DATA[attr] != null) {
                if (elem instanceof HTMLInputElement) {
                    elem.addEventListener('keyup', (evt) => {
                        if (evt != null) {
                            GLOB_DATA[attr] = elem.value;
                        }
                    });
                } else {
                    out(2, "Could not bind to element that is not of type input");
                }
            }
            //elem.setAttribute(name.substring(1), handleString(elem.getAttribute(name))(data));
            //elem.removeAttribute(name);
            
        } else if (name.startsWith('@')) { //action binding

            elem.addEventListener(name.substring(1), GLOB_DATA[elem.getAttribute(name)]);
            elem.removeAttribute(name);

        } else if (name.startsWith('?')) { //conditional binding

            const attr = name.substring(1);
            if (GLOB_DATA[attr]) {
                elem.setAttribute(attr, '');
            }
            elem.removeAttribute(name);

        } else if (name.startsWith('%')) { //keyword binding

            const customForModifier = '->';
            const attr = name.substring(1).trim();

            if (attr.includes("bind:")) {
                const response = bindToAttribute(elem, attr);
                console.log(response);
            }

            switch (attr) {
                case "if":

                    //TODO: add state updating
                    if (!GLOB_DATA[elem.getAttribute(beginner + 'if')]) {
                        stopParseIf(checker);
                        elem.style = "display:none;";
                        //elem.remove();
                    }

                    startParseIf(checker, elem.getAttribute(beginner + 'if'), (query) => {
                        elem.style = "display:;";
                        //console.log(elemResponse);
                    });

                    
                case "for":

                   const loop = elem.getAttribute(beginner + 'for');
                   if (loop != null) {
                        if (loop.includes(customForModifier)) {
                            let outputs = [];
                            let backupDom;

                            const elemData = elem.textContent.trim();

                            const validIterator = loop.split('->')[0].split('of')[0].trim();
                            const validArray = loop.split('->')[0].split('of')[1].trim();

                            const modifier = loop.split('->')[1].trim();

                            const iteratorTxtVar = parseDataHolder(elemData); 
                            const tag = parseAttrModifier(modifier);

                            let attrs = getElemAttrs(elem);
                            if (attrs[0] !== "ohtml") {
                                backupDom += elem.innerHTML.replace('${'+iteratorTxtVar+'}', '');
                                elem.textContent = "";
                            }

                            for (let iter of eval(validArray)) {
                                outputs.push(tag.replace('%s', iter));
                            }

                            if (iteratorTxtVar == validIterator) {
                                elem.textContent = elem.textContent.replace('${'+iteratorTxtVar+'}', '');
                                elem.innerHTML += backupDom.replace('undefined', '').trim();
                                for (let out of outputs) {
                                    elem.innerHTML += out;
                                }
                            } else {
                                elem.textContent = elem.textContent.replace('${'+iteratorTxtVar+'}', '');
                                out(2, 'Iterator did not match the replacer in for loop!');
                            } 

                            
                            eval(validArray).push = function() {
                                
                                Array.prototype.push.apply(this, arguments);

                                for (let iter of eval(validArray)) {
                                    outputs = [];    
                                    outputs.push(tag.replace('%s', iter));
                                }

                                if (iteratorTxtVar == validIterator) {
                                    for (let out of outputs) {
                                        elem.innerHTML += out;
                                    }
                                } else {
                                    out(2, 'Iterator did not match the replacer in for loop!');
                                } 
                            };

                            eval(validArray).pop = function() {

                                Array.prototype.pop.apply(this, arguments);

                                /* 
                                    TODO: allow other elements to be inside of a for tag and ignore them when popping
                                */

                                elem.innerHTML = "";

                                for (let iter of eval(validArray)) {
                                    outputs = [];
                                    elem.innerHTML += tag.replace('%s', iter);
                                }
                            };
                            
                        }
                   }
                case "while": //TODO: implement
                    break;
                case "switch": //TODO: implement
                    break;
                default:
                    break;
            }
        }
    });
  });
};

var StateManager = {
    getState: (stateVar) => {
        return GLOB_DATA[stateVar];
    },
    setState: (stateVar, value) => {
        GLOB_DATA[stateVar] = value;
    }
};


//TODO: finish template parsing
/*var tmpl = (id) => {
    const template = document.getElementById(id);
    return (data) => {
        const clone = template.content.cloneNode(true);
        parseOHTML(clone, data);
        return clone;
    };
};*/