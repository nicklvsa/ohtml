## oHTML
- A work in progress objectified html library.
- This library is a WORK IN PROGRESS. Please keep that in mind.
- NOTE: the dom CANNOT be dynamically updated. For example: when looping through an array, after the loop has completed, you cannot add a value to the array and have the dom respond.

### Features
- foreach tag
- if / else tag
- switch tag
- defs (declaration) tag
- function tag (WIP)
- selector tag (WIP)

### Usage
- Import in the `<head>` section of your html file as the last import using `defer`.
- Use in your html!

### Important To Note
- When attempting to use html declared objects, ensure you wrap your javascript in `window.onload`!

### Known Issues
- When referring to an argument declared like: `<function name="someFunc" args="arg0,arg1">`, the javascript interpreter does not know that it was declared. The console will throw a ReferenceError. Temporary fix: `<script nomodule ohtml></script>` (Add the nomodule property to the `<function>` tag's `<script>` children)

### Examples
- HTML Example:
```html
<head>

    <script defer type="text/javascript" src="something.js"></script>
    <script defer type="text/javascript" src="somethingelse.js"></script>

    <!-- Load oHTML library last -->
    <script defer type="text/javascript" src="ohtml.js"></script>
</head>
<body>

    <!-- Use oHTML tags and write your html page -->

</body>

```
- Javascript Example (something.js)
```javascript

//setup declarations
var someArray = ['object0', 'object1', 'object2'];

window.onload = () => {

   //perform ohtml related things here

}
```

### More Info
- For more information and examples, see `test.html` and `test.js`