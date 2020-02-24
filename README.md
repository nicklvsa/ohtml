# OHTML Beta

### Important Info

#### Usage
- link to the library javascript file first, defer all other scripts

```html
<script src="ohtml.js"></script>

<script defer src="other.js"></script>
<script defer src="another.js"></script>
```

- setup the environment in custom javascript file

```javascript

let items = [
    'some item',
    'another item',
    'the last item'
];

parseOHTML(/*DOM Container - usually `document.body`*/document.body, {
    someFunc() {
        //some action
    },
    anotherFunc() {
        //another action
    },
    someProp: false,
    anotherProp: "hi"
}, false);
```

#### Features
- action events

```html
    <button type="button" @click="someFunc">Click me!</button>
    <form @submit="anotherFunc"></form>
```

- binding events
- bindings can only be bound to inputs

```html
    <!-- This will bind input to anotherProp variable -->
    <input type="text" placeholder="Enter stuff here" :anotherProp />
```

- logical events

```html
    <div %if="someProp">
        <h3>This will be hidden</h3>
        <p>because `someProp` = false</p>
    </div>
```

```html
    <!-- render(li) = iterate over items and render each index as an li tag -->
    <ul %for="items of item -> render(li)">
        ${item}
    </ul>
```

- Javascript Features

```javascript
    /*
        Executing push or pop on an array will update the dom in real time!
        NOTE: all other array features will work but will NOT update in real time (i.e shift). 
        These are being worked on.
    */
   items.pop();
   items.push('some cool new item');


    /*
        StateManager will modify the value of the current data state.
    */
    const value = StateManager.getState('anotherProp');
    StateManager.setState('anotherProp', 'something new');
```
