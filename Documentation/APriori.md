# Algorithme APriori

L’algorithme APriori génère des règles d'association et/ou de classifications récurrentes à partir d'ensembles de données.

## Format de donnée

### Entrées
Le programmes prends des fichiers CSV en entrée, à sur chaque ligne l'ensemble des valeurs, textuelles ou non de l'entrée.

Il n'y a pas de gestion de classe pour cette implémentation, mais on peut ajouter la classe dans les éléments, puis ne garder que les règles qui impliquent ces classes.

### Sorties
Le programme affiche les différents ensemble et règles récurrents trouvés dans les données qui respectent le support donné, et la confiance donnée pour les règles.

## Lancer le programme

### Arguments d'entrée
- support minimal : `-s {support entre 0 et 1}`
- confiance minimale : `-c {confiance entre 0 et 1}`
- fichier de données : `-f {chemin du fichier}`

### Exemple de lancement
```
python apriori.py -f INTEGRATED-DATASET.csv -s 0.17 -c 0.68
```

