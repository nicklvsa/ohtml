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

function generateRandomPie() {
	const rand = 'pie_' + Math.floor(Math.random() * 100) + 1;
	pies.push(rand);
}

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
	testing: "test",
	somethingElse: true
}, false);

