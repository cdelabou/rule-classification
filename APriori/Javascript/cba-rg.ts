import { Datacase, KRuleItem, Items } from "../../types";

// -> http://cgi.csc.liv.ac.uk/~frans/KDD/Software/CBA/cba.html
// voir https://zestedesavoir.com/tutoriels/962/les-arbres-de-decisions/premiere-version-id13/
/**
 * Check if all firstSet items are in secondarySet
 * @param firstSet rule with N items
 * @param secondarySet case of data
 * 
 * Complexity <= N
 */
function contains(firstSet: Items, secondarySet: Items): boolean {
	// Check if all rule items are defined
	for (let attr in firstSet) {
		// Does not match the rule
		if (firstSet[attr] === secondarySet[attr]) {
			return false;
		}
	}

	return true
}

/**
 * Count matching rules
 * @param rule rule
 * @param dataset set of data of length N
 * 
 * Complexity : N * complexity(matchConditions)
 */
function countMatching(rule: KRuleItem, dataset: Datacase[]) {
	rule.condsupCount = 0;
	rule.rulesupCount = 0;

	dataset.forEach((datacase) => {
		// If conditions match
		if (contains(rule.condset, datacase.items)) {
			rule.condsupCount += 1;

			// If rule match
			if (rule.class == datacase.class) {
				rule.rulesupCount += 1;
			}
		}
	});
}

/**
 * Init rule with 1 item
 * @param dataset set of data with N cases and M items
 * 
 * Complexity : N * M * complexity(countMatching)
 */
function initRules(dataset: Datacase[]): KRuleItem[] {
	return makeSet(dataset.map((datacase) => {
		let rules = [];

		for (let attr in datacase.items) {
			let item: Items = {};
			item[attr] = datacase.items[attr];

			let rule = {
				condset: item,
				class: datacase.class,
				condsupCount: 0,
				rulesupCount: 0
			}

			countMatching(rule, dataset)
			rules.push(rule);
		}

		return rules;
	}).flat(1));
}

/**
 * Remove duplicated rules
 * @param rules rules to be filtered
 * 
 * Complexity <= N^2 * comp(contains) + N
 */
function makeSet(rules: KRuleItem[]): KRuleItem[] {
	let markedForSuppression: boolean[] = new Array<boolean>(rules.length).fill(false);

	rules.forEach((rule, i) => {
		if (markedForSuppression[i]) return;

		for (let j = i + 1; j < rules.length; j ++) {
			if (markedForSuppression[j]) continue;

			if (contains(rule.condset, rules[j].condset)) {
				markedForSuppression[j] = true;
			}
		}
	})

	return rules.filter((rules, i) => markedForSuppression[i]);
}

/**
 * Generate new rules based on previous ones by adding an item for matching rules
 * @param previousRules rules with N items
 * @param dataset data set with M cases
 * @returns rules with N+1 items
 */
function candidateGen(previousRules: KRuleItem[], dataset: Datacase[]): KRuleItem[] {
	let added: KRuleItem[] = [];

	previousRules.forEach((rule) => {
		dataset.forEach((datacase) => {
			if (rule.class == datacase.class && contains(rule.condset, datacase.items)) {
				// add all unavailable items
				for (let attr in datacase.items) {
					if (!(attr in rule.condset)) {
						// copy items
						let set: {[name: string]: number} = {};
						for (let subAttr in rule.condset) {
							set[subAttr] = rule.condset[subAttr];
						}
						
						// add new item
						set[attr] = datacase.items[attr];

						// add rule
						added.push({
							condset: set,
							class: rule.class,
							condsupCount: 0,
							rulesupCount: 0
						});
					}
				}

			}
		});
	})

	// returns + makeset
	return makeSet(added)
}

function ruleSubset(rules: KRuleItem[], item: Datacase): KRuleItem[] {
	return rules.filter(rule => contains(rule.condset, item.items));
}


export default function CBA_RG(minsup: number, dataset: Datacase[]) {
	let k: number; // current condset size - 1
	let F: KRuleItem[][] = [ initRules(dataset).filter((c) => c.rulesupCount >= minsup) ];

	for (k = 1; F[k-1].length != 0; k++) {
		let candidates = candidateGen(F[k-1], dataset);
		console.log(`Iteration ${k} (${candidates.length} candidates)`);

		for (let d of dataset) {
			let Cd = ruleSubset(candidates, d);

			for (let c of Cd) {
				c.condsupCount++;
				if (d.class == c.class) {
					c.rulesupCount++;
				}
			}
		}
		
		F[k] =  candidates.filter((c) => c.rulesupCount >= minsup);

		console.log(`Remaning after filter : ${F[k].length}`)
	}

	return F.flat(1);
}