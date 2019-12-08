var drinks = ['coke', 'water', 'sprite', 'dew'];
var pies = ['chocolate', 'banana', 'pumpkin', 'lemon'];

var somevalue = "testing";
var someothervalue = "cool";

function testing() {
    return false;
}

//Must use onload wrapper to retreive any needed ohtml defs
window.onload = () => {

    let result = FunctionPool.run("myFunction", "nick", 17);
    let other = FunctionPool.run("otherFunction", "repeat this message");
    //console.log(StoragePool.get("test"));
    //alert(StoragePool.get("test"));
}