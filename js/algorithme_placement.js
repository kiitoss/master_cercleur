// Création d'une copie de la AP_palette pour conserver la meilleure AP_palette pendant la recherche.
var AP_palette_place_vide = 0;
var AP_meilleur_palette = [];
var compteur_recursion = 0;
var max_recursion = 100000;

// Initialisation des variables.
var AP_hauteur_max = 0;
var AP_facteur_superposition = 1;
var AP_id = 1;
var AP_liste_colis_modifie = [];

var AP_LC = [];
var AP_placement_ok = false;

// Créé une copie de la liste des colis à partir de la liste originale.
function AP_creation_lc_modif() {
    AP_liste_colis_modifie = [];
    for (let i=0; i<AP_liste_colis.length; i++) {
        let quantite = AP_liste_colis[i][0];
        let type_colis = null;
        for (let j=0; j<liste_colis.length; j++) {
            if (liste_colis[j].nom == AP_liste_colis[i][1]) {
                type_colis = liste_colis[j];
                break;
            }
        }
        let superpose = 1;
        
        AP_liste_colis_modifie.push([quantite, type_colis.longueur, type_colis.largeur, type_colis.hauteur, superpose, type_colis.nom]);
    }
}

function AP_type_colis(nom, longueur, largeur, hauteur, nb_par_rang, couleur) {
    this.nom = nom;
    this.longueur = longueur;
    this.largeur = largeur;
    this.hauteur = hauteur;
    this.nb_par_rang = nb_par_rang;
    this.couleur = couleur;
}

// Créé l'objet Colis.
function AP_Colis(longueur, largeur, hauteur, superpose, nom_colis) {
    this.id = [AP_id, nom_colis, superpose];
    AP_id++;
    this.longueur = longueur;
    this.largeur = largeur;
    this.hauteur = hauteur;
    this.superpose = superpose;
}

// AP_LC est une liste composé de chaque colis.
function AP_creation_LC() {
    AP_LC = [];
    AP_id = 1;
    for (let i=0; i<AP_liste_colis_modifie.length; i++) {
        for (let j=0; j<AP_liste_colis_modifie[i][0]; j++) {
            AP_LC.push(new AP_Colis(AP_liste_colis_modifie[i][1], AP_liste_colis_modifie[i][2], AP_liste_colis_modifie[i][3], AP_liste_colis_modifie[i][4], AP_liste_colis_modifie[i][5]));
        }
    }
}

// Fonction principale, test les placement et change la hauteur si aucun placement n'est trouvé.
function AP_main() {
    AP_test_placement();
    if (AP_placement_ok) {
        AP_affichage_palette();
    }
    else {
        AP_facteur_superposition++;
        AP_change_hauteur_max();
    }
}

// Change la hauteur max en mémoire.
function AP_change_hauteur_max() {
    AP_creation_lc_modif();
    AP_tri_hauteur([]);

    let plus_petit_max = AP_liste_colis_modifie[0][3] * AP_facteur_superposition;
    
    
    let modif = false;
    for (let i=0; i<AP_liste_colis_modifie.length; i++) {
        if (AP_liste_colis_modifie[i][0] >= AP_facteur_superposition) {
            modif = true;
        }
        let facteur = 2;
        while (AP_liste_colis_modifie[i][0] >= facteur) {
            if ((AP_liste_colis_modifie[i][3] * facteur > AP_hauteur_max) && (AP_liste_colis_modifie[i][3] * facteur <= plus_petit_max)) {
                plus_petit_max = AP_liste_colis_modifie[i][3] * facteur;
                break;
            }
            facteur++;
        }
    }

    AP_hauteur_max = plus_petit_max;
    if (modif) {
        AP_superpose_colis();
    }
    else {
        AP_palette = AP_meilleur_palette;

        let palette_vide = true;
        for (let j=0; j<AP_meilleur_palette.length; j++) {
            for (let i=0; i<AP_meilleur_palette[j].length; i++) {
                if (AP_meilleur_palette[j][i] != "0") {
                    palette_vide = false;
                    break;
                }
            }
        }
    
        if (palette_vide) {
            console.log("Aucune solution trouvée.");
            AP_affichage_palette(false);
        }
        else {
            AP_affichage_palette();
        }
    }
}

// Superpose les colis (tant que la taille reste inférieure à 'AP_hauteur_max').
function AP_superpose_colis() {
    let colis_a_inserer = [];
    for (let i=AP_liste_colis_modifie.length-1; i>-1; i--) {
        let facteur = 1;
        while ((AP_liste_colis_modifie[i][0] > facteur) && (AP_liste_colis_modifie[i][3] * (facteur+1) <= AP_hauteur_max)) {
            facteur++;
        }
        if (AP_liste_colis_modifie[i][0] % facteur != 0) {
            let ajout = [];
            for (let j=0; j<AP_liste_colis_modifie[i].length; j++) {
                ajout.push(AP_liste_colis_modifie[i][j]);
            }
            colis_a_inserer.push(ajout);
            colis_a_inserer[colis_a_inserer.length - 1][0] = (AP_liste_colis_modifie[i][0] % facteur);
        }
        AP_liste_colis_modifie[i][0] = parseInt(AP_liste_colis_modifie[i][0] / facteur);
        AP_liste_colis_modifie[i][3] *= facteur;
        AP_liste_colis_modifie[i][4] = facteur;
    }

    for (let i=0; i<colis_a_inserer.length; i++) {
        AP_liste_colis_modifie.push(colis_a_inserer[i]);
    }
    AP_main();
}


