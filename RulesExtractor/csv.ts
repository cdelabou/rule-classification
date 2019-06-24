import fs from "fs";
import { Datacase } from "./types"

export interface LoadedData {
	dataset: Datacase[];
	mapping: string[][];
	names: string[];
	classes: string[];
}

export default async function readData(filename: string): Promise<LoadedData> {
	const stream = fs.createReadStream(__dirname + "/data/" + filename + ".csv");
	let callback: Function | null = null;
	let done: boolean = false;
	let data: string = "";
	let headers: string[] | null = null;
	let classes: string[] = [];

	let mapping: string[][] = [];

	const dataset: Datacase[] = [];

	stream.on("data", function(chunk) {
		data += chunk.toString("utf-8");

		if (data.indexOf("\n") > -1) {
			const parts = data.split("\n");
			data = parts.pop()!;

			parts.forEach((line: string) => {
				if (headers === null) {
					headers = line.split(",");
					mapping = new Array(headers.length - 1).fill(0).map(() => []);
				} else {
					// Split values
					const values = line.split(",");
					const datacase: Datacase = {
						items: {},
						class: values.pop()!
					}

					if (classes.indexOf(datacase.class) === -1) {
						classes.push(datacase.class);
					}

					values.forEach((value, index) => {
						// Try to cast as number
						if (isNaN(Number(value))) {
							let valueIndex = mapping[index].indexOf(value);

							if (valueIndex === -1) {
								valueIndex = mapping[index].length;
								mapping[index].push(value);
							}

							datacase.items[headers![index]] = valueIndex;
						} else {
							datacase.items[headers![index]] = Number(value);
						}
					});

					dataset.push(datacase);
				}
			})

		}
	});

	stream.on("end", () => {
		done = true;

		if (callback != null) {
			callback();
		}
	});

	await new Promise((res, rej) => {
		if (done) {
			res();
		} else {
			callback = res;
		}
	});

	return { dataset, mapping, names: headers!, classes };
}