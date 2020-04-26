var liste_commandes = [];
var ratio_hauteur = 1;
var couleurs = ["red", "blue", "green", "yellow"];
var pos_derniere_commande;
var commandes_places = [];
var hauteur_actuelle = 0;
var optimisation_en_cours = false;
var commandes_aOptimiser = [];

var infos_colis = [
    ["carton bois", 10.5, 8, "brown"],
    ["carton beige", 2, 8, "yellow"],
    ["IFCO", 250, 2, "green"]
];

// Récupération des variables stockées en local.
var commande_recues = [];
var CH_listeCommandes = localStorage.getItem('CH_listeCommandes');
if ((!CH_listeCommandes) || (CH_listeCommandes.split(',').length%3 != 0)) {
    alert("Erreur passation liste commandes.");
    location.href = "./index.html";
}
else {
    CH_listeCommandes = CH_listeCommandes.split(',')
    for (let i=0; i<CH_listeCommandes.length; i+=3) {
        commande_recues.push([CH_listeCommandes[i], CH_listeCommandes[i+1], CH_listeCommandes[i+2]]);
    }
    main();
}

// Fonction principale qui va créer chaque objet 'Commande'.
function main() {
    for (let i=0; i<commande_recues.length; i++) {
        liste_commandes.push(new Commande(i, commande_recues[i][0], commande_recues[i][1], commande_recues[i][2]));
    }

    affiche_barres_max_danger();

    for (let i=0; i<liste_commandes.length; i++) {
        affecte_hauteurs_couleur(liste_commandes[i]);
        creation_dessin_commande(liste_commandes[i]);
    }

    document.getElementById("label_hauteur_actuelle").style.top = document.getElementById("choix_commandes").offsetHeight + "px"; 
}


// Redimensionne la section "affichage_palette" et positionne les barres "danger" et "maximum".
function affiche_barres_max_danger() {
    // Affectation de la hauteur de "affichage_palette" en fonction de la hauteur de "choix_palette".
    let height_choix_palettes = document.getElementById("choix_commandes").offsetHeight;
    let hauteur_section = window.innerHeight * 90 / 100 - height_choix_palettes;
    document.getElementById("affichage_palette").style.height = hauteur_section+"px";
    pos_derniere_commande = document.getElementById("affichage_palette").offsetHeight;

    let hauteur_max = 265;
    let hauteur_dangereuse = 250;
    ratio_hauteur = hauteur_section*0.9 / hauteur_max;

    document.getElementById("barre_maximum").style.top = hauteur_section-hauteur_max*ratio_hauteur+"px";
    document.getElementById("barre_danger").style.top = hauteur_section-hauteur_dangereuse*ratio_hauteur+"px";
}


// Objet commande, correspond à une commande (une quantité et un type de colis).
function Commande(id, nb_colis, type_colis, nb_palettes) {
    this.id = id;

    this.nb_colis = nb_colis;
    this.type_colis = type_colis;
    this.nb_palettes = nb_palettes;

    this.estAffiche = false;
    this.position_y = 0;

    this.aOptimiser = false;
    this.hauteur_reste = 0;

    creer_bouton_commande(this);
}


// Créer le bouton correspondant à la commande (pendant la création de l'objet Commande).
function creer_bouton_commande(commande) {
    let choix_commandes = document.getElementById("choix_commandes");
    let nouvelle_commande = document.createElement("button");
    nouvelle_commande.setAttribute("class", "commande_cliquable");
    nouvelle_commande.onclick = function() {
        ajout_suppression_commande(this, commande)
    };
    nouvelle_commande.innerHTML = commande.nb_colis;
    choix_commandes.appendChild(nouvelle_commande);
}


