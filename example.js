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
	{name: 'example00', content: 'this is some content'},
	{name: 'example01', content: 'this is some more content'},
	{name: 'example02', content: 'hello world!'},
	{name: 'example03', content: 'bye, world!'}
];

const lists = [
	{id: '00', info: 'some info'},
	{id: '01', info: 'some more info'},
	{id: '02', info: {
		testing: 'hi', more: {
			another: 'hello'
		}
	}}
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
	ex_placeholder: "some value",
	somethingElse: true

}, false);

