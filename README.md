## oHTML
- A work in progress objectified html library.
- This library is a WORK IN PROGRESS. Please keep that in mind.

### Features
- foreach tag
- if / else tag
- switch tag
- defs (declaration) tag
- function tag

### Usage
- Import in the `<head>` section of your html file as the last import using `defer`.
- Use in your html!

### Important To Note
- When attempting to use html declared objects, ensure you wrap your javascript in `window.onload`!

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