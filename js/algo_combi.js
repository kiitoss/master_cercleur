let ma_liste = [new myItem("A", 50), new myItem("B", 55), new myItem("C", 55), new myItem("D", 55), new myItem("E", 55), new myItem("F", 50), new myItem("G", 10), new myItem("H", 10), new myItem("I", 10), new myItem("J", 10)];
let possibilite = [];
let hauteur_max = 250;

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
    // while (possibilite.length > 0 && liste[0].nom == possibilite[possibilite.length - 1][0] && possibilite[possibilite.length - 1].length < liste.length) {
    //     possibilite.splice(possibilite.length-1, 1);
    // }
    let result = [];
    for (let i=0; i<liste.length; i++) {
        result.push(liste[i].nom);
    }
    possibilite.push(result);
}



function merge_listes(mes_palettes) {
    recursion++;
    if (recursion%1000000 == 0) {
        console.log(recursion/1000000);
    }
    let total_commandes = 0;
    let total_palettes = 0;
    for (let i=0; i<mes_palettes.length; i++) {
        total_palettes++;
        for (let j=0; j<mes_palettes[i].length; j++) {
            total_commandes++;
        }
    }


    if (total_commandes == ma_liste.length) {
        if (min_palettes == null || total_palettes < min_palettes) {
            min_palettes = total_palettes;
            meilleur_arrangement = mes_palettes;
        }
        return;
    }
    else if(min_palettes != null && total_palettes >= min_palettes) {
        return;
    }

    let copie_ma_liste = copie_liste(ma_liste);
    let elements_presents = [];
    for (let i=0; i<mes_palettes.length; i++) {
        for (j=0; j<mes_palettes[i].length; j++) {
            elements_presents.push(mes_palettes[i][j]);
            for (let k=0; k<elements_presents.length; k++) {
                for (l=0; l<copie_ma_liste.length; l++) {
                    if (copie_ma_liste[l].nom == elements_presents[k]) {
                        copie_ma_liste.splice(l, 1);
                        break;
                    }
                }
            }
        }
    }
    for (let k=0; k<copie_ma_liste.length; k++) {
        let contient_commande = [];
        for (let l=0; l<possibilite.length; l++) {
            for (m=0; m<possibilite[l].length; m++) {
                if (possibilite[l][m] == copie_ma_liste[k].nom) {
                    contient_commande.push(possibilite[l]);
                    break;
                }
            }
        }

        for (let l=0; l<contient_commande.length; l++) {
            let deja_present = false;
            let m=0;
            while (m < contient_commande[l].length) {
                for (let n=0; n<elements_presents.length; n++) {
                    if (elements_presents[n] == contient_commande[l][m]) {
                        deja_present = true;
                        break;
                    }
                }
                if (deja_present) {
                    break;
                }
                m++;
            }
            if (!deja_present) {
                let copie_mes_palettes = [];
                for (let m=0; m<mes_palettes.length; m++) {
                    copie_mes_palettes.push([]);
                    for (let n=0; n<mes_palettes[m].length; n++) {
                        copie_mes_palettes[m].push(mes_palettes[m][n]);
                    }
                }
                copie_mes_palettes.push(contient_commande[l]);
                merge_listes(copie_mes_palettes);
            }
        }
    }
}

function main() {
    combi([], ma_liste);
    for (let i=0; i<possibilite.length; i++) {
        if (possibilite[i].length == ma_liste.length) {
            meilleur_arrangement = [possibilite[i]];
            break;
        }
        merge_listes(possibilite[i]);
    }
    console.log(meilleur_arrangement);
}

main();