var liste_commandes = [new myItem("A", 245), new myItem("B", 2), new myItem("C", 3), new myItem("D", 105), new myItem("E", 55), new myItem("F", 50), new myItem("G", 10), new myItem("H", 10), new myItem("I", 10), new myItem("J", 10)];
var hauteur_max = 250;
var min_palettes = null;
var meilleur_agencement = null;


function myItem(nom, hauteur) {
    this.nom = nom;
    this.hauteur = hauteur;
}


// Retourne une liste de toutes les combinaisons possibles d'empilements de commandes.
function trouve_possible(commandes_places, reste, valides) {
    for (let i=0; i<reste.length; i++){
        let cp_commandes_places = copie_liste_palettes(commandes_places);
        let cp_reste = copie_reste(reste);
        cp_reste.splice(0, i+1);
        cp_commandes_places.push(reste[i]);
        let hauteur_accepte = test_hauteur(cp_commandes_places);
        if (hauteur_accepte) {
            valides.push(cp_commandes_places);
            trouve_possible(cp_commandes_places, cp_reste, valides);
        }
    }
    return valides;

}

// Test la condition d'empilement (ici, < hauteur_max).
function test_hauteur(commandes) {
    let hauteur = 0;
    for (let i=0; i<commandes.length; i++) {
        hauteur += commandes[i].hauteur; 
        if (hauteur > hauteur_max) {
            return false;
        }
    }
    return true;
}

// Vérifie que toutes les commandes d'origine sont inférieure à la hauteur_max.
// Si toutes les commandes peuvent être empilées ensemble retourne 2 pour éviter de lancer l'algorithme.
function verifie_commandes_ok() {
    let hauteur_totale = 0;
    for (let i=0; i<liste_commandes.length; i++) {
        hauteur_totale += liste_commandes.hauteur;
        if (liste_commandes[i].hauteur > hauteur_max) {
            return 0;
        }
    }
    if (hauteur_totale < hauteur_max) {
        return 2
    }
    return 1;
}


// Trouve le meilleur empilement par récursion.
// Si une combinaison a déjà été trouvé et que la combinaison en cours de recherche est moins avantageuse,
// (si le nombre de palettes au sol est supérieur), la recherche pour cette combinaison est arretée.
function trouve_meilleur(liste_palettes, reste) {
    if (min_palettes != null && liste_palettes.length >= min_palettes) {
        return;
    }
    let total_commandes = compte_commandes(liste_palettes);
    if (total_commandes == liste_commandes.length && (min_palettes == null || liste_palettes.length < min_palettes)) {
        min_palettes = liste_palettes.length;
        meilleur_agencement = liste_palettes;
        return;
    }

    let new_reste = copie_reste(reste);
    let liste_possibilites = trouve_possible(reste[0], new_reste, []);
    for (let i=0; i<liste_possibilites.length; i++) {
        let cp_liste_palettes = copie_liste_palettes(liste_palettes);
        let cp_reste = copie_reste(reste, liste_possibilites[i]);
        cp_liste_palettes.push(liste_possibilites[i]);
        for (let j=0; j<liste_possibilites[i].length; j++) {
            let k=0;
            while (k<cp_reste.length) {
                if (liste_possibilites[i][j] == cp_reste[k]) {
                    cp_reste.splice(k, 1);
                    continue;
                }
                k++;
            }
        }
        trouve_meilleur(cp_liste_palettes, cp_reste);
    }
}

// Compte le nombre de commandes incluses dans la liste des palettes.
function compte_commandes(liste_palettes) {
    let qte = 0;
    for (let j=0; j<liste_palettes.length; j++) {
        for (let i=0; i<liste_palettes[j].length; i++) {
            qte++;
        }
    }
    return qte;
}


// Copie la liste de palettes.
function copie_liste_palettes(liste_palettes) {
    let copie = [];
    for (let i=0; i<liste_palettes.length; i++) {
        copie.push(liste_palettes[i]);
    }
    return copie;
}


// Copie la liste des restes.
function copie_reste(reste, commandes=[]) {
    let copie = [];
    for (let i=0; i<reste.length; i++) {
        let deja_place = false;
        for (let j=0; j<commandes.length; j++) {
            if (reste[i] == commandes[j]) {
                deja_place = true;
                break;
            }
        }
        if (!deja_place) {
            copie.push(reste[i]);
        }
    }
    return copie;
}

// Vérifie que les commandes d'origine ne dépassent pas la hauteur_max,
// Vérifie s'il est possible de tout empiler en une seule palette,
// Sinon lance la recherche de la meilleur possibilitée.
function main() {
    let commandes_valides = verifie_commandes_ok();
    if (commandes_valides == 0) {
        console.log("commandes de taille supérieure à la taille maximale");
        return;
    }
    else if (commandes_valides == 2) {
        console.log("Tout rentre");
        return;
    }
    trouve_meilleur([], liste_commandes);
    console.log(meilleur_agencement);
}

main();