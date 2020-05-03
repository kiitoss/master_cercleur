var session_commandes = [];
var CH_listeCommandes_session = sessionStorage.getItem('CH_listeCommandes_session');
if ((CH_listeCommandes_session) && (CH_listeCommandes_session.split(',').length%3 == 0)) {
    CH_listeCommandes_session = CH_listeCommandes_session.split(',')
    for (let i=0; i<CH_listeCommandes_session.length; i+=3) {
        session_commandes.push([CH_listeCommandes_session[i], CH_listeCommandes_session[i+1], CH_listeCommandes_session[i+2]]);
    }
}

var choix_type_colis = [];
for (let i=0; i<liste_colis.length; i++) {
    choix_type_colis.push(liste_colis[i].nom);
}
var status_creation_commande = new Object();
status_creation_commande.id_commande = 0;
status_creation_commande.estOuvert = false;
status_creation_commande.nb_colis = null;
status_creation_commande.id_colis = null;
status_creation_commande.nb_palettes = null;

var param_modifie = false;

affichage_commandes_memoire();

function ajout_commande() {
    // Ajoute une nouvelle ligne pour une nouvelle commande.
    let main_part = document.getElementById("main");
    let inserer_valider = document.getElementById("inserer_valider");

    let nouvelle_ligne = document.createElement("div");
    nouvelle_ligne.setAttribute("class", "ligne_commande");
    nouvelle_ligne.setAttribute("id", "lc_"+status_creation_commande.id_commande);


    let colis_infos = document.createElement("div");
    colis_infos.setAttribute("class", "colis_infos");

    let label_colis = document.createElement("label");
    label_colis.setAttribute("for", "input_colis");
    label_colis.innerHTML = "Colis: ";

    let input_colis = document.createElement("input");
    input_colis.setAttribute("type", "number");
    input_colis.setAttribute("name", "input_colis");
    input_colis.setAttribute("class", "input_colis");
    input_colis.setAttribute("value", status_creation_commande.nb_colis);
    input_colis.setAttribute("id", "nb_colis_commande_"+status_creation_commande.id_commande);
    input_colis.setAttribute("id_commande", status_creation_commande.id_commande);
    input_colis.setAttribute("size", "1");
    input_colis.onclick = function() {
        creation_commande_p1(this.getAttribute("id_commande"));
    }

    colis_infos.appendChild(label_colis);
    colis_infos.appendChild(input_colis);



    let cagette_infos = document.createElement("div");
    cagette_infos.setAttribute("class", "cagette_infos");

    let label_cagette = document.createElement("label");
    label_cagette.setAttribute("for", "input_cagette");
    label_cagette.innerHTML = "Type colis: ";

    let input_cagette = document.createElement("input");
    input_cagette.setAttribute("type", "text");
    input_cagette.setAttribute("name", "input_cagette");
    input_cagette.setAttribute("class", "input_cagette");
    input_cagette.setAttribute("value", choix_type_colis[status_creation_commande.id_colis]);
    input_cagette.setAttribute("id", "type_cagette_commande_"+status_creation_commande.id_commande);
    input_cagette.setAttribute("id_commande", status_creation_commande.id_commande);
    input_cagette.setAttribute("size", "10");
    input_cagette.onclick = function() {
        creation_commande_p2(this.getAttribute("id_commande"));
    }

    cagette_infos.appendChild(label_cagette);
    cagette_infos.appendChild(input_cagette);


    let palette_infos = document.createElement("div");
    palette_infos.setAttribute("class", "palette_infos");

    let btn_palette = document.createElement("button");
    btn_palette.setAttribute("class", "ac_nb_palettes");
    btn_palette.setAttribute("id", "nb_palettes_commande_"+status_creation_commande.id_commande);
    btn_palette.setAttribute("id_commande", status_creation_commande.id_commande);
    btn_palette.innerHTML = status_creation_commande.nb_palettes;
    btn_palette.onclick = function() {
        creation_commande_p3(this.getAttribute("id_commande"));
    }

    palette_infos.appendChild(btn_palette);


    nouvelle_ligne.appendChild(colis_infos);
    nouvelle_ligne.appendChild(cagette_infos);
    nouvelle_ligne.appendChild(palette_infos);

    main_part.insertBefore(nouvelle_ligne, inserer_valider);

    change_background_bouton("nb_palettes_commande_"+status_creation_commande.id_commande, status_creation_commande.nb_palettes);

    status_creation_commande.id_commande += 1;
}

// Valide ou annule l'ajout d'une nouvelle commande.
function terminer_ajout(ajout_valide) {
    if (ajout_valide) {
        ajout_commande();
        sauvegarder_commandes_memoire();
    }
    document.getElementById("main").style.display = "block";
    document.getElementById("main").style.animation = "none";
    document.getElementById("ac_main_ajout_commande").innerHTML = "";
    document.getElementById("ajouter_commande").style.display = "none";
    status_creation_commande.estOuvert = false;
    status_creation_commande.nb_colis = null;
    status_creation_commande.id_colis = null;
    status_creation_commande.nb_palettes = null;
}

