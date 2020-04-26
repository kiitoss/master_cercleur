// Donner score au résultat trouvé.
// Selectionner le meilleur score.
// Vérifier l'algo de superposition.

var palette = [
    [0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0]
]

var facteur_superpose = 1;
var id = 1;
var liste_colis = [[2, 4, 2, 17, 1], [45, 2, 2, 15, 1], [4, 4, 2, 15, 1]];
var liste_colis_modifie = [];
creation_lc_modif();
tri_hauteur([]);
var LC = [];
creation_LC();

var placement_ok = false;

function creation_lc_modif() {
    liste_colis_modifie = [];
    for (let i=0; i<liste_colis.length; i++) {
        liste_colis_modifie.push(liste_colis[i]);
    }
}

function Colis(longueur, largeur, hauteur, superpose) {
    this.id = "";
    for (let i=0; i<superpose; i++) {
        this.id += id;
    }
    id++;
    this.longueur = longueur;
    this.largeur = largeur;
    this.hauteur = hauteur;
    this.superpose = superpose;
}

function creation_LC() {
    LC = [];
    id = 1;
    for (let i=0; i<liste_colis_modifie.length; i++) {
        for (let j=0; j<liste_colis_modifie[i][0]; j++) {
            LC.push(new Colis(liste_colis_modifie[i][1], liste_colis_modifie[i][2], liste_colis_modifie[i][3], liste_colis_modifie[i][4]));
        }
    }
}

function main() {
    test_placement();
    if (placement_ok) {
        affichage_palette();
    }
    else {
        console.log("aucun placement n'a pu être trouvé.");
        facteur_superpose++;
        superpose_colis();
    }
}


function superpose_colis() {
    creation_lc_modif();
    tri_hauteur([]);
    let hauteur_max_modifie = false;
    let modif_possible = false;
    let colis_a_inserer = [];
    for (let i=liste_colis_modifie.length-1; i>-1; i--) {
        if (liste_colis_modifie[i][0] >= facteur_superpose) {
            modif_possible = true;
            if (liste_colis_modifie[i][0] % facteur_superpose != 0) {
                let ajout = [];
                for (let j=0; j<liste_colis_modifie[i].length; j++) {
                    ajout.push(liste_colis_modifie[i][j]);
                }
                colis_a_inserer.push(ajout);
                colis_a_inserer[colis_a_inserer.length - 1][0] = (liste_colis_modifie[i][0] % facteur_superpose);
            }
            liste_colis_modifie[i][0] = parseInt(liste_colis_modifie[i][0] / facteur_superpose);
            liste_colis_modifie[i][3] *= facteur_superpose;
            liste_colis_modifie[i][4] = facteur_superpose;
            hauteur_max_modifie = true;
            break;
        }
    }

    for (let i=0; i<colis_a_inserer.length; i++) {
        liste_colis_modifie.push(colis_a_inserer[i]);
    }

    console.log(liste_colis_modifie);

    if (hauteur_max_modifie) {
        main();
    }
    else {
        if (modif_possible) {
            facteur_superpose++;
            superpose_colis();
        }
        else {
            console.log("Aucune solution trouvée.");
        }
    }
}



function test_placement() {
    creation_LC();
    console.log(LC);
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

function place(ma_palette, index, pos_x, pos_y, liste_places) {
    let colis = LC[index];
    let cp_index = index;
    let cp_index2 = index;
    let nouvelle_palette = [];
    let autre_palette = [];
    let cp_pos_x = pos_x;
    let cp_pos_x2 = pos_x;
    let cp_pos_y = pos_y;
    let cp_pos_y2 = pos_y;
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

    place_longueur(nouvelle_palette, colis, cp_pos_x, cp_pos_y, cp_liste_places, cp_index);
    if (colis.longueur != colis.largeur) {
        for (let j=0; j<ma_palette.length; j++) {
            autre_palette.push([]);
            for (let i=0; i<ma_palette[j].length; i++) {
                autre_palette[j].push(ma_palette[j][i]);
            }
        }
        let cp_liste_places2 = [];
        for (let i=0; i<liste_places.length; i++) {
            cp_liste_places2.push(liste_places[i]);
        }
        let change = colis.longueur;
        colis.longueur = colis.largeur;
        colis.largeur = change;
        place_longueur(autre_palette, colis, cp_pos_x2, cp_pos_y2, cp_liste_places2, cp_index2);
    }
}

function place_longueur(test_palette, colis, pos_x, pos_y, colis_places, my_index) {
    if ((test_palette[pos_y].length - pos_x < colis.longueur) || test_palette.length - pos_y < colis.largeur) {
        return false;
    }

    for (let j=0; j<colis.largeur; j++) {
        for (let i=0; i<colis.longueur; i++) {
            test_palette[j+pos_y][i+pos_x] = parseInt(colis.id);
        }
    }

    colis_places.push(colis);

    if (colis_places.length == LC.length) {
        palette = test_palette;
        placement_ok = true;
    }
    else {
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

function affichage_palette() {
    for (let i=0; i<palette.length; i++) {
        console.log(palette[i]);
    }
}

main()