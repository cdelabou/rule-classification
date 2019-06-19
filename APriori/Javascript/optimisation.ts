import { Datacase, KRuleItem, Items } from "./types";

interface Node {
	attribute: string;
	value: number;
	children: Node[];
	parent?: Node;

	class: string;
	condsupCount: number;
	countByClass: {[className: string]: number};
}

interface AttributeValues { [name: string]: number[] }

// -> http://cgi.csc.liv.ac.uk/~frans/KDD/Software/CBA/cba.html
// voir https://zestedesavoir.com/tutoriels/962/les-arbres-de-decisions/premiere-version-id13/



function getAttributeValues(dataset: Datacase[], headers: string[]): AttributeValues {
	let values: AttributeValues = {};

	headers.forEach((name) => values[name] = []);

	dataset.forEach(datacase => {
		for (let name in datacase.items) {
			if (!(datacase.items[name] in values[name])) {
				values[name].push(datacase.items[name]);
			}
		}
	});

	return values;
}

function deepen<E, F>(object: E, callback: (arg: E, acc: F[]) => E | undefined, acc: F[] = []): F[] {
	let res = callback(object, acc);

	if (res !== undefined) {
		return deepen(res, callback, acc);
	}

	return acc;
}

function genRules(attrValues: AttributeValues, names: string[], parentNode: Node | undefined = undefined): Node[] {
	let result: Node[] = [];

	// For each attribute name
	names.forEach((name) => {
		// Only accept names after this element in alphabetical order
		// -> Prevent to have duplication of attributes
		if (parentNode !== undefined && name <= parentNode.attribute) {
			return;
		}

		// Add all attributes for values
		attrValues[name].forEach((value) => {
			const node: Node = {
				attribute: name,
				value,
				children: [],
				parent: parentNode,

				class: "",
				condsupCount: 0,
				countByClass: {}
			}

			// If parent, add to childrens
			if (parentNode !== undefined) {
				// Add to all properties as it might match every item
				parentNode.children.push(node);
			}
		
			result.push(node);
		});

		
	});

	return result;
}

function matches(datacase: Datacase, node: Node): boolean {
	let ok = true;

	deepen(node, (currentNode) => {
		if (datacase.items[currentNode.attribute] !== currentNode.value) {
			ok = false;
			return;
		}

		if (currentNode.parent !== undefined) {
			return currentNode.parent;
		}
	});

	return ok;
}

/**
 * Dictionary merging helper, merge two items dict into a new items dict
 * from [https://plainjs.com/javascript/utilities/merge-two-javascript-objects-19/]
 * @param obj 
 * @param src 
 */
function join(obj: Items, src: Items): Items {
	let dest: Items = {};
    for (var key in obj) {
        if (obj.hasOwnProperty(key)) dest[key] = obj[key];
    }
    for (var key in src) {
        if (src.hasOwnProperty(key)) dest[key] = src[key];
    }
    return dest;
}

/**
 * Retrieve rules from given nodes dans previous items
 * @param nodes nodes to fetch rules from
 * @param previousSet previous set of data from parent rules
 * @param minsup minimal support for rules
 */
function extractRules(nodes: Node[], previousSet: Items, minsup: number): KRuleItem[] {
	const rules: KRuleItem[] = [];

	nodes.forEach(node => {
		// Create subset of attributes induced by this node
		let setPart: Items = {};
		setPart[node.attribute] = node.value;

		for (let className in node.countByClass) {
			// If set + rule matches minsup
			if (node.countByClass[className] >= minsup) {
				// Create rules
				const rule: KRuleItem = {
					class: className,
					condset: join(setPart, previousSet),
					condsupCount: node.condsupCount,
					rulesupCount: node.countByClass[className]
				}
				
				rules.push(rule);
			}
		}

		// Then explore children with new attribute set
		setPart = join(setPart, previousSet);
		rules.push(...extractRules(node.children, setPart, minsup))
	});

	return rules;
}

/**
 * Count classes occurences for each node and remove classes that do not match a lot
 * of cases
 * @param nodes 
 * @param dataset 
 * @param classes 
 * @param filterCriterion 
 */
function filterSets(nodes: Node[], dataset: Datacase[], classes: string[], filterCriterion: number) {
	return nodes.filter((node) => {
		// Count support of rules induced by this node's set
		dataset.forEach(datacase => {
			// If it matches
			if (matches(datacase, node)) {
				node.condsupCount += 1;
				node.countByClass[datacase.class] = (node.countByClass[datacase.class] + 1) || 1;
			}
			
		});

		// If at least one rule match a lot of class
		return classes.some((name) => (name in node.countByClass) && node.countByClass[name] >= filterCriterion);
	});
}

export default function CBA_RG_Opt(minsup: number, dataset: Datacase[], names: string[], classes: string[]): KRuleItem[] {
	const filterCriterion = Math.ceil(dataset.length * 0.01);
	let k: number = 1; // current condset size - 1

	let attributes = getAttributeValues(dataset, names);
	let rulesTree: Node[] = filterSets(genRules(attributes, names), dataset, classes, filterCriterion);
	
	let currentNodes = rulesTree.concat([]);
	
	while(currentNodes.length > 0) {
		console.log(`Iteration ${k++}.`);

		let nextNodes: Node[] = [];

		// Filter unadequate rules
		filterSets(currentNodes, dataset, classes, filterCriterion)
			.forEach((node) => { // Then generated next rules
				// Generate next nodes (nodes are added to current node)
				nextNodes.push(...genRules(attributes, names, node));
			});

		// Invert nodes
		currentNodes = nextNodes;

		console.log(`Found ${currentNodes.length} relevant set of attributes.`);
	}

	// Convert tree to rules
	return extractRules(rulesTree, {}, minsup);
}