//Helper functions

var StoragePool = {
    add: (set, val) => {
        localStorage.setItem("OHTML_POOL_VAR:"+set, val);
    },
    get: (val) => {
        return localStorage.getItem("OHTML_POOL_VAR:"+val);
    }
}

var getElemAttrs = (elem) => {
    return [].slice.call(elem.attributes).map((attr) => {
        return {
            name: attr.name,
            value: attr.value
        }
    });
}

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


//Register defs tags
document.querySelectorAll('defs').forEach((obj) => {
    let get = obj.getAttribute("get");
    let set = obj.getAttribute("set");
    let value = obj.getAttribute("value");
    if(get != null && (set == null || value == null)) {
        let getter = document.createElement('div');
        getter.innerHTML = StoragePool.get(get);
        obj.appendChild(getter);
    }

    if(get == null && (set != null && value != null)) {
        StoragePool.add(set, value);
    }
});

//Register for each tags
document.querySelectorAll('foreach').forEach((obj) => {
    let iterator = obj.getAttribute("iterator");
    let type = obj.getAttribute("type");
    let idx = obj.getAttribute("index");
    let def = obj.getAttribute("as");
    if(iterator != "" && def != "" && type != "") {
        if(iterator in window && typeof eval(iterator) !== "undefined") {
            for(iter of eval(iterator)) {
                log(0, iter);
                document.querySelectorAll('sym').forEach((sym) => {
                    let attrs = getElemAttrs(sym);
                    if(attrs[0].name == def) {
                        let symDiv = document.createElement(type);
                        symDiv.className = def;
                        symDiv.id = iter;
                        symDiv.innerHTML = iter;
                        if(sym.parentElement.tagName.toLowerCase() == obj.tagName.toLowerCase()) {
                            sym.appendChild(symDiv);
                        } else {
                            log(2, "Symbolic object tags must only be used in a foreach loop!");
                        }
                    }
                });
            }
        } else {
            log(2, "Error registering for-each with iterator " + iterator + "! Array not defined!")
        }
    } else {
        log(2, "Error registering for-each with iterator " + iterator + "!")
    }

    if(idx != null || idx != "" || typeof idx !== "undefined") {
        log(2, "Index property not needed! Index used: " + idx)
    }


});