function creation_nouvelle_commande() {
    creation_commande_p1();
}

// Création de l'interface pour choisir le nombre de colis de la commande.
function creation_commande_p1(commande_id=null) {
    masque_body();
    // Initialisation
    if (!status_creation_commande.estOuvert) {
        document.getElementById("ajouter_commande").style.display = "block";
        status_creation_commande.estOuvert = !status_creation_commande.estOuvert;
    }
    document.getElementById("ac_bouton_valider").style.display = "block";
    document.getElementById("ac_main_ajout_commande").innerHTML = "";
    document.getElementById("ac_titre_ajout_commande").innerHTML = "Nombre de colis";

    // Création de l'input pour entrer le nombre de colis.
    let main_part = document.getElementById("ac_main_ajout_commande");
    let input_colis = document.createElement("input");
    input_colis.setAttribute("type", "number");
    input_colis.setAttribute("name", "ac_input_colis");
    input_colis.setAttribute("id", "ac_input_colis");
    input_colis.setAttribute("min", "0");
    input_colis.setAttribute("max", 500);
    input_colis.setAttribute("maxlength", "3");
    input_colis.setAttribute("oninput", "check_valide_input_colis(this)");
    input_colis.setAttribute("size", "1");

    main_part.appendChild(input_colis);

    if (commande_id != null) {
        document.getElementById("ac_input_colis").value = document.getElementById("nb_colis_commande_"+commande_id).value;
    }
    else if (status_creation_commande.nb_colis != null) {
        document.getElementById("ac_input_colis").value = status_creation_commande.nb_colis;
    }
    document.getElementById("ac_input_colis").focus()

    // Affectation de la valeur onclick au bouton ac_bouton_valider.
    document.getElementById("ac_bouton_valider").onclick = function() {
        // Récupération et stockage du nombre de colis rentrés.
        let nb_colis = document.getElementById("ac_input_colis").value;
        if (nb_colis.length == 0) {
            nb_colis = 0;
        }

        // Si la commande est créé, le programme continue sur la prochaine étape,
        // sinon il met à jour les données de la ligne de la commande.
        if (commande_id == null) {
            status_creation_commande.nb_colis = parseInt(nb_colis);
            creation_commande_p2();
        }
        else {
            document.getElementById("nb_colis_commande_"+commande_id).value = parseInt(nb_colis);
            terminer_ajout(false);
        }
    }

    // Affectation de la valeur onclick du bouton ac_bouton_retour_arriere.
    document.getElementById("ac_bouton_retour_arriere").setAttribute("onclick", "terminer_ajout(false)");

    if (commande_id == null) {
        document.getElementById("ac_bouton_annuler").innerHTML = "annuler création";
    }
    else {
        document.getElementById("ac_bouton_annuler").innerHTML = "annuler";
    }
}

// Vérifie le conditions lors de la saisie d'un nombre de colis dans l'input.
//      -> nombre positif,
//      -> nombre < 500,
//      -> pas plus de 3 caractères.
function check_valide_input_colis(objet) {
    objet.value = parseFloat(objet.value);
    let minimum = parseInt(objet.min);
    let maximum = parseInt(objet.max);
    if (objet.value.length > objet.maxLength) {
        objet.value = objet.value.slice(0, objet.maxLength);
    }
    if (objet.value < minimum) {
        objet.value = "";
    }
    else if (objet.value > maximum) {
        objet.value = maximum;
    }
}

