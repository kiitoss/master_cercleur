var liste_commandes = [];
var ratio_hauteur = 1;
var couleurs = ["red", "blue", "green", "yellow"];
var pos_derniere_commande;
var commandes_places = [];
var hauteur_actuelle = 0;
var optimisation_en_cours = false;
var commandes_aOptimiser = [];
var dessin_reste = null;
var hauteur_max = 265;
var hauteur_dangereuse = 250;
var hauteur_palette = 14.5;

var infos_colis = [
    ["carton bois", 10.5, 8, "brown"],
    ["carton beige", 10, 8, "yellow"],
    ["IFCO", 250, 2, "green"]
];

var AP_liste_colis = [];
var AP_result = [];

document.getElementById("checkbox_optimiser").checked = false;


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

    this.hauteur_reste = 0;

    this.modif_qte = 0;

    this.reste = 0;

    creer_bouton_commande(this);
}


// Créer le bouton correspondant à la commande (pendant la création de l'objet Commande).
function creer_bouton_commande(commande) {
    let choix_commandes = document.getElementById("choix_commandes");
    let nouvelle_commande = document.createElement("button");
    nouvelle_commande.setAttribute("class", "commande_cliquable");
    nouvelle_commande.setAttribute("id", "ajout_suppr_commande_"+commande.id);
    nouvelle_commande.onclick = function() {
        ajout_suppression_commande(commande)
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
        alert("Pas de hauteur pour le colis: "+commande.type_colis);
        return 0;
    }

    commande.nb_colis = parseInt(commande.nb_colis);
    commande.modif_qte = parseInt(commande.modif_qte);
    commande.nb_par_rang = parseInt(nb_par_rang);
    nb_par_rang = parseInt(nb_par_rang);
    commande.reste = (commande.nb_colis + commande.modif_qte) % nb_par_rang;
    commande.hauteur_main = parseInt((commande.nb_colis + commande.modif_qte) / nb_par_rang) * hauteur;
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
    let hauteur_totale_commande = commande.hauteur + commande.nb_palettes * hauteur_palette;
    let palette = document.getElementById("affichage_palette");

    let dessin_commande = document.createElement("div");
    dessin_commande.setAttribute("class", "dessin_commande");
    dessin_commande.setAttribute("id", "commande_"+commande.id);
    dessin_commande.style.height = hauteur_totale_commande * ratio_hauteur+"px";
    dessin_commande.style.display = "none";

    let dessin_palette = document.createElement("div");
    dessin_palette.setAttribute("class", "palette");
    dessin_palette.style.height = commande.nb_palettes * hauteur_palette * ratio_hauteur + 2 + "px";
    dessin_commande.appendChild(dessin_palette);



    let dessin_colis = document.createElement("div");
    dessin_colis.setAttribute("class", "dessin_colis");
    let text = commande.nb_colis;
    if (commande.modif_qte != 0) {
        text += " (";
        if (commande.modif_qte > 0) {
            text += "+";
        }
        text += commande.modif_qte+")";
    }
    if (commande.reste != 0) {
        let main_part = document.createElement("div");
        main_part.setAttribute("class", "partie_dessin");
        main_part.style.height = commande.hauteur_main_redim + (commande.nb_palettes * hauteur_palette * ratio_hauteur) + "px";
        main_part.style.backgroundColor = commande.couleur;
    
        let reste = document.createElement("div");
        reste.setAttribute("class", "partie_dessin");
        reste.style.height = (commande.hauteur_redimensionne - commande.hauteur_main_redim)+"px";
        reste.style.width = (Math.min(window.innerHeight, window.innerWidth) * 0.7 * commande.ratio_reste)+"px";
        reste.style.backgroundColor = commande.couleur;

        if (commande.hauteur_main_redim > 0) {
            main_part.innerHTML = text;
        }
        else {
            reste.innerHTML = text;
        }
        dessin_colis.appendChild(reste);
        dessin_colis.appendChild(main_part);
    }
    else {
        dessin_colis.innerHTML = text;
        dessin_colis.style.backgroundColor = commande.couleur;
    }

    dessin_colis.style.height = hauteur_totale_commande+"px";
    


    let label_hauteur_commande = document.createElement("div");
    label_hauteur_commande.setAttribute("class", "label_hauteur_commande");
    label_hauteur_commande.innerHTML = hauteur_totale_commande;

    dessin_commande.appendChild(dessin_colis);
    dessin_commande.appendChild(label_hauteur_commande);

    palette.appendChild(dessin_commande);
}


