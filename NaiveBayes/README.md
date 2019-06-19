# Classification naive bayésienne

Code issu de [ici](https://machinelearningmastery.com/naive-bayes-classifier-scratch-python/).

Cette classification ne permet pas de faire des arbres de décision ou des règles, elle est donc hors sujet ici.

## Lancement

```
python3 naive_bayes.py
```
Puis entrer le nom du fichier (par défaut le set de données présent dans le dossier)

## Format de donnée
Le format utilisé est le format CSV, la dernière colonne représente la classe.

Les noms des colonnes ne sont pas représentés dans les données chargées

Toutes les valeurs doivent être numériques.

## Format du résultat
Affiche le nombre de données utilisées pour la détermination des coefficients et celui des données utilisées pour le test.

Puis le pourcentage de précision des valeurs utilisées.

Enfin, pour chaque classe, affiche pour chaque attribut la moyenne et l'écart type de chaque attribut.