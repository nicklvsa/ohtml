let todos = [];

parseOHTML(document.body, {

    content: "",

    addTodo() {
        console.log(StateManager.getState("content"));
        todos.push(StateManager.getState("content"));
    },

    clearTodos() {
        /*
            this is a strange way of emptying array, but pop is what updates the array state
            TODO: update the state manager to use arrays instead of defining them outside of the state
        */
        while(todos.length > 0) todos.pop(); 
    }
});