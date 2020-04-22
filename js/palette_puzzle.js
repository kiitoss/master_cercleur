// Fonction principale:
// Créé les boutons correspondant aux commandes,
// Redimensionne la section "affichage_palette".
function main() {
    let commande_recues = [[10, "aa"], [20, "aa"], [15, "aa"], [30, "aa"]];
    let liste_commandes = [];
    for (let i=0; i<commande_recues.length; i++) {
        liste_commandes.push(new Commande(commande_recues[i][0], commande_recues[i][1]));
    }

    affiche_barres_max_danger();
}







// Redimensionne la section "affichage_palette" et positionne les barres "danger" et "maximum".
function affiche_barres_max_danger() {
    // Affectation de la hauteur de "affichage_palette" en fonction de la hauteur de "choix_palette".
    let height_choix_palettes = document.getElementById("choix_commandes").offsetHeight;
    let hauteur_section = window.innerHeight * 90 / 100 - height_choix_palettes;
    document.getElementById("affichage_palette").style.height = hauteur_section+"px";

    let hauteur_max = 265;
    let hauteur_dangereuse = 250;
    let ratio_hauteur = hauteur_section*0.9 / hauteur_max;

    document.getElementById("barre_maximum").style.top = hauteur_section-hauteur_max*ratio_hauteur+"px";
    document.getElementById("barre_danger").style.top = hauteur_section-hauteur_dangereuse*ratio_hauteur+"px";
}




// Objet commande, correspond à une commande (une quantité et un type de colis).
function Commande(nb_colis, type_colis) {
    this.estAffiche = false;
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
    return 40;
}

// Affiche ou efface la commande (dans la section "affichage_palette") lors d'un clic sur une commande (dans la section "choix_commande").
function ajout_suppression_commande(commande) {
    commande.estAffiche = !commande.estAffiche;
    console.log(commande.estAffiche+" - "+commande.hauteur);
}





main();
