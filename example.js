//testing iterating over an array
const entries = [
	'1',
	'2',
	'3'
];

const pies = [
	'apple',
	'blueberry',
	'cherry'
];

const examples = [
	'example0',
	'example1',
	'example2',
	'example3'
];

function generateRandomPie() {
	const rand = 'pie_' + Math.floor(Math.random() * 100) + 1;
	pies.push(rand);
}

//setup the parser
parseOHTML(document.body, {

	getStateTesting() {
		alert(StateManager.getState('testing'));
	},

	setStateTesting() {
		StateManager.setState('testing', 'abc');
		alert(StateManager.getState('testing'));
	},

	addArray() {
		generateRandomPie();
	},

	popArray() {
		pies.pop();
	},

	testing: "",
	some_var: "some_other_value",
	somethingElse: true

}, false);

