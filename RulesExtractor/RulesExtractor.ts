import { Datacase } from "./types";

interface Divider {
	divideBy: string;
	threshold: number;
}

export interface Node extends Divider {
	left: Leaf | Node;
	right: Leaf | Node;
}

export interface Leaf {
	class: string;
}


function computeEntropy(dataset: Datacase[]): number {
	let entropy = 0;

	let classes = getClassesCounts(dataset);

	// Helped from https://sefiks.com/2018/05/13/a-step-by-step-c4-5-decision-tree-example/
	for (let name in classes) {
		let p = classes[name] / dataset.length
		entropy -= p * Math.log2(p);
	}

	return entropy;
}

function getClassesCounts(dataset: Datacase[]): {[classValue: string]: number} {
	return dataset.reduce<{[classValue: string]: number}>((previous, datacase) => {
		if (!previous.hasOwnProperty(datacase.class)) {
			previous[datacase.class] = 0;
		}

		previous[datacase.class] += 1;
		return previous;
	}, {});
}

function computeGainRatio(dataset: Datacase[], divider: Divider, globalEntropy: number) {
	// Compute gain for given threshold and item
	const leftSet = dataset.filter((datacase) => datacase.items[divider.divideBy] <= divider.threshold);
	const rightSet = dataset.filter((datacase) => datacase.items[divider.divideBy] > divider.threshold);
	
	const gain = globalEntropy - (
		(leftSet.length / dataset.length) * computeEntropy(leftSet) +
		(rightSet.length / dataset.length) * computeEntropy(rightSet)
	);
	
	// Compute gain ratio using splitinfo
	const splitInformation = - (
		(leftSet.length / dataset.length) * Math.log2(leftSet.length / dataset.length) +
		(rightSet.length / dataset.length) * Math.log2(rightSet.length / dataset.length)
	);

	return gain / splitInformation;
}

// https://sefiks.com/2018/05/13/a-step-by-step-c4-5-decision-tree-example/
function findDivider(dataset: Datacase[], usedAttributes: string[]): Divider {
	const attributes = dataset.reduce((acc, datacase) => {
		for (let item in datacase.items) {
			// Unused item
			if (acc.indexOf(item) === -1 && usedAttributes.indexOf(item) === -1) {
				acc.push(item);
			}
		}
		
		return acc;
	}, new Array<string>());

	const entropy = computeEntropy(dataset);

	const divider = {
		divideBy: "",
		threshold: 0,
	};
	let maxGainRatio = -Infinity;

	attributes.forEach(attr => {
		// Sort dataset with this attribute
		dataset.sort((a, b) => a.items[attr] - b.items[attr]);
			
		// Test all threshold
		let threshold = -Infinity;

		dataset.forEach((datacase) => {
			// Pass already tested threshold
			if (datacase.items[attr] == threshold) {
				return;
			}

			threshold = datacase.items[attr];

			// Compute gain for given threshold and item
			const currentDivider = {
				divideBy: attr,
				threshold
			}
			
			const gainRatio = computeGainRatio(dataset, currentDivider, entropy);


			// If gain exceed already used gain
			if (gainRatio > maxGainRatio) {
				divider.divideBy = attr;
				divider.threshold = threshold;

				maxGainRatio = gainRatio;
			}
		});
	});
	

	return divider;
}

export function matches(datacase: Datacase, root: Node | Leaf) {
	while (root.hasOwnProperty("divideBy")) {
		const node: Node = root as Node;
		if (datacase.items[node.divideBy] <= node.threshold) {
			root = node.left;
		} else {
			root = node.right;
		}
	}

	return (root as Leaf).class == datacase.class;
}
export function displayTree(node: Node, depth = 0) {
	let spaces = "\t".repeat(depth);

	if (node.left.hasOwnProperty("class")) {
		console.log(`${spaces}${node.divideBy} <= ${node.threshold} : ${(node.left as Leaf).class}`);
	} else {
		console.log(`${spaces}${node.divideBy} <= ${node.threshold} :`);
		displayTree(node.left as Node, depth + 1);
	}

	if (node.right.hasOwnProperty("class")) {
		console.log(`${spaces}${node.divideBy} > ${node.threshold} : ${(node.right as Leaf).class}`);
	} else {
		console.log(`${spaces}${node.divideBy} > ${node.threshold} :`);
		displayTree(node.right as Node, depth + 1);
	}
}
export default function C4dot5(dataset: Datacase[], usedAttributes: string[] = []): Leaf | Node {
	// If all data are of same class
	if (dataset.every(d => d.class === dataset[0].class)) {
		if (dataset.length === 0) {
			console.warn("found leaf with 0 outcomes");
			return {
				class: "<none>"
			}
		}

		// Return a leaf with given class
		return {
			class: dataset[0].class
		}
	}

	// Find most adequate dividing node
	let divider = findDivider(dataset, usedAttributes);

	// Get two subsets
	const left = dataset.filter((data) => data.items[divider.divideBy] <= divider.threshold);
	const right = dataset.filter((data) => data.items[divider.divideBy] > divider.threshold);
	const attributes = usedAttributes.concat(divider.divideBy);

	if (left.length > 0 && right.length > 0) {
		// Divide according to node and return node
		return {
			divideBy: divider.divideBy,
			threshold: divider.threshold,
			left: C4dot5(
				left,
				usedAttributes.concat(divider.divideBy)
			),
			right: C4dot5(
				right,
				usedAttributes.concat(divider.divideBy)
			)
		}
	} else if (divider.divideBy == "") {
		// No dividing attribute found -> return leaf with most present class
		const counts = getClassesCounts(dataset);
		let best = "";

		for (let name in counts) {
			if (best == "" || counts[name] > counts[best]) {
				best = name;
			}
		}

		return {
			class: best
		}
	} else {
		return C4dot5(dataset, attributes);
	}
	
}