// Lanceur de la fonction 'place()' après avoir copié la AP_palette.
function AP_test_placement() {
    AP_creation_LC();
    AP_tri_volume([]);
    // Création d'une copie de la AP_palette originale.
    let nouvelle_palette = [];
    for (let j=0; j<AP_palette.length; j++) {
        nouvelle_palette.push([]);
        for (let i=0; i<AP_palette[j].length; i++) {
            nouvelle_palette[j].push(0);
        }
    }

    // Placement des colis sur la AP_palette copie.
    AP_place(nouvelle_palette, 0, 0, 0, []);
}

// Place les colis sur la AP_palette.
function AP_place(ma_palette, index, pos_x, pos_y, liste_places) {
    if (index > AP_LC.length-1) {
        return;
    }

    let colis = AP_LC[index];

    let repetition = 1;

    if (colis.longueur != colis.largeur) {
        repetition = 2;
    }
    for (let k=0; k<repetition; k++) {
        //Initialise les valeurs.
        let cp_index = index;
        let nouvelle_palette = [];
        let cp_pos_x = pos_x;
        let cp_pos_y = pos_y;
        for (let j=0; j<ma_palette.length; j++) {
            nouvelle_palette.push([]);
            for (let i=0; i<ma_palette[j].length; i++) {
                nouvelle_palette[j].push(ma_palette[j][i]);
            }
        }
        let cp_liste_places = [];
        for (let i=0; i<liste_places.length; i++) {
            cp_liste_places.push(liste_places[i]);
        }

        // Lance la fonction de placement (longueur).
        AP_place_longueur(nouvelle_palette, colis, cp_pos_x, cp_pos_y, cp_liste_places, cp_index);
    
        // Si la longueur est différente de la largeur, on reproduit en inversant longueur/largeur.
        if (colis.longueur != colis.largeur) {
            let change = colis.longueur;
            colis.longueur = colis.largeur;
            colis.largeur = change;
        }
    }
}

// Place le colis sur tous les espaces possibles de la AP_palette, appel 'place()' à chaque placement valide.
function AP_place_longueur(test_palette, colis, pos_x, pos_y, colis_places, my_index) {
    compteur_recursion++;
    if ((test_palette[pos_y].length - pos_x < colis.longueur) || test_palette.length - pos_y < colis.largeur) {
        return false;
    }

    for (let j=0; j<colis.largeur; j++) {
        for (let i=0; i<colis.longueur; i++) {
            test_palette[j+pos_y][i+pos_x] = colis.id;
        }
    }

    colis_places.push(colis);

    if (colis_places.length == AP_LC.length) {
        AP_palette = test_palette
        AP_placement_ok = true;
    }

    if (!AP_placement_ok) {
        if (compteur_recursion > max_recursion) {
            return;
        }
        for (let j=0; j<test_palette.length - colis.largeur + 1; j++) {
            for (let i=0; i<test_palette[j].length - colis.longueur + 1; i++) {
                free_position = true;
                for (let j_colis=0; j_colis<colis.largeur; j_colis++) {
                    for (let i_colis=0; i_colis<colis.longueur; i_colis++) {
                        if (test_palette[j+j_colis][i+i_colis] != "0") {
                            free_position = false;
                            break;
                        }
                    }
                }
                if (free_position) {
                    AP_place(test_palette, my_index+1, i, j, colis_places);
                }
            }
        }
    }
}

// Tri la liste AP_LC par aire (décroissant).
function AP_tri_volume(new_LC) {
    let aire_max = 0;
    let index_aire_max = 0;
    for (let i=0; i<AP_LC.length; i++) {
        if (AP_LC[i].longueur * AP_LC[i].largeur >= aire_max) {
            aire_max = AP_LC[i].longueur * AP_LC[i].largeur;
            index_aire_max = i;
        }
    }
    new_LC.push(AP_LC[index_aire_max]);
    AP_LC.splice(index_aire_max, 1);
    if (AP_LC.length != 0) {
        AP_tri_volume(new_LC);
    }
    else {
        AP_LC = new_LC;
    }
}

// Tri la liste AP_liste_colis_modifie par hauteur (décroissant).
function AP_tri_hauteur(new_liste_colis_modifie) {
    let hauteur_max = 0;
    let index_hauteur_max = 0;
    for (let i=0; i<AP_liste_colis_modifie.length; i++) {
        if (AP_liste_colis_modifie[i][3] >= hauteur_max) {
            hauteur_max = AP_liste_colis_modifie[i][3];
            index_hauteur_max = i;
        }
    }
    new_liste_colis_modifie.push(AP_liste_colis_modifie[index_hauteur_max]);
    AP_liste_colis_modifie.splice(index_hauteur_max, 1);
    if (AP_liste_colis_modifie.length != 0) {
        AP_tri_hauteur(new_liste_colis_modifie);
    }
    else {
        AP_liste_colis_modifie = new_liste_colis_modifie;
    }
}

// Affiche la AP_palette finale trouvée.
function AP_affichage_palette(placement_trouve=true) {
    if (!placement_trouve) {
        AP_result = [];
        console.log([]);
        return;
    }
    AP_result = AP_palette;
}

function AP_first_main() {
    AP_palette_place_vide = 0;
    AP_meilleur_palette = [];
    for (let j=0; j<AP_palette.length; j++) {
        AP_meilleur_palette.push([]);
        for (let i=0; i<AP_palette[j].length; i++) {
            AP_meilleur_palette[j].push(0);
            AP_palette_place_vide++;
        }
    }

    // Initialisation des variables.
    AP_hauteur_max = 0;
    AP_facteur_superposition = 1;
    AP_id = 1;
    AP_liste_colis_modifie = [];
    AP_LC = [];
    AP_placement_ok = false;

    AP_creation_lc_modif();
    AP_tri_hauteur([]);

    AP_hauteur_max = AP_liste_colis_modifie[0][3];
    AP_LC = [];

    AP_creation_LC();
    AP_main();
}