// Affiche ou efface la commande (dans la section "affichage_palette") lors d'un clic sur une commande (dans la section "choix_commande").
function ajout_suppression_commande(commande, auto=false) {
    let opti_running = false;
    if (optimisation_en_cours && !auto) {
        opti_running = true;
        clique_optimisation(true);
    }
    let bouton = document.getElementById("ajout_suppr_commande_"+commande.id);
    let hauteur_palettes_redim = commande.nb_palettes * hauteur_palette * ratio_hauteur;
    if (commande.estAffiche) {
        hauteur_actuelle -= (commande.hauteur + commande.nb_palettes * hauteur_palette);
        // Suppression de la commande de la palette.
        for (let i=commandes_places.length-1; i>=0; i--) {
            if (commandes_places[i].id == commande.id) {
                pos_derniere_commande += commande.hauteur_redimensionne + hauteur_palettes_redim + 2;
                document.getElementById("commande_"+commande.id).style.display = "none";
                commandes_places.splice(i, 1);
                break;
            }
            else {
                commandes_places[i].position_y += commande.hauteur_redimensionne + hauteur_palettes_redim + 2
                document.getElementById("commande_"+commandes_places[i].id).style.top = commandes_places[i].position_y +"px";
            }
        }
    }
    else {
        // Ajout de la commande à la palette.
        let palette = document.getElementById("affichage_palette");
        let dessin_colis = document.getElementById("commande_"+commande.id);
        if (commande.hauteur > 0) {
            dessin_colis.style.display = "block";
        }
        commande.position_y = pos_derniere_commande - commande.hauteur_redimensionne - hauteur_palettes_redim - 2;
        dessin_colis.style.top = commande.position_y +"px";
        pos_derniere_commande = commande.position_y;
        commandes_places.push(commande);
        
        hauteur_actuelle += (commande.hauteur + commande.nb_palettes * hauteur_palette);
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

    if (!auto) {
        clique_optimisation(false);
    }
    if (opti_running) {
        clique_optimisation(true);
    }
}





function clique_optimisation(mouse_clique=true) {
    document.getElementById("voir_plus_opti").innerHTML = "";
    document.getElementById("commande_reste").style.display = "none";
    document.getElementById("voir_plus_opti").innerHTML = "";
    

    if (mouse_clique) {
        optimisation_en_cours = !optimisation_en_cours;
    }

    let old_commande = [];
    for (let i=0; i<commandes_places.length; i++) {
        old_commande.push(commandes_places[i]);
    }

    for (let i=0; i<old_commande.length; i++) {
        old_commande[i].modif_qte = 0;
    }

    for (let i=0; i<old_commande.length; i++) {
        ajout_suppression_commande(old_commande[i], true);
        document.getElementById("affichage_palette").removeChild(document.getElementById("commande_"+old_commande[i].id));
    }


    if (optimisation_en_cours) {
        parent = document.getElementById("liste_colis_retants");
        while (parent.firstChild) {
            parent.removeChild(parent.lastChild);
        }
        fusion_colis_identiques(old_commande);
    }
    else {
        document.getElementById("bouton_retour_arriere").onclick = function() {
            history.go(-1);
        }
        reinitialise_commandes(old_commande);
        document.getElementById("voir_detail").style.display = "none";
    }


    for (let i=old_commande.length-1; i>-1; i--) {
        affecte_hauteurs_couleur(old_commande[i]);
        creation_dessin_commande(old_commande[i]);
    }
    for (let i=0; i<old_commande.length; i++) {
        ajout_suppression_commande(old_commande[i], true);
    }


    // if (optimisation_en_cours && (hauteur_actuelle > hauteur_dangereuse)) {
    if (optimisation_en_cours) {
        old_commande = [];
        AP_liste_colis = [];
        for (let i=0; i<commandes_places.length; i++) {
            old_commande.push(commandes_places[i]);
        }
        for (let i=0; i<old_commande.length; i++) {
            ajout_suppression_commande(old_commande[i], true);
            document.getElementById("affichage_palette").removeChild(document.getElementById("commande_"+old_commande[i].id));
            if (old_commande[i].reste != 0) {
                let ajoute = false;
                for (let j=0; j<AP_liste_colis.length; j++) {
                    if (AP_liste_colis[j][1] == old_commande[i].type_colis) {
                        AP_liste_colis[j][0] += old_commande[i].reste;
                        ajoute = true;
                        break;
                    }
                }
                if (!ajoute) {
                    AP_liste_colis.push([old_commande[i].reste, old_commande[i].type_colis]);
                }

                old_commande[i].modif_qte -= old_commande[i].reste;
            }
        }
        

        for (let i=old_commande.length-1; i>-1; i--) {
            affecte_hauteurs_couleur(old_commande[i]);
            creation_dessin_commande(old_commande[i]);
        }
        for (let i=0; i<old_commande.length; i++) {
            ajout_suppression_commande(old_commande[i], true);
        }

        if (AP_liste_colis.length != 0) {
            AP_first_main();
            creation_top(AP_result);
            creation_detail(AP_liste_colis);
        }
    }
}

function voir_detail() {
    document.getElementById("section_detail").style.display = "block";
}


function creation_top(palette) {
    document.getElementById("bouton_retour_arriere").onclick = function() {
        document.getElementById("section_detail").style.display = "none";
    }
    let hauteur_max_reste = 0;
    let colis_reste = null;

    let canvas_dessin = document.getElementById("voir_plus_opti");
    document.getElementById("section_detail").style.display = "block";
    let canvas_height = canvas_dessin.offsetHeight;
    let canvas_width = canvas_dessin.offsetWidth;
    document.getElementById("section_detail").style.display = "none";

    let palette_height = palette.length;
    let palette_width = palette[0].length;

    if ((palette_height > palette_width) && (canvas_height < canvas_width)) {
        let new_palette = [];
        for (let j=0; j<palette[0].length; j++) {
            new_palette.push([]);
            for (let i=0; i<palette.length; i++) {
                new_palette[j].push(0);
            }
        }
    
        for (let j=0; j<new_palette.length; j++) {
            for (let i=0; i<new_palette[j].length; i++) {
                new_palette[j][i] = palette[palette.length-1-i][j];
            }
        }

        palette = new_palette;
        let change = palette_width;
        palette_width = palette_height;
        palette_height = change;
    }


    let ratio_x = canvas_width*0.9 / palette_width;
    let ratio_y = canvas_height*0.9 / palette_height;

    let ratio = ratio_x;

    if (ratio_x >= ratio_y) {
        ratio = ratio_y;
    }


    let dessin_palette = document.createElement("div");
    dessin_palette.setAttribute("id", "dessin_palette_top");
    dessin_palette.style.width = palette_width*ratio + "px";
    dessin_palette.style.height = palette_height*ratio + "px";
    dessin_palette.style.top = (canvas_height - palette_height*ratio) / 2 + "px";
    dessin_palette.style.left = (canvas_width - palette_width*ratio) / 2 + "pxF";

    canvas_dessin.appendChild(dessin_palette);



    let colis_palette = [];
    for (let j=0; j<palette.length; j++) {
        for (let i=0; i<palette[j].length; i++) {
            if (palette[j][i] == 0) {
                continue;
            }
            let deja_present = false;
            let colis = palette[j][i];
            for (let k=0; k<colis_palette.length; k++) {
                if (colis_palette[k][0] == colis[0]) {
                    deja_present = true;
                    break;
                }
            }
            if (!deja_present) {
                let delta_x = 0;
                while ((delta_x+i < palette[j].length) && palette[j][delta_x+i][0] == colis[0]) {
                    delta_x++;
                }
                let delta_y = 0;
                while ((delta_y+j < palette.length) && palette[j+delta_y][i][0] == colis[0]) {
                    delta_y++;
                }
                let couleur = "none";
                for (let k=0; k<infos_colis.length; k++) {
                    if (infos_colis[k][0] == colis[1]) {
                        if (infos_colis[k][1]*colis[2] > hauteur_max_reste) {
                            colis_reste = infos_colis[k];
                            hauteur_max_reste = infos_colis[k][1]*colis[2];
                        }
                        couleur = infos_colis[k][3];
                        break;
                    }
                }
                colis_palette.push([colis[0], colis[1], colis[2], j, i, delta_x, delta_y, couleur]);
            }
        }
    }

    hauteur_max_reste += hauteur_palette;

    for (let i=0; i<colis_palette.length; i++) {
        let new_colis = document.createElement("div");
        new_colis.setAttribute("class", "colis_top");
        new_colis.style.width = (colis_palette[i][5]*ratio) + "px";
        new_colis.style.height = (colis_palette[i][6]*ratio) + "px";
        new_colis.style.top = colis_palette[i][3]*ratio+"px";
        new_colis.style.left = colis_palette[i][4]*ratio+"px";
        new_colis.style.backgroundColor = colis_palette[i][7];
        new_colis.innerHTML = colis_palette[i][2];

        dessin_palette.appendChild(new_colis);
    }

    dessin_reste = document.getElementById("commande_reste");
    dessin_reste.style.display = "block";
    dessin_reste.style.height = (hauteur_max_reste*ratio_hauteur-2)+"px";


    dessin_colis_reste = document.getElementById("dessin_colis_reste");
    dessin_colis_reste.innerHTML = "reste";
    dessin_colis_reste.style.backgroundColor = "blue";
    dessin_colis_reste.style.height = (hauteur_max_reste*ratio_hauteur-2)+"px";


    document.getElementById("label_hauteur_commande_reste").innerHTML = hauteur_max_reste;

    dessin_reste.style.top = (pos_derniere_commande-hauteur_max_reste*ratio_hauteur)+"px";

    hauteur_actuelle += hauteur_max_reste;
    document.getElementById("label_hauteur_actuelle").innerHTML = "Hauteur actuelle: "+hauteur_actuelle;
    document.getElementById("label_hauteur_actuelle_voir_plus").innerHTML = "Hauteur reste: "+hauteur_max_reste+" - Hauteur totale: "+hauteur_actuelle;
    if (hauteur_actuelle < hauteur_dangereuse) {
        document.getElementById("label_hauteur_actuelle_voir_plus").style.backgroundColor = "green";
    }
    else if (hauteur_actuelle < hauteur_max) {
        document.getElementById("label_hauteur_actuelle_voir_plus").style.backgroundColor = "orange";
    }
    else {
        document.getElementById("label_hauteur_actuelle_voir_plus").style.backgroundColor = "red";
    }
}





function fusion_colis_identiques(old_commande) {
    for (let i=0; i<old_commande.length; i++) {
        if (parseInt(old_commande[i].reste) == 0) {
            continue;
        }
        let type_carton = old_commande[i].type_colis;
        for (let j=i+1; j<old_commande.length; j++) {
            if (parseInt(old_commande[j].reste) == 0) {
                continue;
            }
            if (old_commande[j].type_colis == type_carton) {
                if (old_commande[i].reste + old_commande[j].reste >= old_commande[i].nb_par_rang) {
                    old_commande[i].modif_qte += (old_commande[i].nb_par_rang - old_commande[i].reste);
                    old_commande[j].modif_qte -= (old_commande[i].nb_par_rang - old_commande[i].reste);
                }
                else {
                    old_commande[i].modif_qte += old_commande[j].reste;
                    old_commande[j].modif_qte -= old_commande[j].reste;
                }
            }
            old_commande[i].reste = (old_commande[i].modif_qte + old_commande[i].nb_colis) % old_commande[i].nb_par_rang;
            old_commande[j].reste = (old_commande[j].modif_qte + old_commande[j].nb_colis) % old_commande[j].nb_par_rang;
            if (old_commande[i].reste == 0) {
                break;
            }
        }
    }
}

function reinitialise_commandes(old_commande) {
    for (let i=0; i<old_commande.length; i++) {
        old_commande[i].modif_qte = 0;
    }
}








function creation_detail(restes) {
    let palette_hauteur = 14.5;
    let liste_restes = [];
    let hauteur_totale = 0;
    for (let i=0; i<infos_colis.length; i++) {
        liste_restes.push([infos_colis[i][0], infos_colis[i][1], 0]);
    }

    // Récupération de la hauteur totale des palettes placées (sans les derniers rangs si l'on veut les optimiser).
    for (let i=0; i<restes.length; i++) {
        if (restes[i][0] != 0) {
            for (let j=0; j<liste_restes.length; j++) {
                if (liste_restes[j][0] == restes[i][1]) {
                    liste_restes[j][2] += restes[i][0];
                    break;
                }
            }

        }
    }


    let liste_colis_retants = document.getElementById("liste_colis_retants");
    let palette = document.createElement("li");
    palette.setAttribute("class", "colis_restant");

    let palette_nb = document.createElement("div");
    palette_nb.setAttribute("class", "cellule");
    palette_nb.innerHTML = "1 x palette";

    let hauteur_ma_palette = document.createElement("div");
    hauteur_ma_palette.setAttribute("class", "cellule");
    hauteur_ma_palette.innerHTML = "hauteur: "+palette_hauteur;

    palette.appendChild(palette_nb);
    palette.appendChild(hauteur_ma_palette);

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

    document.getElementById("voir_detail").style.display = "block";
}