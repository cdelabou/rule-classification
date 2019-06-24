// Single attribute-value item
export interface Items { [attribute: string]: number } 

// Set of unique items with a class
export interface Datacase {
    items: Items;

    class: string;
}

// Class association rule (or CAR)
export interface RuleItem {
    // Set of items
    condset: Items;

    // Output class
    class: string;
}

// RuleItem with K conditions inside
export interface KRuleItem extends RuleItem {
	// number of case in D containing [condset]
	condsupCount: number;

	// number of case in D containing [condset] and with label [y]
	rulesupCount: number;
}