// Création de l'interface pour choisir le type de colis de la commande.
function creation_commande_p2(commande_id=null) {
    masque_body();
    // Initialisation.
    if (!status_creation_commande.estOuvert) {
        document.getElementById("ajouter_commande").style.display = "block";
        status_creation_commande.estOuvert = !status_creation_commande.estOuvert;
    }
    document.getElementById("ac_bouton_valider").style.display = "none";
    document.getElementById("ac_main_ajout_commande").innerHTML = "";
    document.getElementById("ac_titre_ajout_commande").innerHTML = "Type de colis";
    let couleurs = ["rgb(29, 27, 27)", "rgb(48, 42, 40)"];

    // Création de la liste de choix.
    let main_part = document.getElementById("ac_main_ajout_commande");
    for (let i=0; i<choix_type_colis.length; i++) {
        let nouveau_colis = document.createElement("div");
        nouveau_colis.setAttribute("class", "ac_LC_colis");
        nouveau_colis.setAttribute("id", "colis_"+i);
        nouveau_colis.setAttribute("label", choix_type_colis[i]);
        nouveau_colis.onclick = function() {
            if (commande_id == null) {
                status_creation_commande.id_colis = i;
                creation_commande_p3(); 
            }
            else {
                document.getElementById("type_cagette_commande_"+commande_id).value = this.getAttribute("label");
                terminer_ajout(false);
            }
                       
        }
        nouveau_colis.style.backgroundColor = couleurs[i%2];

        let case_colis = document.createElement("input");
        case_colis.setAttribute("type", "radio");
        case_colis.setAttribute("name", "colis");
        case_colis.setAttribute("class", "ac_case_colis");
        case_colis.setAttribute("id", choix_type_colis[i]);
    

        let nom_colis = document.createElement("label");
        nom_colis.setAttribute("for", choix_type_colis[i]);
        nom_colis.setAttribute("class", "ac_label_colis");
        nom_colis.innerHTML = choix_type_colis[i];
    
        nouveau_colis.appendChild(case_colis);
        nouveau_colis.appendChild(nom_colis);
    
        main_part.appendChild(nouveau_colis);
    }


    // Coloration de l'input en mémoire (+ le coche) s'il en existe un.
    if (commande_id != null) {
        for (let i=0; i<choix_type_colis.length; i++) {
            if (choix_type_colis[i] == document.getElementById("type_cagette_commande_"+commande_id).value) {
                status_creation_commande.id_colis = i;
                break;
            }
        }
    }
    if (status_creation_commande.id_colis != null) {
        document.getElementById(choix_type_colis[status_creation_commande.id_colis]).checked = true;
        document.getElementById("colis_"+status_creation_commande.id_colis).style.backgroundColor = "green";
    }

    // Affectation de la valeur onclick du bouton ac_bouton_retour_arriere.
    if (commande_id == null) {
        document.getElementById("ac_bouton_retour_arriere").setAttribute("onclick", "creation_commande_p1()");
        document.getElementById("ac_bouton_annuler").innerHTML = "annuler création";
    }
    else {
        document.getElementById("ac_bouton_retour_arriere").setAttribute("onclick", "terminer_ajout(false)");
        document.getElementById("ac_bouton_annuler").innerHTML = "annuler";
    }
}

// Création de l'interface pour choisir le nombre de palettes de la commande.
function creation_commande_p3(commande_id=null) {
    masque_body();
    // Initialisation.
    if (!status_creation_commande.estOuvert) {
        document.getElementById("ajouter_commande").style.display = "block";
        status_creation_commande.estOuvert = !status_creation_commande.estOuvert;
    }
    document.getElementById("ac_bouton_valider").style.display = "none";
    document.getElementById("ac_main_ajout_commande").innerHTML = "";
    document.getElementById("ac_titre_ajout_commande").innerHTML = "Nombre de palettes";

    let main_part = document.getElementById("ac_main_ajout_commande");

    // Création des boutons pour choisir le nombre de palettes.
    for (let i=0; i<=max_palettes; i++) {
        let nouveau_bouton = document.createElement("button");
        nouveau_bouton.setAttribute("class", "ac_bouton_palette");
        nouveau_bouton.setAttribute("id", "creation_running_"+i);
        nouveau_bouton.innerHTML = i;
        nouveau_bouton.onclick = function() {
            if (commande_id == null) {
                status_creation_commande.nb_palettes = i;
                document.getElementById("ajouter_commande").style.display = "none";
                // document.getElementById("nb_palettes_commande_"+commande_id).innerHTML = i;
                terminer_ajout(true);
            }
            else {
                document.getElementById("nb_palettes_commande_"+commande_id).innerHTML = i;
                change_background_bouton("nb_palettes_commande_"+commande_id, i);
                terminer_ajout(false);
            }
        }
        main_part.appendChild(nouveau_bouton);
        change_background_bouton("creation_running_"+i, i);
    }

    // Affectation de la valeur onclick du bouton ac_bouton_retour_arriere.
    if (commande_id == null) {
        document.getElementById("ac_bouton_retour_arriere").setAttribute("onclick", "creation_commande_p2()");
        document.getElementById("ac_bouton_annuler").innerHTML = "annuler création";
    }
    else {
        document.getElementById("ac_bouton_retour_arriere").setAttribute("onclick", "terminer_ajout(false)");
        document.getElementById("ac_bouton_annuler").innerHTML = "annuler";
    }
}

function change_background_bouton(id_bouton, nb_palettes) {
    bouton = document.getElementById(id_bouton);
    if (nb_palettes == 0) {
        bouton.style.background = "transparent";
    }
    else if (nb_palettes == 1) {
        bouton.style.background = "linear-gradient(to bottom, transparent 75%,"+palette_infos.couleur+" 75%)";
    }
    else {
        bouton.style.background = "linear-gradient(to bottom, transparent 25%,"+palette_infos.couleur+" 25%,"+palette_infos.couleur+" 50%,transparent 50%,transparent 75%,"+palette_infos.couleur+" 75%,"+palette_infos.couleur+" 75%)";
    }
}

function valider() {
    sauvegarder_commandes_memoire(true);
    location.href = "./palette_puzzle.html";
}

