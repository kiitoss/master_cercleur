var liste_commandes = [];
var ratio_hauteur = 1;
var pos_derniere_commande;
var commandes_places = [];
var hauteur_actuelle = 0;
var optimisation_en_cours = false;
var dessin_reste = null;
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
    let colis_existe = false;
    for (let i=0; i<liste_colis.length; i++) {
        if (liste_colis[i].nom == type_colis) {
            this.infos_colis = liste_colis[i];
            colis_existe = true;
            break;
        }
    }
    if (!colis_existe) {
        alert("Pas d'informations pour le colis: "+type_colis);
    }

    this.id = parseInt(id);
    this.nb_colis = parseInt(nb_colis);
    this.nb_palettes = parseInt(nb_palettes);

    this.estAffiche = false;
    this.position_y = 0;
    this.couleur = "none";

    this.hauteur_main_part = 0;
    this.hauteur_reste_part = 0;
    this.hauteur_palette_part = 0;
    this.hauteur_total = 0;

    this.hauteur_reste = 0;

    this.delta_nb_colis = 0;
    this.delta_nb_palettes = 0;
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
    commande.reste = (commande.nb_colis + commande.delta_nb_colis) % commande.infos_colis.nb_par_rang;

    if ((commande.nb_colis < commande.infos_colis.nb_par_rang * 2) && (commande.nb_palettes == 2)) {
        commande.nb_palettes = 1;
    }

    if (commande.nb_colis + commande.delta_nb_colis == 0) {
        commande.hauteur_palette_part = 0;
        commande.hauteur_main_part = 0;
        commande.hauteur_reste_part = 0;
    }
    else {
        commande.hauteur_main_part = parseInt((commande.nb_colis + commande.delta_nb_colis) / commande.infos_colis.nb_par_rang) * commande.infos_colis.hauteur;
        commande.hauteur_reste_part = 0;
        if (commande.reste != 0) {
            commande.hauteur_reste_part = commande.infos_colis.hauteur;
        }

        if (commande.nb_palettes + commande.delta_nb_palettes >= 1) {
            commande.hauteur_palette_part = palette_infos.hauteur;
        }
        else {
            commande.hauteur_palette_part = 0;
        }
    }

    let qte_palettes = commande.nb_palettes + commande.delta_nb_palettes;
    if (qte_palettes == 2) {
        commande.hauteur_main_part += palette_infos.hauteur;
    }
    commande.hauteur_total = commande.hauteur_palette_part + commande.hauteur_main_part + commande.hauteur_reste_part;

    commande.couleur = commande.infos_colis.couleur;

}

// Création du div représentant la commande.
function creation_dessin_commande(commande) {
    let canvas_palette = document.getElementById("affichage_palette");

    let dessin_commande = document.createElement("div");
    dessin_commande.setAttribute("class", "dessin_commande");
    dessin_commande.setAttribute("id", "commande_"+commande.id);
    dessin_commande.style.height = commande.hauteur_total * ratio_hauteur + "px";
    dessin_commande.style.display = "none";

    let dessin_palette = document.createElement("div");
    dessin_palette.setAttribute("class", "palette");
    dessin_palette.style.backgroundColor = palette_infos.couleur;
    dessin_palette.style.height = commande.hauteur_palette_part * ratio_hauteur + "px";
    dessin_commande.appendChild(dessin_palette);



    let dessin_colis = document.createElement("div");
    dessin_colis.setAttribute("class", "dessin_colis");
    let label = commande.nb_colis;
    if (commande.delta_nb_colis != 0) {
        label += " (";
        if (commande.delta_nb_colis > 0) {
            label += "+";
        }
        label += commande.delta_nb_colis+")";
    }
    if (commande.reste != 0) {
        let main_part = document.createElement("div");
        main_part.setAttribute("class", "partie_dessin");
        main_part.style.height = commande.hauteur_main_part * ratio_hauteur + "px";
        main_part.style.backgroundColor = commande.couleur;
    
        let reste_part = document.createElement("div");
        reste_part.setAttribute("class", "partie_dessin");
        reste_part.style.height = commande.hauteur_reste_part * ratio_hauteur + "px";
        reste_part.style.width = (Math.min(window.innerHeight, window.innerWidth) * 0.7 * (commande.reste / commande.infos_colis.nb_par_rang)) + "px";
        reste_part.style.backgroundColor = commande.couleur;

        if (commande.hauteur_main_part > 0) {
            main_part.innerHTML = label;
        }
        else {
            reste_part.innerHTML = label;
        }
        dessin_colis.appendChild(reste_part);
        dessin_colis.appendChild(main_part);
    }
    else {
        dessin_colis.innerHTML = label;
        dessin_colis.style.height = (commande.hauteur_main_part + commande.hauteur_reste_part) * ratio_hauteur + "px";
        dessin_colis.style.backgroundColor = commande.couleur;
    }

    if ((commande.nb_palettes + commande.delta_nb_palettes == 2) && (commande.nb_colis + commande.delta_nb_colis > commande.infos_colis.nb_par_rang * 2)) {
        let new_palette = document.createElement("div");
        new_palette.setAttribute("class", "palette");
        new_palette.style.backgroundColor = palette_infos.couleur;
        new_palette.style.height = commande.hauteur_palette_part * ratio_hauteur + "px";
        new_palette.style.top = commande.hauteur_total / 2 * ratio_hauteur + "px";
        dessin_colis.appendChild(new_palette);
    }    


    let label_hauteur_commande = document.createElement("div");
    label_hauteur_commande.setAttribute("class", "label_hauteur_commande");
    label_hauteur_commande.innerHTML = commande.hauteur_total.toFixed(2);

    dessin_commande.appendChild(dessin_colis);
    dessin_commande.appendChild(label_hauteur_commande);

    canvas_palette.appendChild(dessin_commande);
}

