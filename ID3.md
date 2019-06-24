# ID 3

L'implémentation se trouve dans le dossier `machine-learning-tutorials/decision-tree` et répond au nom de `decision_tree.py`.

## Format de données

Les données sont stockées au format CSV, la dernière colonne représente la classe d'un ensemble.

## Lancer le programme
Le programme est configuré pour ouvrir `playtennis.csv` dans le dossier courant, pour utiliser un autre set de données :
- Remplacer le contenu de `playtennis.csv`
- Modifier le code (ligne 166) pour ouvrir un autre fichier

## Format de sortie
Le format de sortie correspond à l'arbre encodé sous forme linéaire. Les noeuds et leurs sorties sont affichés les uns après les autres en largeur d'abord.

### Exemple :

```
Outlook
(Sunny)
(Overcast)
(Rain)
Humidity
(High)
(Normal)
Yes
Wind
(Weak)
(Strong)
No
Yes
Yes
No
```

Donne :
- Un premier noeud racine outlook avec 3 valeurs possibles (sunny, overcast et rain)
- Le premier noeud enfant humidity avec 2 enfants
- Le second noeud enfant
- etc...