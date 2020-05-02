# Master Cercleur
Master Cercleur est une application pour optimiser le gerbage (empilement) des palettes.

## Interface
Composé de larges boutons, l'interface doit montrer rapidement l'inventaire des commandes saisies par l'utilisateur.

<img src="ressources/img_readme/affichage.png"
    alt="saisie_colis"
    style="margin: auto;"/>


L'utilisateur peut modifier dans les paramètres les longueurs, largeurs et hauteurs des différents colis ainsi que de la palette.

## Affichage des résultats

L'utilisateur choisit ensuite les commande qu'il souhaite empiler. Si cela dépasse la hauteur "dangereuse" (modifiable dans les paramètres), le programme clignote orange. Si les commandes empilées dépassent la hauteur maximum autorisé (toujours modifiable dans les paramètres), le programme clignotera rouge.

Si plus de deux commandes sont empilées, l'utilisateur peut choisir d'"optimiser" l'agencement en cochant la case "optimiser".
A ce moment le programme mélange les commandes de mêmes types de colis pour gagner des rangs en hauteur.

Si après cela, la hauteur dépasse encore la hauteur maximale autorisée, tous les "restes" des commandes empilées (rang non plein) sont récupérés puis placés sur une unique palette au dessus.


<img src="ressources/img_readme/optimisation.png"
    alt="saisie_colis"
    style="margin: auto;"/>


