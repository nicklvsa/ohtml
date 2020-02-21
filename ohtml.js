//Helper functions
if(true) { /* Used to set the scope of oHTML */

//private objects used by ohtml
let FUNC_POOL = {};
let LOCAL_POOL = {};

//TODO: Implement usage (not being used for the moment)
let OPTIONS = {};

//TODO: Implement custom properties that aren't able to be parsed
//let PROPS_POOL = ['typography'];
var StoragePool = {
    add: (set, val) => {
        localStorage.setItem("OHTML_POOL_VAR:"+set, val);
    },
    get: (val) => {
        return localStorage.getItem("OHTML_POOL_VAR:"+val);
    }
}

//gives public usage to global scope to the FUNC_POOL
var FunctionPool = {
    run: (name, ...args) => {
        return FUNC_POOL[name].apply(this, args);
    }
}

//TODO: Implement usage (not being used for the moment)
var OptionSet = {
    add: (optionsList) => {
        for(const [setting, value] of Object.entries(optionsList)) {
            if(setting != null && value != null) {
                OPTIONS[setting] = value;
            }
        }
    }
}

//custom logger function for quicker usage of logs, warnings, and errors
var log = (severity, obj) => {
    switch(severity) {
        case 0:
            //log
            console.log("[LOG]: " + obj);
            break;
        case 1:
            //warning
            console.warn("[WARN]: " + obj);
            break;
        case 2:
            //error
            console.error("[ERROR]: " + obj);
            break;
        default:
            break;
    }
}

//returns object with name and value of the elem argument's attributes
let getElemAttrs = (elem) => {
    return [].slice.call(elem.attributes).map((attr) => {
        return {
            name: attr.name,
            value: attr.value
        }
    });
}

//checks to see if a provided css property is valid and exists
let isValidCSS = (prop) => {
    return (prop in document.body.style);
}

//checks to see if an element with a class exists
let hasClass = (name) => {
    return document.body.className.match(name);
}

let childOf = (child, parent) => {
    while((child = child.parentNode) && child !== parent);
    return !!child;
}

//checks to see if an element with an id exists
let hasID = (id) => {
    let elem;
    if(!id.startsWith("#")) {
        elem = document.getElementById(id);
    } else {
        elem = 'undefined';
    }
    return (typeof(elem) != 'undefined' && elem != null);
}

//returns the unsageStr argument with the replacements done
let makeSafe = (unsafeStr) => {
    return unsafeStr.replace("alert(", "").replace("prompt(", "").replace("confirm(", "").replace("eval(", "");
}

//will take any escaped char and convert it back to a normal char
let unescapeEntities = (input) => {
    let entities = [
        ['amp', '&'],
        ['apos', '\''],
        ['#x27', '\''],
        ['#x2F', '/'],
        ['#39', '\''],
        ['#47', '/'],
        ['lt', '<'],
        ['gt', '>'],
        ['nbsp', ' '],
        ['quot', '"']
    ];
    for (var i = 0, max = entities.length; i < max; ++i) input = input.replace(new RegExp('&'+entities[i][0]+';', 'g'), entities[i][1]);
    return input;
}


//Register defs tags
document.querySelectorAll('defs').forEach((obj) => {
    let get = obj.getAttribute("get");
    let set = obj.getAttribute("set");
    let type = obj.getAttribute("scope");
    let value = obj.getAttribute("value");
    if(get != null && type != null && (set == null || value == null)) {
        let getter = document.createElement('div');
        if(type == "global") {
            getter.innerHTML = StoragePool.get(get);
        }
        if(type == "local") {
            getter.innerHTML = LOCAL_POOL[get];
        }
        obj.appendChild(getter);
    }
    if(get == null && (set != null && value != null && type != null)) {
        switch(type) {
            case "global":
                StoragePool.add(set, value);
            break;
            case "local":
                LOCAL_POOL[set] = value;
            break;
            default:
                //default decl global var
                StoragePool.add(set, value);
            break;
        }
    }
});

//Register foreach tags
document.querySelectorAll('foreach').forEach((obj) => {
    let iterator = obj.getAttribute("iterator");
    let type = obj.getAttribute("type");
    let idx = obj.getAttribute("index");
    let def = obj.getAttribute("as");
    if(iterator != "" && def != "" && type != "") {
        if(iterator in window && typeof eval(iterator) !== "undefined") {
            for(iter of eval(iterator)) {
                //TODO: implement @(_VAR_NAME_)
                /*obj.childNodes.forEach((objChild) => {
                    if(objChild.nodeValue != null) {
                        if(objChild.nodeValue.trim().startsWith("@("))  {
                            let getter = objChild.nodeValue.trim().substring(objChild.nodeValue.trim().indexOf("@(")+2, objChild.nodeValue.trim().indexOf(")")).trim();
                            log(0, objChild.nodeValue.trim().substring(getter.length+2));
                            if(objChild.nodeValue.trim().substring(getter.length+2) == ")") {
                                if(getter.toLowerCase() == def.toLowerCase()) {
                                    obj.appendChild(document.createTextNode(iter));
                                } else {
                                    log(2, "Cannot find iterator definition: " + getter);
                                }
                            } else {
                                log(2, "Could not find end of @property");
                            }
                        }
                    }
                });*/
                document.querySelectorAll('each').forEach((sym) => {
                    let attrs = getElemAttrs(sym);
                    if(attrs[0].name == def) {
                        if(type != "script" && !type.includes("script") && !type.includes("applet") && !type.includes("embed")) {
                            let symDiv = document.createElement(type);
                            symDiv.className = def;
                            symDiv.id = iter;
                            symDiv.innerHTML = document.createTextNode(iter).data;
                            if(childOf(sym, obj)) {
                                sym.appendChild(symDiv);
                            } else {
                                log(2, "Symbolic object tags must only be used in a foreach loop!");
                            }
                        } else {
                            log(2, "You cannot use script tags as an sym output type!");
                        }
                    }
                });
            }
        } else {
            log(2, "Error registering foreach with iterator " + iterator + "! Array not defined!")
        }
    } else {
        log(2, "Error registering foreach with iterator " + iterator + "!")
    }

    if(idx != null && idx != "" && typeof idx !== "undefined") {
        log(2, "Index property not needed! Index used: " + idx)
    }
});

//Register if/else statements
//TODO: Implement elseif tags
document.querySelectorAll('if').forEach((obj) => {
    document.querySelectorAll('else').forEach((elseStmt) => elseStmt.setAttribute("style", "display:none;"));
    let query = obj.getAttribute("query");
    if(query != "") {
        query = makeSafe(query.replace(" ", ""));
        if(eval(query) !== false) {
            console.log("Query is true: " + query)
        } else {
            obj.childNodes.forEach((ifChilds) => {
                if(ifChilds.nodeName.toLowerCase() !== "else") {
                   ifChilds.style = "display:none;";
                } else {
                    ifChilds.style = "display:;";
                }
            });
            document.querySelectorAll('else').forEach((elseObj) => {
                if(elseObj.parentElement.tagName == obj.tagName) {
                    elseObj.setAttribute("style", "display:;");
                } else {
                    log(2, "Else tag must be used within an if tag!");
                }
            });
        }
    }
});

//Register switch/case tags
document.querySelectorAll('switch').forEach((obj) => {
    let hasCase = false;
    let on = obj.getAttribute('on');
    if(on != "") {
        on = makeSafe(on.replace(" ", ""));
        if(obj.hasChildNodes()) {
            obj.childNodes.forEach((node) => {
                if(node.nodeName.toLowerCase() == "case" || node.nodeName.toLowerCase() == "default") {
                    node.style = "display:none;";
                    for(attr of node.attributes) {
                        if(eval(on) == attr.nodeName) {
                            node.style = "display:;";
                            hasCase = true;
                        }   
                    }
                } else {
                    node.style = "display:none;";
                }
                if(node.nodeName.toLowerCase() == "default" && !hasCase) {
                    node.style = "display:;";
                } 
            });
        } else {
            log(2, "Switch tag does not contain any children!");
        }
    }
});

//Register function tags
document.querySelectorAll("function").forEach((obj) => {
    let name = obj.getAttribute("name");
    let args = obj.getAttribute("args");
    if(name != "") {
        if(obj.hasChildNodes()) {
            obj.childNodes.forEach((node) => {
                node.style = "display:none;";
                if(node.nodeName.toLowerCase() == "script" && "ohtml" in node.attributes) {
                    //surround the javascript in try catch for error handling
                    let js = "try{";
                    //js += "window.onerror=function(){return true;}";
                    js += `function byref(ref, changeFunc) {
                        if(changeFunc instanceof Function) {
                            ref.ref = null;
                            if(typeof changeFunc() !== undefined) {
                                ref.ref = changeFunc();
                            }
                        }
                    }`;
                    js += unescapeEntities(node.innerHTML);
                    js += "}catch(except){}";
                    //log(1, js)

                    node.innerHTML = js;
                    if(args == "" || args == null) {
                        FUNC_POOL[name] = new Function("", js);
                        
                    } else {
                        FUNC_POOL[name] = new Function(args, js);
                    }
                }   
            });
        }
    }
});

//Register selector tags
document.querySelectorAll('selector').forEach((obj) => {
    let select = obj.getAttribute("select");
    let method = obj.getAttribute("method");
    if(method != "" && select != "") {
        if(obj.hasChildNodes()) {
            if(select.toLowerCase() == "self") {
                let parent = obj.parentNode;
                obj.childNodes.forEach((child) => {
                    if(isValidCSS(child.nodeName.toLowerCase())) {
                        if(method == "override") {
                            parent.setAttribute("style", (parent.getAttribute("style")+child.nodeName.toLowerCase()+":"+child.getAttribute("is")+" !important"+";").replace("null", ""));
                        } else if(method == "extend") {
                            if("override" in child.attributes) {
                                parent.setAttribute("style", (parent.getAttribute("style")+child.nodeName.toLowerCase()+":"+child.getAttribute("is")+" !important"+";").replace("null", ""));
                            } else {
                                parent.setAttribute("style", (parent.getAttribute("style")+child.nodeName.toLowerCase()+":"+child.getAttribute("is")+";").replace("null", ""));
                            }
                        } else {
                            log(2, "Invalid ancestor attribute detected! (only extend and override allowed)!");
                        }
                    }
                });
            } else {
                //specific id or class was set, not self (parent element)
                let selectorType = select.charAt(0);
                if(selectorType == "#") {
                    if(hasID(select)) {
                        let parent = document.querySelector(select);
                        obj.childNodes.forEach((child) => {
                            if(isValidCSS(child.nodeName.toLowerCase())) {
                                for(attr of child.attributes) {
                                    if(attr.nodeName == "override") {
                                        parent.setAttribute("style", (parent.getAttribute("style")+child.nodeName.toLowerCase()+":"+child.getAttribute("is")+" !important"+";").replace("null", ""));
                                    } else {
                                        parent.setAttribute("style", (parent.getAttribute("style")+child.nodeName.toLowerCase()+":"+child.getAttribute("is")+";").replace("null", ""));
                                    }
                                }
                            }
                        });
                    }
                } else if(selectorType == ".") {
                    if(hasClass(select)) {
                        let parent = document.querySelector(select);
                        obj.childNodes.forEach((child) => {
                            if(isValidCSS(child.nodeName.toLowerCase())) {
                                for(attr of child.attributes) {
                                    if(attr.nodeName == "override") {
                                        parent.setAttribute("style", (parent.getAttribute("style")+child.nodeName.toLowerCase()+":"+child.getAttribute("is")+" !important"+";").replace("null", ""));
                                    } else {
                                        parent.setAttribute("style", (parent.getAttribute("style")+child.nodeName.toLowerCase()+":"+child.getAttribute("is")+";").replace("null", ""));
                                    }
                                }
                            }
                        });
                    } else {
                        console.log("does not have class");
                    }
                } else {
                    console.log("Error - selector type invalid: " + select);
                }
            }   
        }        
    }
});

// TODO - allow state updates to update dom with dynamic content
function _state(func, callback, ...data) {
    if (callback instanceof Function) {
        let script, tag;
        script = document.createElement("script");
        script.type = 'text/javascript';
        script.innerHTML = `
            try {
                let response = `+func+`();
                callback(response);
            } catch(except) {}
        `;
        tag = document.getElementsByTagName("script")[0];
        tag.parentNode.insertBefore(script, 'tag');
        //window.location.reload();
    }
}


} /* End scope decl of oHTML */