// Affiche ou efface la commande (dans la section "affichage_palette") lors d'un clic sur une commande (dans la section "choix_commande").
function ajout_suppression_commande(commande, auto=false) {
    if (optimisation_en_cours && !auto) {
        clique_optimisation(true);
        document.getElementById("checkbox_optimiser").checked = false;
    }
    let bouton = document.getElementById("ajout_suppr_commande_"+commande.id);
    if (commande.estAffiche) {
        // Suppression de la commande de la palette.
        for (let i=commandes_places.length-1; i>=0; i--) {
            if (commandes_places[i].id == commande.id) {
                pos_derniere_commande += commande.hauteur_total * ratio_hauteur;
                document.getElementById("commande_"+commande.id).style.display = "none";
                commandes_places.splice(i, 1);
                break;
            }
            else {
                commandes_places[i].position_y += commande.hauteur_total * ratio_hauteur;
                document.getElementById("commande_"+commandes_places[i].id).style.top = commandes_places[i].position_y +"px";
            }
        }
    }
    else {
        // Ajout de la commande à la palette.
        let dessin_colis = document.getElementById("commande_"+commande.id);
        if (commande.nb_colis + commande.delta_nb_colis != 0) {
            dessin_colis.style.display = "block";
        }
        commande.position_y = pos_derniere_commande - commande.hauteur_total * ratio_hauteur;
        dessin_colis.style.top = commande.position_y +"px";
        pos_derniere_commande = commande.position_y;

        commandes_places.push(commande);
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

    let hauteur_atteinte = 0;
    for (let i=0; i<commandes_places.length; i++) {
        hauteur_atteinte += commandes_places[i].hauteur_total;
    }
    change_couleur_fond(hauteur_atteinte);
}

function change_couleur_fond(hauteur_atteinte) {
    document.getElementById("label_hauteur_actuelle").innerHTML = "Hauteur actuelle: "+hauteur_atteinte.toFixed(2);

    if (hauteur_atteinte > hauteur_max) {
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
    else if (hauteur_atteinte > hauteur_dangereuse) {
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
}

function clique_optimisation(mouse_clique=true) {
    document.getElementById("voir_plus_opti").innerHTML = "";
    document.getElementById("commande_reste").style.display = "none";
    document.getElementById("voir_plus_opti").innerHTML = "";
    

    if (mouse_clique) {
        if (commandes_places.length < 2 && !optimisation_en_cours) {
            document.getElementById("checkbox_optimiser").checked = false;
            return;
        }
        optimisation_en_cours = !optimisation_en_cours;
    }

    let old_commande = [];
    for (let i=0; i<commandes_places.length; i++) {
        old_commande.push(commandes_places[i]);
        old_commande[old_commande.length - 1].delta_nb_colis = 0;
        old_commande[old_commande.length - 1].delta_nb_palettes = 0;
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
        document.getElementById("voir_detail").style.display = "none";
    }



    let hauteur_atteinte = 0;
    for (let i=0; i<old_commande.length; i++) {
        hauteur_atteinte += old_commande[i].hauteur_total;
    }
    if (optimisation_en_cours && (hauteur_atteinte > hauteur_dangereuse)) {
    // if (optimisation_en_cours) {
        AP_liste_colis = [];
        for (let i=0; i<old_commande.length; i++) {
            if (old_commande[i].reste != 0) {
                let ajoute = false;
                for (let j=0; j<AP_liste_colis.length; j++) {
                    if (AP_liste_colis[j][1] == old_commande[i].infos_colis.nom) {
                        AP_liste_colis[j][0] += old_commande[i].reste;
                        ajoute = true;
                        break;
                    }
                }
                if (!ajoute) {
                    AP_liste_colis.push([old_commande[i].reste, old_commande[i].infos_colis.nom]);
                }

                old_commande[i].delta_nb_colis -= old_commande[i].reste;
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
            if (AP_result.length != []) {
                creation_top(AP_result);
                creation_detail(AP_liste_colis);
            }
            else {
                alert("Aucune solution trouvée.");
                document.getElementById("checkbox_optimiser").checked = false;
                clique_optimisation(true);
            }
        }
    }
    else {
        for (let i=old_commande.length-1; i>-1; i--) {
            affecte_hauteurs_couleur(old_commande[i]);
            creation_dessin_commande(old_commande[i]);
        }
        for (let i=0; i<old_commande.length; i++) {
            ajout_suppression_commande(old_commande[i], true);
        }
    }
}

function voir_detail() {
    document.getElementById("section_detail").style.display = "block";
    document.getElementById("bouton_retour_arriere").onclick = function() {
        document.getElementById("section_detail").style.display = "none";
        document.getElementById("bouton_retour_arriere").onclick = function() {
            history.go(-1);
        }
    }
}

function creation_top(palette) {
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


    let aire_palette = 0;
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
                let hauteur_colis = 0;
                for (let k=0; k<liste_colis.length; k++) {
                    if (liste_colis[k].nom == colis[1]) {
                        if (liste_colis[k].hauteur*colis[2] > hauteur_max_reste) {
                            colis_reste = liste_colis[k];
                            hauteur_max_reste = liste_colis[k].hauteur*colis[2];
                        }
                        couleur = liste_colis[k].couleur;
                        hauteur_colis = liste_colis[k].hauteur;
                        break;
                    }
                }
                colis_palette.push([colis[0], colis[1], colis[2], j, i, delta_x, delta_y, couleur, hauteur_colis]);
                aire_palette +=  delta_x * delta_y * colis[2];
            }
        }
    }

    hauteur_max_reste += palette_infos.hauteur;

    

    dessin_reste = document.getElementById("commande_reste");
    dessin_reste.style.display = "block";
    dessin_reste.style.height = (hauteur_max_reste*ratio_hauteur)+"px";
    dessin_reste.style.display = "flex";
    dessin_reste.style.flexDirection = "row";


    dessin_colis_reste = document.getElementById("dessin_colis_reste");
    dessin_colis_reste.innerHTML = "";
    dessin_colis_reste.style.height = (hauteur_max_reste*ratio_hauteur)+"px";


    let avance_left = 0;

    aire_palette = palette.length * palette[0].length;
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
    




        let new_colis_reste = document.createElement("div");
        new_colis_reste.setAttribute("class", "new_colis_reste");
        new_colis_reste.style.width = (colis_palette[i][5]*colis_palette[i][6] / aire_palette) * (Math.min(window.innerHeight, window.innerWidth) * 0.7)+"px";
        new_colis_reste.style.height = (parseFloat(colis_palette[i][8] * colis_palette[i][2]) * ratio_hauteur)+"px";
        if (colis_palette[i][2] > 1) {
            let pos_top = (hauteur_max_reste - (parseFloat(colis_palette[i][8] * colis_palette[i][2])) * ratio_hauteur);
            new_colis_reste.style.display = "flex";
            new_colis_reste.style.border = "none";
            new_colis_reste.style.flexDirection = "column";
            for (let nb=0; nb<colis_palette[i][2]; nb++) {
                let sous_colis = document.createElement("div");
                sous_colis.setAttribute("class", "sous_colis");
                sous_colis.style.width = (colis_palette[i][5]*colis_palette[i][6] / aire_palette) * (Math.min(window.innerHeight, window.innerWidth) * 0.7)+"px";
                sous_colis.style.flex = "1";
                sous_colis.top = pos_top + "px";
                pos_top -= parseFloat(colis_palette[i][8] * colis_palette[i][2]) * ratio_hauteur;
                new_colis_reste.appendChild(sous_colis);
            }
        }
        else {
            new_colis_reste.style.top = (hauteur_max_reste - (parseFloat(colis_palette[i][8] * colis_palette[i][2])) * ratio_hauteur)+"px";
        }
        new_colis_reste.style.left = avance_left + "px";
        new_colis_reste.style.backgroundColor = colis_palette[i][7];
        avance_left += (colis_palette[i][5]*colis_palette[i][6] / aire_palette) * (Math.min(window.innerHeight, window.innerWidth) * 0.7);
        dessin_colis_reste.appendChild(new_colis_reste);
    }


    let palette_pour_reste = document.createElement("div");
    palette_pour_reste.setAttribute("class", "palette");
    palette_pour_reste.style.backgroundColor = palette_infos.couleur;
    palette_pour_reste.style.height = palette_infos.hauteur * ratio_hauteur + "px";
    dessin_colis_reste.appendChild(palette_pour_reste);


    document.getElementById("label_hauteur_commande_reste").innerHTML = hauteur_max_reste;

    dessin_reste.style.top = (pos_derniere_commande-hauteur_max_reste*ratio_hauteur)+"px";
    
    let hauteur_atteinte = 0;
    for (let i=0; i<commandes_places.length; i++) {
        hauteur_atteinte += commandes_places[i].hauteur_total;
    }
    hauteur_atteinte += hauteur_max_reste;
    document.getElementById("label_hauteur_actuelle").innerHTML = "Hauteur actuelle: "+hauteur_atteinte.toFixed(2);
    document.getElementById("label_hauteur_actuelle_voir_plus").innerHTML = "Hauteur reste: "+hauteur_max_reste.toFixed(2)+" - Hauteur totale: "+hauteur_atteinte.toFixed(2);
    if (hauteur_atteinte < hauteur_dangereuse) {
        document.getElementById("label_hauteur_actuelle_voir_plus").style.backgroundColor = "green";
    }
    else if (hauteur_atteinte < hauteur_max) {
        document.getElementById("label_hauteur_actuelle_voir_plus").style.backgroundColor = "orange";
    }
    else {
        document.getElementById("label_hauteur_actuelle_voir_plus").style.backgroundColor = "red";
    }
    change_couleur_fond(hauteur_atteinte);
}

