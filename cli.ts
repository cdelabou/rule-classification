import readline from "readline";
import { issues } from "./data/data";
import chalk from "chalk";

interface Algorithm {

}

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
});

const algorithms: { [name: string]: Algorithm } = {
	"C4.5": {},
	"CART": {},
	"APriori": {},
	"NaiveBayes": {},
	"ID3": {}
};

function question(q: string) {
	return new Promise<string>((res, rej) => {
		rl.question(chalk.yellow(q + " : "), res);
	});
}

async function main() {
	const algorithmsNames = Object.keys(algorithms);

	console.log(`${chalk.green("-- Algorithmes disponibles --")}`);
	console.log(algorithmsNames.map((a, i) => `  ${i + 1}. ${a}`).join("\n"));

	const answer = parseInt(await question("Algoritme à utiliser")) - 1;
	console.log(answer);

	if (answer >= 0 && answer < algorithmsNames.length) {
		const algorithm = algorithms[algorithmsNames[answer]];
	} else {
		console.error(chalk.red("Entrée invalide..."));
	}
}

main()
.then(() => {
	rl.close();
}, (err) => {
	console.error(err);
	rl.close()
});
