var commandes_places = [];
var hauteur_totale = 0;
var ratio_hauteur = 1;
var liste_restes = [];
var palette_hauteur = 14.5;

var infos_colis = [
    ["carton bois", 10.5, 8, "brown"],
    ["carton beige", 2, 8, "yellow"],
    ["IFCO", 250, 2, "green"]
];

var hauteur_dangereuse = 250;
var hauteur_max = 265;

// Récupération des variables stockées en local.
var CH_commandes_places = JSON.parse(localStorage.getItem('CH_commandes_places'));
if (!CH_commandes_places) {
    alert("Erreur passation liste commandes placées.");
    location.href = "./index.html";
}
else {
    commandes_places = CH_commandes_places;
    console.log(commandes_places);
    main();
}


function main() {
    for (let i=0; i<infos_colis.length; i++) {
        liste_restes.push([infos_colis[i][0], infos_colis[i][1], 0]);
    }

    // Récupération de la hauteur totale des palettes placées (sans les derniers rangs si l'on veut les optimiser).
    for (let i=0; i<commandes_places.length; i++) {
        if ((commandes_places[i].reste != 0) && commandes_places[i].aOptimiser) {
            hauteur_totale += commandes_places[i].hauteur - commandes_places[i].hauteur_reste;
            for (let j=0; j<liste_restes.length; j++) {
                if (liste_restes[j][0] == commandes_places[i].type_colis) {
                    liste_restes[j][2] += commandes_places[i].reste;
                    break;
                }
            }

        }
        else {
            hauteur_totale += commandes_places[i].hauteur;
        }
    }

    let hauteur_dessin_colis = 0;
    let couleur_colis = null;
    for (let i=commandes_places.length-1; i>=0; i--) {
        if (commandes_places[i].nb_colis - commandes_places[i].reste > 0) {
            for (let j=0; j<infos_colis.length; j++) {
                if (infos_colis[j][0] == commandes_places[i].type_colis) {
                    hauteur_dessin_colis = infos_colis[j][1];
                    couleur_colis = infos_colis[j][3];
                    break;
                }
            }
            break;
        }
    }



    let taille = hauteur_max * 1.1 - hauteur_totale + hauteur_dessin_colis;
    let hauteur_affichage_palette = document.getElementById("affichage_palette").offsetHeight;
    let ratio = hauteur_affichage_palette / taille;
    document.getElementById("barre_maximum").style.top = (hauteur_max * 1.1 - hauteur_max) * ratio + "px";
    document.getElementById("barre_danger").style.top = (hauteur_max * 1.1 - hauteur_dangereuse) * ratio + "px";

    if (hauteur_dessin_colis != 0) {
        document.getElementById("dessin_commande").style.display = "block";
        document.getElementById("dessin_commande").style.height = hauteur_dessin_colis * ratio + "px";
        document.getElementById("dessin_commande").style.backgroundColor = couleur_colis;
    }

    let top_fleche_label = window.innerHeight - document.getElementById("affichage_palette").offsetHeight + (hauteur_max * 1.1 - hauteur_max) * ratio;
    document.getElementById("fleche").style.height = (hauteur_max - hauteur_totale - hauteur_dessin_colis) * ratio + "px";
    document.getElementById("fleche").style.width = ((hauteur_max - hauteur_totale - hauteur_dessin_colis) * ratio) / 10 + "px";
    document.getElementById("fleche").style.top = top_fleche_label + "px";

    document.getElementById("label_taille_restante").style.height = (hauteur_max - hauteur_totale - hauteur_dessin_colis) * ratio + "px";
    if ((hauteur_max - hauteur_totale - hauteur_dessin_colis) * ratio > 20) {
        document.getElementById("label_taille_restante").style.lineHeight = (hauteur_max - hauteur_totale - hauteur_dessin_colis) * ratio + "px";
    }
    document.getElementById("label_taille_restante").style.width = "calc(min(25vw, 25vh) - " + ((hauteur_max - hauteur_totale - hauteur_dessin_colis) * ratio) / 10 + "px)";
    document.getElementById("label_taille_restante").style.top = top_fleche_label + "px";
    document.getElementById("label_taille_restante").style.left = "calc(min(75vw, 75vh) + " + ((hauteur_max - hauteur_totale - hauteur_dessin_colis) * ratio) / 10 + "px)";
    
    document.getElementById("label_taille_restante").innerHTML = hauteur_max - hauteur_totale;
    




    let liste_colis_retants = document.getElementById("liste_colis_retants");
    let palette = document.createElement("li");
    palette.setAttribute("class", "colis_restant");

    let palette_nb = document.createElement("div");
    palette_nb.setAttribute("class", "cellule");
    palette_nb.innerHTML = "1 x palette";

    let hauteur_palette = document.createElement("div");
    hauteur_palette.setAttribute("class", "cellule");
    hauteur_palette.innerHTML = "hauteur: "+palette_hauteur;

    palette.appendChild(palette_nb);
    palette.appendChild(hauteur_palette);

    liste_colis_retants.append(palette);

    for (let i=0; i<liste_restes.length; i++) {
        if (liste_restes[i][2] > 0) {
            let nouveau_colis_restant = document.createElement("li");
            nouveau_colis_restant.setAttribute("class", "colis_restant");

            let nombre_colis = document.createElement("div");
            nombre_colis.setAttribute("class", "cellule");
            nombre_colis.innerHTML = liste_restes[i][2]+" x "+liste_restes[i][0];

            let hauteur_colis = document.createElement("div");
            hauteur_colis.setAttribute("class", "cellule");
            hauteur_colis.innerHTML = "hauteur: "+liste_restes[i][1];

            nouveau_colis_restant.appendChild(nombre_colis);
            nouveau_colis_restant.appendChild(hauteur_colis);

            liste_colis_retants.append(nouveau_colis_restant);
        }
    }
}