// Affecte aux commande les hauteurs (normale et redimensionnées pour la page) et la couleur.
function affecte_hauteurs_couleur(commande) {
    colis_existe = false;
    for (let i=0; i<infos_colis.length; i++) {
        if (infos_colis[i][0] == commande.type_colis) {
            hauteur = infos_colis[i][1];
            nb_par_rang = infos_colis[i][2];
            couleur = infos_colis[i][3];
            colis_existe = true;
            break;
        }
    }

    if (!colis_existe) {
        alert("Pas de hauteur pour le colis: "+type_colis);
        return 0;
    }

    commande.reste = commande.nb_colis % nb_par_rang;
    commande.hauteur_main = parseInt(commande.nb_colis / nb_par_rang) * hauteur;
    if (commande.reste != 0) {
        commande.hauteur = commande.hauteur_main + hauteur;
        commande.ratio_reste = commande.reste / nb_par_rang;
        commande.hauteur_reste = hauteur;
    }
    else {
        commande.hauteur = commande.hauteur_main;
    }

    commande.hauteur_redimensionne = commande.hauteur * ratio_hauteur - 2;
    commande.hauteur_main_redim = commande.hauteur_main * ratio_hauteur;
    commande.couleur = couleur;

}


// Création du div représentant la commande.
function creation_dessin_commande(commande) {
    let palette = document.getElementById("affichage_palette");

    let dessin_commande = document.createElement("div");
    dessin_commande.setAttribute("class", "dessin_commande");
    dessin_commande.setAttribute("id", "commande_"+commande.id);
    dessin_commande.onclick = function() {
        if (!optimisation_en_cours) {
            return;
        }

        if (!commande.aOptimiser) {
            if (commande.reste == 0) {
                this.getElementsByClassName("dessin_colis")[0].style.backgroundColor = "purple";
            }
            else {
                this.getElementsByClassName("dessin_colis")[0].getElementsByClassName("partie_dessin")[0].style.backgroundColor = "purple";
                this.getElementsByClassName("dessin_colis")[0].getElementsByClassName("partie_dessin")[1].style.backgroundColor = "purple";
            }
            commandes_aOptimiser.push(commande);
        }
        else {
            if (commande.reste == 0) {
                this.getElementsByClassName("dessin_colis")[0].style.backgroundColor = commande.couleur;
            }
            else {
                this.getElementsByClassName("dessin_colis")[0].getElementsByClassName("partie_dessin")[0].style.backgroundColor = commande.couleur;
                this.getElementsByClassName("dessin_colis")[0].getElementsByClassName("partie_dessin")[1].style.backgroundColor = commande.couleur;
            }
            for (let i=0; i<commandes_aOptimiser.length; i++) {
                if (commandes_aOptimiser[i] == commande) {
                    commandes_aOptimiser.splice(i, 1);
                    break;
                }
            }
        }
        commande.aOptimiser = !commande.aOptimiser;
    }
    dessin_commande.style.height = commande.hauteur_redimensionne+"px";
    dessin_commande.style.display = "none";


    let dessin_colis = document.createElement("div");
    dessin_colis.setAttribute("class", "dessin_colis");
    if (commande.reste != 0) {
        let main_part = document.createElement("div");
        main_part.setAttribute("class", "partie_dessin");
        main_part.style.height = commande.hauteur_main_redim+"px";
        main_part.innerHTML = commande.nb_colis;
        main_part.style.backgroundColor = commande.couleur;
    
        let reste = document.createElement("div");
        reste.setAttribute("class", "partie_dessin");
        reste.style.height = (commande.hauteur_redimensionne - commande.hauteur_main_redim)+"px";
        reste.style.width = (Math.min(window.innerHeight, window.innerWidth) * 0.7 * commande.ratio_reste)+"px";
        reste.style.backgroundColor = commande.couleur;

        dessin_colis.appendChild(reste);
        dessin_colis.appendChild(main_part);
    }
    else {
        dessin_colis.innerHTML = commande.nb_colis;
        dessin_colis.style.backgroundColor = commande.couleur;
    }

    dessin_colis.style.height = commande.hauteur_redimensionne+"px";
    


    let label_hauteur_commande = document.createElement("div");
    label_hauteur_commande.setAttribute("class", "label_hauteur_commande");
    label_hauteur_commande.innerHTML = commande.hauteur;

    dessin_commande.appendChild(dessin_colis);
    dessin_commande.appendChild(label_hauteur_commande);

    palette.appendChild(dessin_commande);
}