function sauvegarder_commandes_memoire(changement_page=false) {
    let liste_commandes = [];
    lignes_commandes = document.getElementsByClassName("ligne_commande");
    if (lignes_commandes.length == 0) {
        return;
    }
    for (let i=0; i<lignes_commandes.length; i++) {
        let id_commande = parseInt(lignes_commandes[i].getAttribute("id").substr(3));
        let nb_colis_commande = parseInt(document.getElementById("nb_colis_commande_"+id_commande).value);
        let type_cagette_commande = document.getElementById("type_cagette_commande_"+id_commande).value;
        let nb_palettes_commande = document.getElementById("nb_palettes_commande_"+id_commande).innerHTML;
        liste_commandes.push([nb_colis_commande, type_cagette_commande, nb_palettes_commande])
    }
    sessionStorage.setItem('CH_listeCommandes_session', liste_commandes.toString());

    if (changement_page) {
        localStorage.setItem('CH_listeCommandes', liste_commandes.toString());
    }
}

function ouvre_param(premiere=true) {
    masque_body();
    document.getElementById("param_hauteurs").style.display = "block";
    param_liste_colis = document.getElementById("param_liste_colis");
    while (param_liste_colis.firstChild) {
        param_liste_colis.removeChild(param_liste_colis.lastChild);
    }

    document.getElementById("ajouter_colis").style.display = "block";
    document.getElementById("valider_param").style.display = "block";

    param_ajouter_colis(palette_infos, true);
    if (premiere) {
        param_modifie = false;
        document.getElementById('parametres').style.display = 'block';
        document.getElementById("valider_param").style.backgroundColor = "grey";
        document.getElementById("valider_param").style.borderColor = "grey";
        hauteur_max = localStorage.getItem('CH_hauteur_max');
        hauteur_dangereuse = localStorage.getItem('CH_hauteur_dangereuse');
    }

    document.getElementById("data_hauteur_max").value = hauteur_max;
    document.getElementById("data_hauteur_dangereuse").value = hauteur_dangereuse;

    if (param_modifie) {
        document.getElementById("valider_param").style.backgroundColor = "green";
        document.getElementById("valider_param").style.borderColor = "green";
    }

    for (let i=0; i<liste_colis.length; i++) {
        param_ajouter_colis(liste_colis[i]);
    }

    let dessin_palette_largeur = document.getElementById("param_donnees_palette").offsetHeight;
    let ecran = document.getElementById("parametres");
    let dessin_palette_longueur = Math.min(ecran.offsetHeight, ecran.offsetWidth) * 0.3;

    let ratio_resize = dessin_palette_longueur / palette_infos.longueur;
    if (dessin_palette_largeur / palette_infos.largeur < dessin_palette_longueur / palette_infos.longueur) {
        ratio_resize = dessin_palette_largeur / palette_infos.largeur;
    }

    liste_lignes_palettes = document.getElementsByClassName("ligne_param_palette");
    for (let i=0; i<liste_lignes_palettes.length; i++) {
        liste_lignes_palettes[i].style.width = palette_infos.longueur * ratio_resize + "px";
        liste_lignes_palettes[i].style.height = ratio_resize + "px";
    }

    m_unites = document.getElementsByClassName("m_unite");
    for (let i=0; i<m_unites.length; i++) {
        m_unites[i].style.width = ratio_resize + "px";
        m_unites[i].style.height = ratio_resize + "px";
    }

    for (let i=0; i<liste_colis; i++) {
        liste_colis[i].nb_par_rang = parseInt(palette_infos.longueur / liste_colis[i].longueur) * parseInt(palette_infos.largeur / liste_colis[i].largeur);
    }
}

