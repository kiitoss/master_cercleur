var hauteur_max_colis = 0;
var aire_palette = 23;
var LC = [new Commande(12,2,20), new Commande(8,4,30), new Commande(4,2,10)];


function Commande(aire, quantite, hauteur) {
    this.aire = aire;
    this.quantite = quantite;
    this.hauteur = hauteur;
    if (this.hauteur > hauteur_max_colis) {
        hauteur_max_colis = this.hauteur;
    }
}




function tri_LC_aire(old_LC, new_LC) {
    let maximum = 0;
    let index_max_aire = 0;
    for (let i=0; i<old_LC.length; i++) {
        if (old_LC[i].aire >= maximum) {
            maximum = old_LC[i].aire;
            index_max_aire = i;
        }
    }

    if (old_LC.length != 0) {
        new_LC.push(old_LC[index_max_aire]);
        old_LC.splice(index_max_aire, 1);
        tri_LC_aire(old_LC, new_LC);
    }
    else {
        LC = new_LC;
    }
}

function tri_LC_hauteur(old_LC, new_LC) {
    let maximum = 0;
    let index_max_hauteur = 0;
    for (let i=0; i<old_LC.length; i++) {
        if (old_LC[i].hauteur >= maximum) {
            maximum = old_LC[i].hauteur;
            index_max_hauteur = i;
        }
    }

    if (old_LC.length != 0) {
        new_LC.push(old_LC[index_max_hauteur]);
        old_LC.splice(index_max_hauteur, 1);
        tri_LC_hauteur(old_LC, new_LC);
    }
    else {
        LC = new_LC;
    }
}



function check() {
    tri_LC_aire(LC, []);
    aire_totale = 0;
    let tous_seul = true;
    for (let i=0; i<LC.length; i++) {
        if (LC[i].quantite > 1) {
            tous_seul = false;
        }
        aire_totale += (LC[i].aire * LC[i].quantite);
    }
    if (aire_totale <= aire_palette) {
        console.log("aire_totale:"+aire_totale+" - aire_palette:"+aire_palette+" - OK,placement palette");
        console.log(LC);
    }
    else {
        if (tous_seul) {
            console.log("RES FINAL");
            console.log(LC);
            return;
        }
        tri_LC_aire(LC, []);
        let old_LC = [];
        for (let i=0; i<LC.length; i++) {
            old_LC.push(LC[i]);
        }
        empile_plus_petit();
        let same = true;
        if (LC.length != old_LC.length) {
            same = false;
        }
        else {
            for (let i=0; i<LC.length; i++) {
                if (LC[i] != old_LC[i]) {
                    same = false;
                }
            }
        }
        if (!same) {
            check();
        }
        else {
            let nouveau_max = hauteur_max_colis * 2;
            for (let i=0; i<LC.length; i++) {
                if (LC[i].quantite < 2) {
                    continue;
                }
                let facteur = 2;
                while ((LC[i].hauteur * facteur <= hauteur_max_colis) && (facteur+1 <= LC[i].quantite)) {
                    facteur++;
                }
                if ((LC[i].hauteur * facteur > hauteur_max_colis) && (LC[i].hauteur * facteur <= nouveau_max)) {
                    nouveau_max = LC[i].hauteur * facteur;
                }
            }

            hauteur_max_colis = nouveau_max;
            check();
        }
    }
}


function empile_plus_petit() {
    tri_LC_hauteur(LC, []);
    let i = LC.length - 1;
    while (i > -1) {
        let facteur = 1;
        if (LC[i].quantite < 2) {
            i--;
            continue;
        }
        while ((LC[i].quantite > facteur) && (LC[i].hauteur * (facteur + 1) <= hauteur_max_colis)) {
            facteur++;
        }
        if (facteur == 1) {
            break;
        }
        recoupe_commande(i, facteur);
        i--;
    }
    tri_LC_aire(LC, []);
}


function recoupe_commande(index, facteur) {
    if (LC[index].quantite % facteur != 0) {
        LC.push(new Commande(LC[index].aire, LC[index].quantite % facteur, LC[index].hauteur));
    }
    LC[index].quantite = parseInt(LC[index].quantite / facteur);
    LC[index].hauteur *= facteur;
    tri_LC_aire(LC, []);
}

function main() {
    check()
}


main();