function fusion_colis_identiques(old_commande) {
    for (let i=0; i<old_commande.length; i++) {
        if (parseInt(old_commande[i].reste) == 0) {
            continue;
        }
        let type_carton = old_commande[i].infos_colis.nom;
        for (let j=i+1; j<old_commande.length; j++) {
            if (parseInt(old_commande[j].reste) == 0) {
                continue;
            }
            if (old_commande[j].infos_colis.nom == type_carton) {
                if (old_commande[i].reste + old_commande[j].reste >= old_commande[i].infos_colis.nb_par_rang) {
                    old_commande[i].delta_nb_colis += (old_commande[i].infos_colis.nb_par_rang - old_commande[i].reste);
                    old_commande[j].delta_nb_colis -= (old_commande[i].infos_colis.nb_par_rang - old_commande[i].reste);
                }
                else {
                    old_commande[i].delta_nb_colis += old_commande[j].reste;
                    old_commande[j].delta_nb_colis -= old_commande[j].reste;
                }
            }
            old_commande[i].reste = (old_commande[i].delta_nb_colis + old_commande[i].nb_colis) % old_commande[i].infos_colis.nb_par_rang;
            old_commande[j].reste = (old_commande[j].delta_nb_colis + old_commande[j].nb_colis) % old_commande[j].infos_colis.nb_par_rang;
            
            if (old_commande[j].nb_colis + old_commande[j].delta_nb_colis == 0) {
                old_commande[j].delta_nb_palettes = -old_commande[j].nb_palettes;
            }
            if (old_commande[i].reste == 0) {
                break;
            }
        }
        if (old_commande[i].nb_colis + old_commande[i].delta_nb_colis == 0) {
            old_commande[i].delta_nb_palettes = -old_commande[i].nb_palettes;
        }
    }
}

function creation_detail(restes) {
    let palette_hauteur = 14.5;
    let liste_restes = [];
    let hauteur_totale = 0;
    for (let i=0; i<liste_colis.length; i++) {
        liste_restes.push([liste_colis[i].nom, liste_colis[i].hauteur, 0]);
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