var drinks = ['coke', 'water', 'sprite', 'dew'];
var pies = ['chocolate', 'banana', 'pumpkin', 'lemon'];
var phones = ['apple', 'samsung', 'google', 'htc'];

var somevalue = "testing";
var someothervalue = "cool";

//testing the ability to call functions in ohtml
function testing() {
    return false;
}

function addToPies() {
    let rand = "pie" + Math.floor(Math.random() * 100) + 1;
    pies.push(rand);
}

function someCallback(response) {
    alert(response);
}

//Must use onload wrapper to retreive any needed ohtml defs
window.onload = () => {

    let result = FunctionPool.run("myFunction", "nick", 17);
    let other = FunctionPool.run("otherFunction", "repeat this message");
    //console.log(StoragePool.get("test"));
    //alert(StoragePool.get("test"));
}