function param_ajouter_colis(element, palette=false) {
    document.getElementById("param_bouton_retour_arriere").onclick = function() {
        document.getElementById('parametres').style.display = 'none';
        document.getElementById("main").style.display = "block";
        document.getElementById("main").style.animation = "none";
        liste_colis = JSON.parse(localStorage.getItem('CH_liste_colis'));
        palette_infos = JSON.parse(localStorage.getItem('CH_palette_infos'));
    }

    param_liste_colis = document.getElementById("param_liste_colis");

    let nouveau_colis= document.createElement("li");
    nouveau_colis.setAttribute("class", "param_colis");

    let titre_colis = document.createElement("h2");
    titre_colis.setAttribute("class", "param_titre");
    titre_colis.innerHTML = element.nom;

    let modif_titre = document.createElement("buton");
    modif_titre.style.backgroundImage = "url(./ressources/pencil.png)";
    modif_titre.setAttribute("class", "modif_titre");
    modif_titre.onclick = function() {
        modifie_valeur_titre(element);
    }
    titre_colis.appendChild(modif_titre);

    if (element.typeobjet != "palette") {
        let suppr_colis = document.createElement("buton");
        suppr_colis.style.backgroundImage = "url(./ressources/delete.png)";
        suppr_colis.setAttribute("class", "suppr_titre");
        suppr_colis.onclick = function() {
            param_modifie = true;
            for (let i=0; i<liste_colis.length; i++) {
                if (liste_colis[i].nom == element.nom) {
                    liste_colis.splice(i, 1);
                    ouvre_param(false);
                    return;
                }
            }
        }
        titre_colis.appendChild(suppr_colis);
    }

    let param_infos = document.createElement("div");
    param_infos.setAttribute("class", "param_infos");

    let choix_couleur = document.createElement("input");
    choix_couleur.setAttribute("type", "color");
    choix_couleur.setAttribute("value", element.couleur)
    choix_couleur.setAttribute("class", "choix_couleur");
    choix_couleur.onchange = function() {
        param_modifie = true;
        element.couleur = this.value;
        ouvre_param(false);
    }

    let param_donnees = document.createElement("div");
    param_donnees.setAttribute("class", "param_donnees");
    if (palette) {
        param_donnees.setAttribute("id", "param_donnees_palette");
    }

    let type_donnees = [["Longueur: ", "longueur", "u", element.longueur], ["Largeur: ", "largeur", "v", element.largeur], ["Hauteur: ", "hauteur", "cm", element.hauteur]];
    for (let i=0; i<type_donnees.length; i++) {
        let param_donnee = document.createElement("div");
        param_donnee.setAttribute("class", "param_donnee");

        let label = document.createElement("p");
        label.setAttribute("class", "label");
        label.innerHTML = type_donnees[i][0];

        let qte = document.createElement("input");
        qte.setAttribute("type", "number");
        qte.setAttribute("step", "0.01");
        qte.setAttribute("size", "5");
        qte.setAttribute("class", "qte");
        qte.value = type_donnees[i][3];
        qte.onclick = function() {
            modifie_valeur_param(element, type_donnees[i][0]+"("+type_donnees[i][2]+")", type_donnees[i][1]);
        }
    
        let unite = document.createElement("p");
        unite.setAttribute("class", "unite");
        unite.innerHTML = type_donnees[i][2];

        param_donnee.appendChild(label);
        param_donnee.appendChild(qte);
        param_donnee.appendChild(unite);

        param_donnees.appendChild(param_donnee);
    }




    let param_palette = document.createElement("div");
    param_palette.setAttribute("class", "param_palette");

    let  largeur_done = false;
    for (let i=0; i<palette_infos.largeur; i++) {
        let longueur_done = false;
        if (i>=element.largeur) {
            largeur_done = true;
            longueur_done = true;
        }
        let ligne_param_palette = document.createElement("div");
        ligne_param_palette.setAttribute("class", "ligne_param_palette");
        for (let j=0; j<palette_infos.longueur; j++) {
            if (j>=element.longueur && !largeur_done) {
                longueur_done = true;
            }
            let m_unite = document.createElement("div");
            if (palette || !longueur_done) {
                m_unite.style.backgroundColor = element.couleur;
            }
            else {
                m_unite.style.backgroundColor = palette_infos.couleur;
                m_unite.style.opacity = "0.5";
            }
            m_unite.setAttribute("class", "m_unite");
            ligne_param_palette.appendChild(m_unite);
        }
        param_palette.appendChild(ligne_param_palette);
    }


    param_infos.appendChild(choix_couleur);
    param_infos.appendChild(param_donnees);
    param_infos.appendChild(param_palette);

    nouveau_colis.appendChild(titre_colis);
    nouveau_colis.appendChild(param_infos);

    param_liste_colis.appendChild(nouveau_colis);
}

function modifie_valeur_titre(element) {
    document.getElementById("param_hauteurs").style.display = "none";
    // document.getElementById("param_bouton_retour_arriere").onclick = function() {
    //     ouvre_param(false);
    // }
    document.getElementById("ajouter_colis").style.display = "none";
    document.getElementById("valider_param").style.display = "none";

    param_liste_colis = document.getElementById("param_liste_colis");
    while (param_liste_colis.firstChild) {
        param_liste_colis.removeChild(param_liste_colis.lastChild);
    }

    let titre_change = document.createElement("h2");
    titre_change.setAttribute("id", "titre_change");
    titre_change.innerHTML = element.nom;

    let label_change = document.createElement("p");
    label_change.setAttribute("id", "label_change");
    label_change.innerHTML = "Nom: ";

    let input_change = document.createElement("input");
    input_change.setAttribute("type", "text");
    input_change.setAttribute("name", "input_change");
    input_change.setAttribute("id", "input_change");
    input_change.setAttribute("size", "1");
    input_change.setAttribute("value", element.nom);

    let btn_valider = document.createElement("button");
    btn_valider.setAttribute("id", "param_valide_change");
    btn_valider.innerHTML = "valider";
    btn_valider.onclick = function() {
        if (document.getElementById("input_change").value.length == 0) {
            alert("Veuillez rentrer un nom.");
        }
        if (element.nom != document.getElementById("input_change").value) {
            let exist_deja = false;
            for (let i=0; i<liste_colis.length; i++) {
                if (liste_colis[i].nom == document.getElementById("input_change").value) {
                    exist_deja = true;
                    break;
                }
            }
            if (exist_deja) {
                alert("Ce nom de colis est déjà pris.");
            }
            else {
                param_modifie = true;
                element.nom = document.getElementById("input_change").value;
                ouvre_param(false);
            }
        }
        else {
            ouvre_param(false);
        }
    }

    param_liste_colis.appendChild(titre_change);
    param_liste_colis.appendChild(label_change);
    param_liste_colis.appendChild(input_change);
    param_liste_colis.appendChild(btn_valider);
    document.getElementById("input_change").focus()
    document.getElementById("input_change").onchange = function() {
        document.getElementById("param_valide_change").click();
    }
    let val = document.getElementById("input_change").value;
    document.getElementById("input_change").value = '';
    document.getElementById("input_change").value = val;
}

