# Code source issu de https://machinelearningmastery.com/naive-bayes-classifier-scratch-python/
# Commenté et typé par Clément de La Bourdonnaye à partir du code et du tutoriel

# Example de Naive Bayes en python
import csv
import random
import math
import numpy

# Types
from typing import List, Dict
Item = List[float]
Dataset = List[Item]
Summary = List[float]
SummaryByClass = Dict[int, Summary]

def load_csv(filename: str) -> Dataset:
	'''Charge les données CSV depuis le fichier donné'''
	lines: List[str] = csv.reader(open(filename, "r"))
	dataset: Dataset = list(lines)
	for i in range(len(dataset)):
		dataset[i] = [float(x) for x in dataset[i]]

	return dataset

def split_dataset(dataset: Dataset, splitRatio: float = 0.67):
	'''
		Sépare le set de données en deux sets d'entrainement est de
		de vérification
	'''
	trainSize = int(len(dataset) * splitRatio)
	trainSet = []
	copy = list(dataset)
	while len(trainSet) < trainSize:
		index = random.randrange(len(copy))
		trainSet.append(copy.pop(index))
	return [trainSet, copy]

def separate_by_class(dataset: Dataset) -> Dict[int, Dataset]:
	'''
		Sépare les données par leur classe, et renvoie un dictionnaire
		associant ces classes aux items de cette class
	'''
	separated = {}
	for i in range(len(dataset)):
		vector = dataset[i]
		if (vector[-1] not in separated):
			separated[vector[-1]] = []
		separated[vector[-1]].append(vector)
	return separated

def summarize(dataset: Dataset) -> Summary:
	'''
		Renvoie la moyenne et la écart type (deviation) de chaque attribut du set donné
	'''
	summaries = [(numpy.mean(attribute), numpy.std(attribute)) for attribute in zip(*dataset)]
	del summaries[-1]
	return summaries

def summarize_by_class(dataset: Dataset) -> SummaryByClass:
	'''
		Renvoie les informations (moyenne, écart type) pour chaque attribut
		de chaque classe du set
	'''
	separated = separate_by_class(dataset)
	summaries = {}

	for classValue, instances in separated.items():
		summaries[classValue] = summarize(instances)

	return summaries

def calculate_probability(x: float, mean: float, stdev: float) -> float:
	'''
		Calcule la probabilité gaussienne d'être à une valeur x pour
		une moyenne et un écart type donnée.
	'''
	exponent = math.exp(-(math.pow(x-mean,2)/(2*math.pow(stdev,2))))
	return (1 / (math.sqrt(2*math.pi) * stdev)) * exponent

def calculate_class_probabilities(summaries: SummaryByClass, inputVector: Item):
	'''
		Calcule les probabilités pour chaque classe que l'item donné (inputVector)
		soit de cette classe.
	'''
	probabilities = {}
	for classValue, classSummaries in summaries.items():
		probabilities[classValue] = 1
		for i in range(len(classSummaries)):
			mean, stdev = classSummaries[i]
			x = inputVector[i]
			probabilities[classValue] *= calculate_probability(x, mean, stdev)
	return probabilities
			
def predict(summaries: SummaryByClass, inputVector: Item) -> int:
	'''
		Donne une prédiction de classe pour une entrée donnée basée sur la classe
		ayant le plus de chance de se lancer
	'''
	probabilities = calculate_class_probabilities(summaries, inputVector)
	bestLabel, bestProb = None, -1
	for classValue, probability in probabilities.items():
		if bestLabel is None or probability > bestProb:
			bestProb = probability
			bestLabel = classValue
	return bestLabel

def get_predictions(summaries: SummaryByClass, testSet: Dataset) -> List[int]:
	'''
		Renvoie les prédictions pour le set donné
	'''
	predictions = []
	for i in range(len(testSet)):
		result = predict(summaries, testSet[i])
		predictions.append(result)
	return predictions

def get_accuracy(testSet: Dataset, predictions: List[int]) -> float:
	'''
		Calcule la précision des prédictions réalisées
	'''
	correct = 0
	for i in range(len(testSet)):
		if testSet[i][-1] == predictions[i]:
			correct += 1
	return (correct/float(len(testSet))) * 100.0

if __name__ == "__main__":
	print("filename [pima-indians-diabetes.data.csv]:", end=" ")
	filename = input()
	if filename == "":
		filename = 'pima-indians-diabetes.data.csv'

	splitRatio = 0.67
	dataset = load_csv(filename)
	trainingSet, testSet = split_dataset(dataset, splitRatio)
	print(f'Split {len(dataset)} rows into train={len(trainingSet)} and test={len(testSet)} rows')
	# prepare model
	summaries = summarize_by_class(trainingSet)
	#print(summaries)
	# test model
	predictions = get_predictions(summaries, testSet)
	accuracy = get_accuracy(testSet, predictions)
	print(f'Accuracy: {accuracy}%')

	for classValue in summaries.keys():
		sep = "\n\t"
		
		print(f'Class {classValue} : \n\t{sep.join([f"mean : {m:.3f}, standart deviation : {v:.3f}" for m, v in summaries[classValue]])}')
		pass