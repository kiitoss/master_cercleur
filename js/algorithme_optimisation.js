var id=0;
var infos_colis = [
    ["carton bois", 10.5, 8, "brown"],
    ["carton beige", 2, 8, "yellow"],
    ["IFCO", 250, 2, "green"]
];
var commandes_places = [new Commande(54, "carton beige", 1), new Commande(25, "carton beige", 1)];

function Commande(nb_colis, type_colis, nb_palettes) {
    this.id = id;
    id++;
    this.nb_colis = nb_colis;
    this.type_colis = type_colis;
    this.nb_palettes = nb_palettes;

    this.estAffiche = false;
    this.position_y = 0;

    this.aOptimiser = false;
    this.hauteur_reste = 0;

    this.modif_qte = 0;
    this.nb_par_rang = 1;

    this.reste = 0;
    this.hauteur_colis = 1;
    for (let i=0; i<infos_colis.length; i++) {
        if (infos_colis[i][0] == type_colis) {
            this.nb_par_rang = infos_colis[i][2];
            this.hauteur_colis = infos_colis[i][1];
            break;
        }
    }
    calcul_rangs_hauteur(this);
}

function main() {
    fusion_colis_identiques();
    for (let i=0; i<commandes_places.length; i++) {
        calcul_rangs_hauteur(commandes_places[i]);
    }
    console.log(commandes_places);
    // Les colis sont fusionnés, les hauteurs sont recalculées.
}


function calcul_rangs_hauteur(commande) {
    commande.reste = (commande.nb_colis + commande.modif_qte) % commande.nb_par_rang;
    commande.nb_rangs = parseInt((commande.nb_colis + commande.modif_qte) / commande.nb_par_rang);
    if (commande.reste != 0) {
        commande.nb_rangs++;
    }
    commande.hauteur = commande.nb_rangs * commande.hauteur_colis;
}




function fusion_colis_identiques() {
    for (let i=0; i<commandes_places.length; i++) {
        if (commandes_places[i].reste == 0) {
            continue;
        }
        let type_carton = commandes_places[i].type_carton;
        for (let j=i+1; j<commandes_places.length; j++) {
            if (commandes_places[j].reste == 0) {
                continue;
            }
            if (commandes_places[j].type_carton == type_carton) {
                if (commandes_places[i].reste > commandes_places[j].reste) {
                    commandes_places[i].modif_qte = commandes_places[j].reste;
                    commandes_places[j].modif_qte = -commandes_places[j].reste;
                    commandes_places[i].reste += commandes_places[j].reste % commandes_places[i].nb_par_rang;
                    commandes_places[j].reste = 0;
                }
                else if (commandes_places[i].reste < commandes_places[j].reste){
                    commandes_places[j].modif_qte = commandes_places[i].reste;
                    commandes_places[i].modif_qte = -commandes_places[i].reste;
                    commandes_places[j].reste += commandes_places[i].reste % commandes_places[j].nb_par_rang;
                    commandes_places[i].reste = 0;
                }
                else {
                    if (commandes_places[i].nb_colis > commandes_places[j].nb_colis) {
                        commandes_places[i].modif_qte = commandes_places[j].reste;
                        commandes_places[j].modif_qte = -commandes_places[j].reste;
                        commandes_places[i].reste += commandes_places[j].reste % commandes_places[i].nb_par_rang;
                        commandes_places[j].reste = 0;
                    }
                    else {
                        commandes_places[j].modif_qte = commandes_places[i].reste;
                        commandes_places[i].modif_qte = -commandes_places[i].reste;
                        commandes_places[j].reste += commandes_places[i].reste % commandes_places[j].nb_par_rang;
                        commandes_places[i].reste = 0;
                    }
                }
            }
            if ((commandes_places[i].nb_colis + commandes_places[i].modif_qte) % commandes_places[i].nb_par_rang == 0) {
                break;
            }
        }
    }
}

main();