function modifie_valeur_param(element, type_elem, variable) {
    document.getElementById("param_bouton_retour_arriere").onclick = function() {
        ouvre_param(false);
    }
    document.getElementById("param_hauteurs").style.display = "none";
    let data;
    if (variable == "longueur") {
        data = element.longueur;
    }
    else if (variable == "largeur") {
        data = element.largeur;
    }
    else {
        data = element.hauteur;
    }
    document.getElementById("ajouter_colis").style.display = "none";
    document.getElementById("valider_param").style.display = "none";

    param_liste_colis = document.getElementById("param_liste_colis");
    while (param_liste_colis.firstChild) {
        param_liste_colis.removeChild(param_liste_colis.lastChild);
    }
    let titre_change = document.createElement("h2");
    titre_change.setAttribute("id", "titre_change");
    titre_change.innerHTML = element.nom;

    let label_change = document.createElement("p");
    label_change.setAttribute("id", "label_change");
    label_change.innerHTML = type_elem;

    let input_change = document.createElement("input");
    input_change.setAttribute("type", "number");
    input_change.setAttribute("name", "input_change");
    input_change.setAttribute("id", "input_change");
    input_change.setAttribute("min", 0);
    input_change.setAttribute("max", 20);
    input_change.setAttribute("maxlength", "3");
    if (variable != "hauteur") {
        input_change.setAttribute("oninput", "check_valide_input_colis(this)");
    }
    else {
        input_change.setAttribute("step", "0.01");
    }
    input_change.setAttribute("size", "1");
    input_change.setAttribute("value", data);

    let btn_valider = document.createElement("button");
    btn_valider.setAttribute("id", "param_valide_change");
    btn_valider.innerHTML = "valider";
    btn_valider.onclick = function() {
        if (document.getElementById("input_change").value.length == 0) {
            alert("Veuillez rentrer une "+variable+".");
            modifie_valeur_param(element, type_elem, variable);
            return;
        }
        if (variable == "longueur") {
            if (element.typeobjet == "palette") {
                for (let i=0; i<liste_colis.length; i++) {
                    if (liste_colis[i].longueur > parseInt(document.getElementById("input_change").value)) {
                        alert("Vous avez rentré une longueur de palette inférieure à la longueur d'un des colis ("+liste_colis[i].nom+")");
                        modifie_valeur_param(element, type_elem, variable);
                        return;
                    }
                }
            }
            element.longueur = parseInt(document.getElementById("input_change").value);
            if (element.longueur > palette_infos.longueur) {
                alert("Vous avez rentré une plus grande longueur que la palette ("+palette_infos.longueur+"u)");
                modifie_valeur_param(element, type_elem, variable)
                return;
            }
            else {
                param_modifie = true;
                ouvre_param(false);
            }
        }
        else if (variable == "largeur") {
            if (element.typeobjet == "palette") {
                for (let i=0; i<liste_colis.length; i++) {
                    if (liste_colis[i].largeur > parseInt(document.getElementById("input_change").value)) {
                        alert("Vous avez rentré une largeur de palette inférieure à la longueur d'un des colis ("+liste_colis[i].nom+")");
                        modifie_valeur_param(element, type_elem, variable);
                        return;
                    }
                }
            }
            element.largeur = parseInt(document.getElementById("input_change").value);
            if (element.largeur > palette_infos.largeur) {
                alert("Vous avez rentré une plus grande largeur que la palette ("+palette_infos.largeur+"v)");
                modifie_valeur_param(element, type_elem, variable)
                return;
            }
            else {
                param_modifie = true;
                ouvre_param(false);
            }
        }
        else {
            element.hauteur = parseFloat(document.getElementById("input_change").value);
            param_modifie = true;
            ouvre_param(false);
        }
    }

    param_liste_colis.appendChild(titre_change);
    param_liste_colis.appendChild(label_change);
    param_liste_colis.appendChild(input_change);
    param_liste_colis.appendChild(btn_valider);
    document.getElementById("input_change").focus()
    document.getElementById("input_change").onchange = function() {
        document.getElementById("param_valide_change").click();
    }
    let val = document.getElementById("input_change").value;
    document.getElementById("input_change").value = '';
    document.getElementById("input_change").value = val;

}

function creation_colis() {
    document.getElementById("param_hauteurs").style.display = "none";
    document.getElementById("param_bouton_retour_arriere").onclick = function() {
        ouvre_param(false);
    }
    document.getElementById("ajouter_colis").style.display = "none";
    document.getElementById("valider_param").style.display = "none";
    let nouveau_colis = new TypeColis("", 1, 1, 0, 1, "");
    creation_colis_p1(nouveau_colis);
}

