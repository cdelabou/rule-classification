import C4dot5, { Leaf, Node, matches, displayTree } from "./c4dot5";
import importCSV from "./csv"

const SUNNY = 0, OVERCAST = 1, RAIN = 2;
const WEAK = 0, STRONG = 1;

const YES = "Play", NO = "Don't play";

const SETOSA = "setosa", VIRGINICA = "virginica", VERSICOLOR = "versicolor";

export default async function test(filename: string, compareTree: Node) {
	const { dataset, mapping } = await importCSV(filename);

	const tree = C4dot5(dataset);

	// Show success rate of first set
	let success = dataset.reduce((acc, datacase) => matches(datacase, tree) ? acc + 1 : acc, 0);	
	console.log(`matches ${success} out of ${dataset.length} (${(success/dataset.length*100).toFixed(2)}%)`)
	
	// Then success rate of second set
	success = dataset.reduce((acc, datacase) => matches(datacase, compareTree) ? acc + 1 : acc, 0);
	console.log(`other tree matches ${success} out of ${dataset.length} (${(success/dataset.length*100).toFixed(2)}%)`)
	
	// Then display tree
	console.log(displayTree(tree as Node))
}


test("iris", {
	divideBy: "petal width",
	threshold: 0.8,
	left: { class: SETOSA },
	right: {
		divideBy: "petal length",
		threshold: 4.75,
		left: {
			divideBy: "sepal length",
			threshold: 4.95,
			left: {
				divideBy: "sepal width",
				threshold: 2.45,
				left: { class: VERSICOLOR },
				right: { class: VIRGINICA }
			},
			right: { class: VERSICOLOR }
		},
		right: {
			divideBy: "sepal length",
			threshold: 7,
			left: {
				divideBy: "sepal width",
				threshold: 3.25,
				left: { class: VIRGINICA },
				right: { class: VIRGINICA }
			},
			right: { class: VIRGINICA }
		}
	}
})
.then(() => test("weather", {
	divideBy: "outlook",
	threshold: SUNNY,
	left: {
		divideBy: "humidity",
		threshold: 75,
		left: { class: YES },
		right: { class: NO }
	},
	right: {
		divideBy: "outlook",
		threshold: OVERCAST,
		left: { class: YES },
		right: {
			divideBy: "wind",
			threshold: WEAK,
			left: { class: NO },
			right: { class: YES }
		}
	}
}))
.catch(console.error);
