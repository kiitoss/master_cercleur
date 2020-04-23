// Fonction principale:
// Créé les boutons correspondant aux commandes,
// Redimensionne la section "affichage_palette".
var ratio_hauteur = 1;
var couleurs = ["red", "blue", "green", "yellow"];
var pos_derniere_commande;
var commandes_places = [];

function main() {
    let commande_recues = [[10, "aa"], [20, "aa"], [15, "aa"], [30, "aa"]];
    let liste_commandes = [];
    for (let i=0; i<commande_recues.length; i++) {
        liste_commandes.push(new Commande(i, commande_recues[i][0], commande_recues[i][1]));
    }

    affiche_barres_max_danger();

    for (let i=0; i<liste_commandes.length; i++) {
        creation_dessin_commande(liste_commandes[i]);
    }
    
}







// Redimensionne la section "affichage_palette" et positionne les barres "danger" et "maximum".
function affiche_barres_max_danger() {
    // Affectation de la hauteur de "affichage_palette" en fonction de la hauteur de "choix_palette".
    let height_choix_palettes = document.getElementById("choix_commandes").offsetHeight;
    let hauteur_section = window.innerHeight * 90 / 100 - height_choix_palettes;
    document.getElementById("affichage_palette").style.height = hauteur_section+"px";
    pos_derniere_commande = document.getElementById("affichage_palette").offsetHeight - 5;

    let hauteur_max = 265;
    let hauteur_dangereuse = 250;
    ratio_hauteur = hauteur_section*0.9 / hauteur_max;

    document.getElementById("barre_maximum").style.top = hauteur_section-hauteur_max*ratio_hauteur+"px";
    document.getElementById("barre_danger").style.top = hauteur_section-hauteur_dangereuse*ratio_hauteur+"px";
}




// Objet commande, correspond à une commande (une quantité et un type de colis).
function Commande(id, nb_colis, type_colis) {
    this.id = id;
    index_couleur = id;
    while (index_couleur > couleurs.length) {
        index_couleur -= couleurs.length;
    }
    this.couleur = couleurs[index_couleur];
    this.estAffiche = false;
    this.position_y = 0;
    this.nb_colis = nb_colis;
    this.type_colis = type_colis;
    this.hauteur = calcule_hauteur(nb_colis, type_colis);
    creer_bouton_commande(this);
}

// Créer le bouton correspondant à la commande (pendant la création de l'objet Commande).
function creer_bouton_commande(commande) {
    let choix_commandes = document.getElementById("choix_commandes");
    let nouvelle_commande = document.createElement("button");
    nouvelle_commande.setAttribute("class", "commande_cliquable");
    nouvelle_commande.onclick = function() {
        ajout_suppression_commande(commande)
    };
    nouvelle_commande.innerHTML = commande.nb_colis;
    choix_commandes.appendChild(nouvelle_commande);
}

// Calcule la hauteur de la commande (pendant la création de l'objet Commande).
function calcule_hauteur(nb_colis, type_colis) {
    return 100;
}

// Création du div représentant la commande.
function creation_dessin_commande(commande) {
    let palette = document.getElementById("affichage_palette");
    let dessin_commande = document.createElement("div");
    dessin_commande.setAttribute("class", "dessin_commande");
    dessin_commande.setAttribute("id", "commande_"+commande.id);
    dessin_commande.innerHTML = commande.nb_colis;
    dessin_commande.style.height = commande.hauteur+"px";
    dessin_commande.style.backgroundColor = commande.couleur;
    dessin_commande.style.display = "none";
    palette.appendChild(dessin_commande);
}

// Affiche ou efface la commande (dans la section "affichage_palette") lors d'un clic sur une commande (dans la section "choix_commande").
function ajout_suppression_commande(commande) {
    if (commande.estAffiche) {
        // Suppression de la commande de la palette.
        for (let i=commandes_places.length-1; i>=0; i--) {
            if (commandes_places[i].id == commande.id) {
                pos_derniere_commande += commande.hauteur;
                document.getElementById("commande_"+commande.id).style.display = "none";
                commandes_places.splice(i, 1);
                break;
            }
            else {
                commandes_places[i].position_y += commande.hauteur
                document.getElementById("commande_"+commandes_places[i].id).style.top = commandes_places[i].position_y +"px";
            }
        }
    }
    else {
        // Ajout de la commande à la palette.
        let palette = document.getElementById("affichage_palette");
        let dessin_commande = document.getElementById("commande_"+commande.id);
        dessin_commande.style.display = "block";
        commande.position_y = pos_derniere_commande - commande.hauteur;
        dessin_commande.style.top = commande.position_y +"px";
        pos_derniere_commande = commande.position_y;
        commandes_places.push(commande);
    }
    commande.estAffiche = !commande.estAffiche;
    
}





main();