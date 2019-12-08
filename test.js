var drinks = ['coke', 'water', 'sprite', 'dew'];
var pies = ['chocolate', 'banana', 'pumpkin', 'lemon'];

var somevalue = "testing";
var someothervalue = "cool";

function testing() {
    return false;
}

//Must use onload wrapper to retreive any needed ohtml defs
window.onload = () => {

    let result = FunctionPool.exec("myFunction", "nick", 17);
    let other = FunctionPool.exec("otherFunction", "repeat this message");
    //console.log(StoragePool.get("test"));
    //alert(StoragePool.get("test"));
}