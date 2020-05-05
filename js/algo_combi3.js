let ma_liste = [new myItem("A", 50), new myItem("B", 55), new myItem("C", 55), new myItem("D", 55), new myItem("E", 55), new myItem("F", 50), new myItem("G", 10), new myItem("H", 10), new myItem("I", 10), new myItem("J", 10)];
// let ma_liste = [new myItem("A", 50), new myItem("B", 55), new myItem("C", 55), new myItem("D", 55), new myItem("E", 10), new myItem("F", 10)];
// JSON.parse(JSON.stringify(mes_palettes[m][n]))
let possibilite = [];
let hauteur_max = 105;

var mes_palettes = [];

function myItem(nom, hauteur) {
    this.nom = nom;
    this.hauteur = hauteur;
}

var min_palettes = null;
var meilleur_arrangement = null;
var recursion = 0;

function combi(liste0, liste) {
    for (let i=0; i<liste.length; i++) {
        let cp_liste0 = copie_liste(liste0);
        let cp_liste = copie_liste(liste);
        cp_liste.splice(0,i+1);

        let hauteur = 0;
        for (let k=0; k<cp_liste0.length; k++) {
            hauteur += cp_liste0[k].hauteur;
        }
        hauteur += liste[i].hauteur;
        if (hauteur <= hauteur_max) {
            cp_liste0.push(liste[i]);
            ajoute_combi(cp_liste0, cp_liste);

            combi(cp_liste0, cp_liste);
        }

        
    }    
}

function copie_liste(liste) {
    let new_liste = [];
    for (let i=0; i<liste.length; i++) {
        new_liste.push(JSON.parse(JSON.stringify(liste[i])));
    }
    return new_liste;
}




function ajoute_combi(liste, reste) {
    let result = [];
    for (let i=0; i<liste.length; i++) {
        result.push(liste[i].nom);
    }
    possibilite.push(result);
}



function creation_liste_palettes() {
    let liste_palettes = [];
    for (let i=0; i<possibilite.length; i++) {
        let reste = supprime_element(possibilite[i], possibilite);
        liste_palettes.push([[possibilite[i]], reste]);
    }
    return liste_palettes;
}

function supprime_element(liste_elements, liste_palettes) {
    let copie_liste_palettes = copie_liste(liste_palettes);
    for (let i=0; i<liste_elements.length; i++) {
        let index = 0;
        while (index < copie_liste_palettes.length) {
            let deja_present = false;
            for (let j=0; j<copie_liste_palettes[index].length; j++) {
                if (copie_liste_palettes[index][j] == liste_elements[i]) {
                    deja_present = true;
                    break;
                }
            }
            if (deja_present) {
                copie_liste_palettes.splice(index, 1);
                continue;
            }
            index++;
        }
    }
    return copie_liste_palettes;
}

function repartition(liste_palettes) {
    for (let i=0; i<liste_palettes.length; i++) {
        repartition_branche(liste_palettes[i]);
    }
    // console.log(liste_palettes[0]);
    // repartition_branche(liste_palettes[0]);
    console.log(meilleur_arrangement);
}

function repartition_branche(liste_palettes) {
    // console.log(min_palettes);
    if (min_palettes != null && liste_palettes[0] >= min_palettes) {
        return;
    }

    let total = 0;
    for (let i=0; i<liste_palettes[0].length; i++) {
        for (let j=0; j<liste_palettes[0][i].length; j++) {
            total++;
        }
    }
    if (total == ma_liste.length) {
        if (min_palettes == null || liste_palettes[0].length < min_palettes) {
            min_palettes = liste_palettes[0].length;
            meilleur_arrangement = liste_palettes[0];
        }
        return;
    }
    // console.log(liste_palettes);
    let deja_presents = [];
    for (let j=0; j<liste_palettes[0].length; j++) {
        for (let k=0; k<liste_palettes[0][j].length; k++) {
            deja_presents.push(liste_palettes[0][j][k]);
        }
    }
    // console.log(deja_presents);

    for (let j=0; j<liste_palettes[1].length; j++) {
        let a_placer = true;
        for (let k=0; k<liste_palettes[1][j].length; k++) {
            for (let l=0; l<deja_presents.length; l++) {
                if (liste_palettes[1][j][k] == deja_presents[l]) {
                    a_placer = false;
                    break;
                }
            }
            if (!a_placer) {
                break;
            }
        }
        if (a_placer) {
            let copie_lp = [];
            for (let k=0; k<liste_palettes.length; k++) {
                copie_lp.push([]);
                for (let l=0; l<liste_palettes[k].length; l++) {
                    copie_lp[k].push([]);
                    for (let m=0; m<liste_palettes[k][l].length; m++) {
                        copie_lp[k][l].push(liste_palettes[k][l][m]);
                    }
                }
            }
            // console.log(copie_lp);
            copie_lp[0].push(liste_palettes[1][j]);
            copie_lp[1].splice(j, 1);
            // console.log(copie_lp);
            repartition_branche(copie_lp);
        }
    }
}

function main() {
    combi([], ma_liste);

    let max_empil = null;
    let index_max_empil = 0;
    for (let i=0; i<possibilite.length; i++) {
        if (max_empil == null || possibilite[i].length > max_empil) {
            max_empil = possibilite[i].length;
            index_max_empil = i;
        }
    }
    possibilite.splice(0,0,possibilite[index_max_empil])
    possibilite.splice(index_max_empil+1, 1);

    liste_palettes = creation_liste_palettes();
    // for (let i=0; i<liste_palettes.length; i++) {
    //     console.log(liste_palettes);
    // }
    repartition(liste_palettes);
}

main();