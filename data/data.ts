const fs = require("fs");

let idCount = 1;

// Arguments
const A_REDUCE_DATA_REDUNDANCY = idCount ++;
const A_TECHNOLOGICAL_OBSTACLE = idCount ++;
const A_IMPROVE_EFFICIENCY = idCount ++;
const A_EASY_ACCESS = idCount ++;
const A_INCREASE_BUDGET = idCount ++;
const A_COMPLEX_DEVELOPMENT = idCount ++;
const A_EASY_IMPLEMENTATION = idCount ++;
const A_NEED_DATA_SYNC = idCount ++;
const A_CREATE_DATA_REDUNDANCY = idCount ++;
const A_EASY_ADMINISTRATION = idCount ++;
const A_REQUIRE_USER_WITH_MECANICAL_SKILLS = idCount ++;
const A_SECURE_INFO_CONFIDENTIALITY = idCount ++;
const A_IMPROVE_SEARCHING = idCount ++;
const A_EVADE_FREQUENT_COMMUNICATION_BETWEEN_MODULES = idCount ++;
console.log(idCount)
export const ARGUMENTS_COUNT = idCount;

// Propositions
const P_AUTOMATIC_OBJECT_RECOGNITION = idCount ++;
const P_SINGLE_DATABASE_FOR_MODULES = idCount ++;
const P_4_DATABASE_FOR_MODULES = idCount ++;
const P_INFORMATION_EXCHANGE_ERP_PLM = idCount ++;
const P_INFORMATION_EXCHANGE_APPLICATION_ERP_PLM = idCount ++;
const P_MANUAL_SEARCH_FOR_KNOWLEDGE = idCount ++;

export const PROPOSITION_COUNT = idCount - ARGUMENTS_COUNT;

// Problems
const I_FUNCTION_DEFINITION = idCount ++;

export const ISSUE_COUNT = idCount - PROPOSITION_COUNT;

interface Proposition {
	id: number;
	criticize: number[];
	defend: number[];
}

interface Issue {
	id: number;
	propositions: Proposition[];
	decisions: number[];
}

// First project from 2012
const project2012: Issue = {
	id: I_FUNCTION_DEFINITION,
	propositions: [
		{
			id: P_AUTOMATIC_OBJECT_RECOGNITION,
			criticize: [
				A_INCREASE_BUDGET,
				A_COMPLEX_DEVELOPMENT
			],
			defend: [
				A_IMPROVE_EFFICIENCY,
				A_EASY_ACCESS
			]
		},
		{
			id: P_SINGLE_DATABASE_FOR_MODULES,
			defend: [
				A_EASY_ADMINISTRATION
			],
			criticize: [
				A_NEED_DATA_SYNC,
				A_CREATE_DATA_REDUNDANCY
			]
		},
		{
			id: P_4_DATABASE_FOR_MODULES,
			criticize: [],
			defend: []
		},
		{
			id: P_INFORMATION_EXCHANGE_ERP_PLM,
			defend: [
				A_REDUCE_DATA_REDUNDANCY
			],
			criticize: [
				A_TECHNOLOGICAL_OBSTACLE
			]
		},
		{
			id: P_INFORMATION_EXCHANGE_APPLICATION_ERP_PLM,
			criticize: [],
			defend: []
		}
	],
	decisions: [
		P_AUTOMATIC_OBJECT_RECOGNITION,
		P_4_DATABASE_FOR_MODULES,
		P_INFORMATION_EXCHANGE_APPLICATION_ERP_PLM
	]
};

const project2013: Issue = {
	id: I_FUNCTION_DEFINITION,
	propositions: [
		{
			id: P_MANUAL_SEARCH_FOR_KNOWLEDGE,
			defend: [ A_EASY_IMPLEMENTATION ],
			criticize: [ A_REQUIRE_USER_WITH_MECANICAL_SKILLS ]
		},
		{
			id: P_SINGLE_DATABASE_FOR_MODULES,
			defend: [
				A_IMPROVE_SEARCHING,
				A_SECURE_INFO_CONFIDENTIALITY,
				A_EVADE_FREQUENT_COMMUNICATION_BETWEEN_MODULES
			],
			criticize: []
		},
		{
			id: P_INFORMATION_EXCHANGE_APPLICATION_ERP_PLM,
			criticize: [],
			defend: []
		}
	],
	decisions: [
		P_MANUAL_SEARCH_FOR_KNOWLEDGE,
		P_SINGLE_DATABASE_FOR_MODULES,
		P_INFORMATION_EXCHANGE_APPLICATION_ERP_PLM
	]
}

const project2014: Issue = {
	id: I_FUNCTION_DEFINITION,
	propositions: [
		{
			id: P_MANUAL_SEARCH_FOR_KNOWLEDGE,
			defend: [ A_EASY_ADMINISTRATION ],
			criticize: [ ]
		},
		{
			id: P_SINGLE_DATABASE_FOR_MODULES,
			defend: [
				A_EASY_ACCESS,
				A_EVADE_FREQUENT_COMMUNICATION_BETWEEN_MODULES
			],
			criticize: []
		},
		{
			id: P_INFORMATION_EXCHANGE_ERP_PLM,
			defend: [
				A_REDUCE_DATA_REDUNDANCY
			],
			criticize: [ ]
		},
	],
	decisions: [
		P_SINGLE_DATABASE_FOR_MODULES,
		P_INFORMATION_EXCHANGE_ERP_PLM
	]
}

export const issues = [ project2012, project2013, project2014 ];

function csv(values: number[][]) {
	return values.map(line => line.join(" ")).join("\n");
}

function projectsPropositionOfIssue(issues: Issue[]) {
	const data: number[][] = [];

	// Each issue decisions followed by it's id
	issues.forEach((issue) => {
		data.push(issue.decisions.sort((a, b) => a - b).concat(issue.id));
	});

	return csv(data);
}

function projectsArgumentOfProposition(issues: Issue[]) {
	const data: {[cl: string]: number[][]} = {};

	issues.forEach((issue) => {
		if (data[issue.id] === undefined) {
			data[issue.id] = [];
		}

		// Each proposition's arguments in order of id followed by it's id
		issue.propositions.forEach((proposition) => {
			data[issue.id].push(
				proposition.criticize.concat(proposition.defend)
					.sort((a, b) => a - b)
					.concat(proposition.id)
			)
		});
	});

	const result: {[cl: string]: string} = {};

	Object.keys(data).map((name) => {
		result[name] = csv(data[name]);
	});

	return result;
}

console.log(`Writing propositions.csv...`)
fs.writeFileSync("propositions.csv", projectsPropositionOfIssue(issues))

let res = projectsArgumentOfProposition(issues);
for (let name in res) {
	console.log(`Writing arguments${name}.csv...`)
	fs.writeFileSync(`arguments${name}.csv`, res[name]);
}