function creation_colis_p1(nouveau_colis) {
    param_liste_colis = document.getElementById("param_liste_colis");
    while (param_liste_colis.firstChild) {
        param_liste_colis.removeChild(param_liste_colis.lastChild);
    }
    let titre_change = document.createElement("h2");
    titre_change.setAttribute("id", "titre_change");
    titre_change.innerHTML = "Nouveau colis";

    let label_change = document.createElement("p");
    label_change.setAttribute("id", "label_change");
    label_change.innerHTML = "Nom:"

    let input_change = document.createElement("input");
    input_change.setAttribute("type", "text");
    input_change.setAttribute("name", "input_change");
    input_change.setAttribute("id", "input_change");
    input_change.setAttribute("size", "1");

    let btn_valider = document.createElement("button");
    btn_valider.setAttribute("id", "param_valide_change");
    btn_valider.innerHTML = "valider";
    btn_valider.onclick = function() {
        nouveau_colis.nom = document.getElementById("input_change").value;
        if (nouveau_colis.nom.length == 0) {
            alert("Veuillez rentrer un nom de colis.");
            creation_colis_p1(nouveau_colis);
            return;
        }
        else if (nouveau_colis.nom == "clear") {
            let suppr = confirm("Voulez vous réinitialiser tous les paramètres ?");
            if (suppr) {
                localStorage.clear();
                sessionStorage.clear();
                location.href = "index.html";
                return;
            }
        }
        let exist_deja = false;
        for (let i=0; i<liste_colis.length; i++) {
            if (liste_colis[i].nom == nouveau_colis.nom) {
                exist_deja = true;
                break;
            }
        }
        if (exist_deja) {
            alert("Ce nom de colis est déjà pris.");
            creation_colis_p1(nouveau_colis);
            return;
        }
        else {
            creation_colis_p2(nouveau_colis);
        }
    }

    param_liste_colis.appendChild(titre_change);
    param_liste_colis.appendChild(label_change);
    param_liste_colis.appendChild(input_change);
    param_liste_colis.appendChild(btn_valider);
    document.getElementById("input_change").focus()
    document.getElementById("input_change").onchange = function() {
        document.getElementById("param_valide_change").click();
    }
}

function creation_colis_p2(nouveau_colis) {
    let couleur = "#ff0000";
    param_liste_colis = document.getElementById("param_liste_colis");
    while (param_liste_colis.firstChild) {
        param_liste_colis.removeChild(param_liste_colis.lastChild);
    }
    let titre_change = document.createElement("h2");
    titre_change.setAttribute("id", "titre_change");
    titre_change.innerHTML = nouveau_colis.nom;

    let label_change = document.createElement("p");
    label_change.setAttribute("id", "label_change");
    label_change.innerHTML = "Couleur: ";

    let choix_couleur = document.createElement("input");
    choix_couleur.setAttribute("type", "color");
    choix_couleur.setAttribute("class", "choix_couleur");
    choix_couleur.setAttribute("id", "param_couleur_change");
    choix_couleur.setAttribute("value", "#FFFFFF");

    let btn_valider = document.createElement("button");
    btn_valider.setAttribute("id", "param_valide_change");
    btn_valider.innerHTML = "valider";
    btn_valider.onclick = function() {
        nouveau_colis.couleur = document.getElementById("param_couleur_change").value;
        creation_colis_p3(nouveau_colis, 0);
    }

    param_liste_colis.appendChild(titre_change);
    param_liste_colis.appendChild(label_change);
    param_liste_colis.appendChild(choix_couleur);
    param_liste_colis.appendChild(btn_valider);
}

function creation_colis_p3(nouveau_colis, i) {
    let liste_choix = ["Longueur: (u)", "Largeur: (v)", "Hauteur: (cm)"];
    let labels = ["longueuer", "largeur", "hauteur"];
    param_liste_colis = document.getElementById("param_liste_colis");
    while (param_liste_colis.firstChild) {
        param_liste_colis.removeChild(param_liste_colis.lastChild);
    }
    let titre_change = document.createElement("h2");
    titre_change.setAttribute("id", "titre_change");
    titre_change.innerHTML = nouveau_colis.nom;

    let label_change = document.createElement("p");
    label_change.setAttribute("id", "label_change");
    label_change.innerHTML = liste_choix[i];

    let input_change = document.createElement("input");
    input_change.setAttribute("type", "number");
    input_change.setAttribute("name", "input_change");
    input_change.setAttribute("id", "input_change");
    input_change.setAttribute("min", 0);
    input_change.setAttribute("max", 20);
    input_change.setAttribute("maxlength", "3");
    if (i != 2) {
        input_change.setAttribute("oninput", "check_valide_input_colis(this)");
    }
    else {
        input_change.setAttribute("step", "0.01");
    }
    input_change.setAttribute("size", "1");

    let btn_valider = document.createElement("button");
    btn_valider.setAttribute("id", "param_valide_change");
    btn_valider.innerHTML = "valider";
    btn_valider.onclick = function() {
        if (document.getElementById("input_change").value.length == 0) {
            alert("Veuillez rentrer une "+labels[i]+".");
            creation_colis_p3(nouveau_colis, i);
            return;
        }
        if (i==0) {
            nouveau_colis.longueur = parseInt(document.getElementById("input_change").value);
            if (nouveau_colis.longueur > palette_infos.longueur) {
                alert("Vous avez rentré une plus grande longueur que la palette ("+palette_infos.longueur+"u)");
                creation_colis_p3(nouveau_colis, i);
                return;
            }
            else {
                creation_colis_p3(nouveau_colis, (i+1));
            }
        }
        else if (i==1) {
            nouveau_colis.largeur = parseInt(document.getElementById("input_change").value);
            if (nouveau_colis.largeur > palette_infos.largeur) {
                alert("Vous avez rentré une plus grande largeur que la palette ("+palette_infos.largeur+"v)");
                creation_colis_p3(nouveau_colis, i);
                return;
            }
            else {
                creation_colis_p3(nouveau_colis, (i+1));
            }
        }
        else if (i==2) {
            nouveau_colis.hauteur = parseFloat(document.getElementById("input_change").value);
            liste_colis.push(nouveau_colis);
            param_modifie = true;
            ouvre_param(false);

        }
    }

    param_liste_colis.appendChild(titre_change);
    param_liste_colis.appendChild(label_change);
    param_liste_colis.appendChild(input_change);
    param_liste_colis.appendChild(btn_valider);
    document.getElementById("input_change").focus()
    document.getElementById("input_change").onchange = function() {
        document.getElementById("param_valide_change").click();
    }
}

