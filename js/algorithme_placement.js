var palette = [
    ["0","0","0","0","0","0","0","0"],
    ["0","0","0","0","0","0","0","0"],
    ["0","0","0","0","0","0","0","0"],
    ["0","0","0","0","0","0","0","0"]
]

var infos_colis = [
    new type_colis("carton bois", 4, 2, 10.5, 8, "brown"),
    new type_colis("carton beige", 4, 2, 10.5, 8, "yellow"),
    new type_colis("IFCO", 4, 2, 10.5, 8, "green")
]

// Création d'une copie de la palette pour conserver la meilleure palette pendant la recherche.
var palette_place_vide = 0;
var meilleur_palette = [];
for (let j=0; j<palette.length; j++) {
    meilleur_palette.push([]);
    for (let i=0; i<palette[j].length; i++) {
        meilleur_palette[j].push(0);
        palette_place_vide++;
    }
}


// Initialisation des variables.
var hauteur_max = 0;
var facteur_superposition = 1;
var id = 1;
var liste_colis = [[2, 0], [10, 1], [5, 2]];
var liste_colis_modifie = [];

creation_lc_modif();
tri_hauteur([]);
hauteur_max = liste_colis_modifie[0][3];
var LC = [];
creation_LC();

var placement_ok = false;

// Créé une copie de la liste des colis à partir de la liste originale.
function creation_lc_modif() {
    liste_colis_modifie = [];
    for (let i=0; i<liste_colis.length; i++) {
        let quantite = liste_colis[i][0];
        let type_colis = infos_colis[liste_colis[i][1]];
        let superpose = 1;
        
        liste_colis_modifie.push([quantite, type_colis.longueur, type_colis.largeur, type_colis.hauteur, superpose, type_colis.nom]);
    }
}

function type_colis(nom, longueur, largeur, hauteur, nb_par_rang, couleur) {
    this.nom = nom;
    this.longueur = longueur;
    this.largeur = largeur;
    this.hauteur = hauteur;
    this.nb_par_rang = nb_par_rang;
    this.couleur = couleur;
}

// Créé l'objet Colis.
function Colis(longueur, largeur, hauteur, superpose, nom_colis) {
    this.id = superpose+"x"+nom_colis+"-("+id+")";
    id++;
    this.longueur = longueur;
    this.largeur = largeur;
    this.hauteur = hauteur;
    this.superpose = superpose;
}

// LC est une liste composé de chaque colis.
function creation_LC() {
    LC = [];
    id = 1;
    for (let i=0; i<liste_colis_modifie.length; i++) {
        for (let j=0; j<liste_colis_modifie[i][0]; j++) {
            LC.push(new Colis(liste_colis_modifie[i][1], liste_colis_modifie[i][2], liste_colis_modifie[i][3], liste_colis_modifie[i][4], liste_colis_modifie[i][5]));
        }
    }
}

// Fonction principale, test les placement et change la hauteur si aucun placement n'est trouvé.
function main() {
    test_placement();
    if (placement_ok) {
        affichage_palette();
    }
    else {
        facteur_superposition++;
        change_hauteur_max();
    }
}

// Change la hauteur max en mémoire.
function change_hauteur_max() {
    creation_lc_modif();
    tri_hauteur([]);

    let plus_petit_max = liste_colis_modifie[0][3] * facteur_superposition;
    
    
    let modif = false;
    for (let i=0; i<liste_colis_modifie.length; i++) {
        if (liste_colis_modifie[i][0] >= facteur_superposition) {
            modif = true;
        }
        let facteur = 2;
        while (liste_colis_modifie[i][0] >= facteur) {
            if ((liste_colis_modifie[i][3] * facteur > hauteur_max) && (liste_colis_modifie[i][3] * facteur <= plus_petit_max)) {
                plus_petit_max = liste_colis_modifie[i][3] * facteur;
                break;
            }
            facteur++;
        }
    }

    hauteur_max = plus_petit_max;
    if (modif) {
        superpose_colis();
    }
    else {
        palette = meilleur_palette;

        let palette_vide = true;
        for (let j=0; j<meilleur_palette.length; j++) {
            for (let i=0; i<meilleur_palette[j].length; i++) {
                if (meilleur_palette[j][i] != 0) {
                    palette_vide = false;
                    break;
                }
            }
        }

        if (palette_vide) {
            console.log("Aucune solution trouvée.");
            affichage_palette(false);
        }
        else {
            affichage_palette();
        }
    }
}

