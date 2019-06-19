# Algorithme APriori

Plus de documentation et auteurs du code [ici](http://cgi.csc.liv.ac.uk/~frans/KDD/Software/CBA/cba.html) ou dans le fichier `cba.html`.

## Compilation

```sh
javac ClassCBA_App.java
```

## Lancement

Pour un support minimal de 20% (changer le nombre après -S pour modifier) et des valeurs allant jusqu'a 10 (nombre après -N, voir format de donnée):
```
java ClassCBA_App -Ffilename.ssv -S20 -N10
```

## Format de donnée
Chaque ligne contient un exemple de donné classifié. Il contient tous les attributs présents pour ce cas précis, représentés par des nombres et séparés par des espaces. Le dernier nombre représente la classe.

La classe est un numéro qui doit être supérieur à celui de tous les attributs précédents.

Par exemple, on peut avoir 5 attributs: `{1, 2, 3, 4, 5}` et deux classes : `{6, 7}`.

Le dernier nombre utilisé, ici `7`, doit être entré en argument du programme : `[...] -N7`.