import { Datacase, Items } from "./types";
import CBA_RG, {} from "./cba-rg"
import CBA_RG_Opt, {} from "./optimisation"
import importCSV from "./csv"

export default async function test(filename: string, minSupport: number) {
	const { dataset, mapping, names, classes } = await importCSV(filename);
	
	// Support of 20%
	const result = CBA_RG_Opt(minSupport, dataset, names, classes);

	// Show success rate of first set
	//let success = dataset.reduce((acc, datacase) => matches(datacase, result) ? acc + 1 : acc, 0);	
	//console.log(`matches ${success} out of ${dataset.length} (${(success/dataset.length*100).toFixed(2)}%)`)
	
	// Then display tree
	console.log(result)
}

test("iris", 20).catch(console.error);