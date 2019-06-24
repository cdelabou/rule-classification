# Algorithme APriori

L’algorithme APriori génère des règles d'association et/ou de classifications récurrentes à partir d'ensembles de données.

L'implémentation présentée ici est issue de [http://cgi.csc.liv.ac.uk/~frans/KDD/Software/CBA/cba.html](http://cgi.csc.liv.ac.uk/~frans/KDD/Software/CBA/cba.html) (voir fichier [cba.html](cba.html) hors ligne).

## Format de donnée

### Entrées
Le programme lit un fichier de type `ssv` (space separated values), avec pour chaque ligne une liste d'attributs *numériques ordonnés* séparés par des espaces. Le dernier nombre représente la classe de l'échantillon et doit est supérieur numériquement à tous les attributs.

Il n'y a pas de ligne pour donner de noms au début du fichier.

#### Exemple
Par exemple, on peut avoir 5 attributs: `{1, 2, 3, 4, 5}` et deux classes : `{6, 7}`.

Le dernier nombre utilisé, ici `7`, doit être entré en argument du programme comme nombre de valeur dans le fichier : `[...] -N7` (il est autorisé d'avoir des nombres manquants mais peu recommandé pour des raisons de performance).

Le fichier peut avoir ce genre de format (pour 5 échantillons).
```ssv
1 2 3 6
4 5 7
1 6
7
2 4 5 7
```

### Sorties
Le programme affiche les différents règles trouvées dans les données qui respectent le support donné.

### Utiliser des attributs nomatifs
Pour utiliser des attributs et classes dont la description est textuelle, il faut associer à chaque nom et classe un numéro.

## Lancer le programme

### Compilation
La compilation nécessite l'installation de Java JDK version 2 minimum.
```sh
javac ClassCBA_App.java
```

### Arguments d'entrée
- support minimal : `-S{support en %}`
- confiance minimale `-C{confiance en %}`
- nombre de valeurs dans le fichier : `-N{nombre valeurs}`
- fichier de données : `-F"{chemin vers le fichier}"`

### Exemple de lancement
```
java ClassCBA_App -Ffilename.ssv -S20 -N10 -C60
```