// Superpose les colis (tant que la taille reste inférieure à 'hauteur_max').
function superpose_colis() {
    let colis_a_inserer = [];
    for (let i=liste_colis_modifie.length-1; i>-1; i--) {
        let facteur = 1;
        while ((liste_colis_modifie[i][0] > facteur) && (liste_colis_modifie[i][3] * (facteur+1) <= hauteur_max)) {
            facteur++;
        }
        if (liste_colis_modifie[i][0] % facteur != 0) {
            let ajout = [];
            for (let j=0; j<liste_colis_modifie[i].length; j++) {
                ajout.push(liste_colis_modifie[i][j]);
            }
            colis_a_inserer.push(ajout);
            colis_a_inserer[colis_a_inserer.length - 1][0] = (liste_colis_modifie[i][0] % facteur);
        }
        liste_colis_modifie[i][0] = parseInt(liste_colis_modifie[i][0] / facteur);
        liste_colis_modifie[i][3] *= facteur;
        liste_colis_modifie[i][4] = facteur;
    }

    for (let i=0; i<colis_a_inserer.length; i++) {
        liste_colis_modifie.push(colis_a_inserer[i]);
    }
    main();
}


// Lanceur de la fonction 'place()' après avoir copié la palette.
function test_placement() {
    creation_LC();
    tri_volume([]);
    // Création d'une copie de la palette originale.
    let nouvelle_palette = [];
    for (let j=0; j<palette.length; j++) {
        nouvelle_palette.push([]);
        for (let i=0; i<palette[j].length; i++) {
            nouvelle_palette[j].push(0);
        }
    }

    // Placement des colis sur la palette copie.
    place(nouvelle_palette, 0, 0, 0, []);
}

// Place les colis sur la palette.
function place(ma_palette, index, pos_x, pos_y, liste_places) {
    if (index > LC.length-1) {
        return;
    }

    let colis = LC[index];

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
        place_longueur(nouvelle_palette, colis, cp_pos_x, cp_pos_y, cp_liste_places, cp_index);
    
        // Si la longueur est différente de la largeur, on reproduit en inversant longueur/largeur.
        if (colis.longueur != colis.largeur) {
            let change = colis.longueur;
            colis.longueur = colis.largeur;
            colis.largeur = change;
        }
    }
}

// Place le colis sur tous les espaces possibles de la palette, appel 'place()' à chaque placement valide.
function place_longueur(test_palette, colis, pos_x, pos_y, colis_places, my_index) {
    if ((test_palette[pos_y].length - pos_x < colis.longueur) || test_palette.length - pos_y < colis.largeur) {
        return false;
    }

    for (let j=0; j<colis.largeur; j++) {
        for (let i=0; i<colis.longueur; i++) {
            test_palette[j+pos_y][i+pos_x] = colis.id;
        }
    }

    colis_places.push(colis);

    if (colis_places.length == LC.length) {
        let test_palette_place_vide = 0;
        for (let j=0; j<test_palette.length; j++) {
            for (let i=0; i<test_palette[j].length; i++) {
                if (test_palette[j][i] == 0) {
                    test_palette_place_vide++;
                }
            }
        }
        if (test_palette_place_vide == 0) {
            palette = test_palette;
            placement_ok = true;
        }
        else if (test_palette_place_vide < palette_place_vide) {
            palette_place_vide = test_palette_place_vide;
            meilleur_palette = test_palette;
        }
    }

    if (!placement_ok) {
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
                    place(test_palette, my_index+1, i, j, colis_places);
                }
            }
        }
    }
}

// Tri la liste LC par aire (décroissant).
function tri_volume(new_LC) {
    let aire_max = 0;
    let index_aire_max = 0;
    for (let i=0; i<LC.length; i++) {
        if (LC[i].longueur * LC[i].largeur >= aire_max) {
            aire_max = LC[i].longueur * LC[i].largeur;
            index_aire_max = i;
        }
    }
    new_LC.push(LC[index_aire_max]);
    LC.splice(index_aire_max, 1);
    if (LC.length != 0) {
        tri_volume(new_LC);
    }
    else {
        LC = new_LC;
    }
}

// Tri la liste liste_colis_modifie par hauteur (décroissant).
function tri_hauteur(new_liste_colis_modifie) {
    let hauteur_max = 0;
    let index_hauteur_max = 0;
    for (let i=0; i<liste_colis_modifie.length; i++) {
        if (liste_colis_modifie[i][3] >= hauteur_max) {
            hauteur_max = liste_colis_modifie[i][3];
            index_hauteur_max = i;
        }
    }
    new_liste_colis_modifie.push(liste_colis_modifie[index_hauteur_max]);
    liste_colis_modifie.splice(index_hauteur_max, 1);
    if (liste_colis_modifie.length != 0) {
        tri_hauteur(new_liste_colis_modifie);
    }
    else {
        liste_colis_modifie = new_liste_colis_modifie;
    }
}

// Affiche la palette finale trouvée.
function affichage_palette(placement_trouve=true) {
    if (!placement_trouve) {
        console.log([]);
        return;
    }
    for (let i=0; i<palette.length; i++) {
        console.log(palette[i]);
    }
}

main()