function valider_parametres() {
    if (!param_modifie) {
        document.getElementById('parametres').style.display = 'none';
        document.getElementById("main").style.display = "block";
        document.getElementById("main").style.animation = "none";
        return;
    }
    palette_infos.longueur = parseInt(palette_infos.longueur);
    palette_infos.largeur = parseInt(palette_infos.largeur);
    palette_infos.hauteur = parseFloat(palette_infos.hauteur);
    for (let i=0; i<liste_colis.length; i++) {
        liste_colis[i].longueur = parseInt(liste_colis[i].longueur);
        liste_colis[i].largeur = parseInt(liste_colis[i].largeur);
        liste_colis[i].hauteur = parseFloat(liste_colis[i].hauteur);
        liste_colis[i].nb_par_rang = parseInt(palette_infos.longueur / liste_colis[i].longueur) * parseInt(palette_infos.largeur / liste_colis[i].largeur);
    }
    localStorage.setItem('CH_palette_infos', JSON.stringify(palette_infos));
    localStorage.setItem('CH_liste_colis', JSON.stringify(liste_colis));

    hauteur_max = parseFloat(document.getElementById("data_hauteur_max").value);
    hauteur_dangereuse = parseFloat(document.getElementById("data_hauteur_dangereuse").value);
    localStorage.setItem("CH_hauteur_max", hauteur_max);
    localStorage.setItem("CH_hauteur_dangereuse", hauteur_dangereuse);

    location.href = "./index.html";
}

function erase_commandes() {
    main = document.getElementById("main");
    while (main.firstChild.id != "inserer_valider") {
        main.removeChild(main.firstChild);
    }
}

function change_hauteur(input) {
    input.blur();
    param_modifie = true;
    hauteur_max = parseFloat(document.getElementById("data_hauteur_max").value);
    hauteur_dangereuse = parseFloat(document.getElementById("data_hauteur_dangereuse").value);
    document.getElementById("valider_param").style.backgroundColor = "green";
    document.getElementById("valider_param").style.borderColor = "green";
}

function affichage_commandes_memoire() {
    if (session_commandes.length != 0) {
        for (let i=0; i<session_commandes.length; i++) {
            status_creation_commande.estOuvert = true;
            status_creation_commande.nb_colis = parseInt(session_commandes[i][0]);
            let trouve = false;
            let index = 0;
            for (let j=0; j<choix_type_colis.length; j++) {
                if (choix_type_colis[j] == session_commandes[i][1]) {
                    trouve = true;
                    index = j
                    break;
                }
            }
            if (trouve) {
                status_creation_commande.id_colis = index;
                status_creation_commande.nb_palettes = session_commandes[i][2];
                terminer_ajout(true);
            }
            else {
                alert("Le colis "+session_commandes[i][1]+" n'existe plus, la commande en mémoire a donc été effacée.");
            }
        }
    }
    else {
        document.getElementById("titre_page").style.animationDuration = "2s";
        document.getElementById("titre_page").style.animationName = "animation_entree";

        document.getElementById("bouton_parametre").style.animationDuration = "4s";
        document.getElementById("bouton_parametre").style.animationName = "apparition_entree";

        document.getElementById("bouton_erase").style.animationDuration = "4s";
        document.getElementById("bouton_erase").style.animationName = "apparition_entree";


        document.getElementById("second_titre").style.animationDuration = "4s";
        document.getElementById("second_titre").style.animationName = "apparition_entree";

        document.getElementById("main").style.animationDuration = "4s";
        document.getElementById("main").style.animationName = "apparition_entree";
    }
}

function masque_body() {
    document.getElementById("main").style.display = "none";
}