// Affiche ou efface la commande (dans la section "affichage_palette") lors d'un clic sur une commande (dans la section "choix_commande").
function ajout_suppression_commande(bouton, commande) {
    if (commande.estAffiche) {
        hauteur_actuelle -= commande.hauteur;
        // Suppression de la commande de la palette.
        for (let i=commandes_places.length-1; i>=0; i--) {
            if (commandes_places[i].id == commande.id) {
                pos_derniere_commande += commande.hauteur_redimensionne + 2;
                document.getElementById("commande_"+commande.id).style.display = "none";
                commandes_places.splice(i, 1);
                break;
            }
            else {
                commandes_places[i].position_y += commande.hauteur_redimensionne + 2
                document.getElementById("commande_"+commandes_places[i].id).style.top = commandes_places[i].position_y +"px";
            }
        }
    }
    else {
        // Ajout de la commande à la palette.
        let palette = document.getElementById("affichage_palette");
        let dessin_colis = document.getElementById("commande_"+commande.id);
        dessin_colis.style.display = "block";
        commande.position_y = pos_derniere_commande - commande.hauteur_redimensionne - 2;
        dessin_colis.style.top = commande.position_y +"px";
        pos_derniere_commande = commande.position_y;
        commandes_places.push(commande);
        hauteur_actuelle += commande.hauteur;
    }
    commande.estAffiche = !commande.estAffiche;
    if (commande.estAffiche) {
        bouton.style.backgroundColor = "green";
        bouton.style.borderColor = "green";
        bouton.style.color = "white";
    }
    else {
        bouton.style.backgroundColor = "white";
        bouton.style.borderColor = "white";
        bouton.style.color = "black";
    }

    if (pos_derniere_commande < document.getElementById("barre_maximum").offsetTop) {
        if (document.body.classList.contains('affichage_palette_ok')) {
            document.body.classList.remove("affichage_palette_ok");
        }
        else if (document.body.classList.contains('affichage_palette_danger')) {
            document.body.classList.remove("affichage_palette_danger");
        }

        if (!document.body.classList.contains('affichage_palette_sup_max')) {
            document.body.classList.add("affichage_palette_sup_max");
        }
    }
    else if (pos_derniere_commande < document.getElementById("barre_danger").offsetTop) {
        if (document.body.classList.contains('affichage_palette_ok')) {
            document.body.classList.remove("affichage_palette_ok");
        }
        else if (document.body.classList.contains('affichage_palette_sup_max')) {
            document.body.classList.remove("affichage_palette_sup_max");
        }

        if (!document.body.classList.contains('affichage_palette_danger')) {
            document.body.classList.add("affichage_palette_danger");
        }
    }
    else {
        if (document.body.classList.contains('affichage_palette_danger')) {
            document.body.classList.remove("affichage_palette_danger");
        }
        else if (document.body.classList.contains('affichage_palette_sup_max')) {
            document.body.classList.remove("affichage_palette_sup_max");
        }

        if (!document.body.classList.contains('affichage_palette_ok')) {
            document.body.classList.add("affichage_palette_ok");
        }
    }

    document.getElementById("label_hauteur_actuelle").innerHTML = "Hauteur actuelle: "+hauteur_actuelle;
}


function optimiser() {
    if (commandes_places.length == 0) {
        return;
    }

    optimisation_en_cours = true;
    document.getElementById("affichage_palette").style.backgroundColor = "grey";

    document.getElementById("bouton_optimiser").style.display = "none";
    document.getElementById("ligne_optimiser").style.display = "block";
}

function valider_optimisation() {
    // let liste_commandes = []
    // for (let i=0; i<commandes_places.length; i++) {
    //     liste_commandes.push(JSON.stringify(commandes_places[i]));
    // }

    localStorage.setItem('CH_commandes_places', JSON.stringify(commandes_places)); 
    // localStorage.setItem('CH_commandes_places', liste_commandes.toString());
    location.href = "./optimisation_reste.html";
}

function annuler_optimisation() {
    document.getElementById("affichage_palette").style.backgroundColor = "rgb(70, 50, 43)";

    document.getElementById("bouton_optimiser").style.display = "block";
    document.getElementById("ligne_optimiser").style.display = "none";

    for (let i=0; i<liste_commandes.length; i++) {
        if (liste_commandes[i].aOptimiser) {
            document.getElementById("commande_"+liste_commandes[i].id).click();
        }
    }
    optimisation_en_cours = false;
}