var choix_type_colis = ["carton bois", "carton beige", "IFCO"];
var status_creation_commande = new Object();
status_creation_commande.id_commande = 0;
status_creation_commande.estOuvert = false;
status_creation_commande.nb_colis = null;
status_creation_commande.id_colis = null;
status_creation_commande.nb_palettes = null;

function ajout_commande() {
    // Ajoute une nouvelle ligne pour une nouvelle commande.
    let main_part = document.getElementById("main");;
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
    label_cagette.innerHTML = "Type cagette: ";

    let input_cagette = document.createElement("input");
    input_cagette.setAttribute("type", "text");
    input_cagette.setAttribute("name", "input_cagette");
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
    btn_palette.innerHTML = status_creation_commande.nb_palettes;
    btn_palette.setAttribute("id", "nb_palettes_commande_"+status_creation_commande.id_commande);
    btn_palette.setAttribute("id_commande", status_creation_commande.id_commande);
    btn_palette.onclick = function() {
        creation_commande_p3(this.getAttribute("id_commande"));
    }

    palette_infos.appendChild(btn_palette);



    nouvelle_ligne.appendChild(colis_infos);
    nouvelle_ligne.appendChild(cagette_infos);
    nouvelle_ligne.appendChild(palette_infos);

    main_part.insertBefore(nouvelle_ligne, inserer_valider);

    status_creation_commande.id_commande += 1;
}


// Valide ou annule l'ajout d'une nouvelle commande.
function terminer_ajout(ajout_valide) {
    if (ajout_valide) {
        ajout_commande();
    }
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
    objet.value = parseInt(objet.value);
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
    for (let i=0; i<3; i++) {
        let nouveau_bouton = document.createElement("button");
        nouveau_bouton.setAttribute("class", "ac_bouton_palette");
        nouveau_bouton.innerHTML = i;
        nouveau_bouton.onclick = function() {
            if (commande_id == null) {
                status_creation_commande.nb_palettes = i;
                document.getElementById("ajouter_commande").style.display = "none";
                terminer_ajout(true);
            }
            else {
                document.getElementById("nb_palettes_commande_"+commande_id).innerHTML = i;
                terminer_ajout(false);
            }
        }
        main_part.appendChild(nouveau_bouton);
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

function valider() {
    let liste_commandes = [];
    lignes_commandes = document.getElementsByClassName("ligne_commande");
    for (let i=0; i<lignes_commandes.length; i++) {
        let id_commande = parseInt(lignes_commandes[i].getAttribute("id").substr(3));
        let nb_colis_commande = parseInt(document.getElementById("nb_colis_commande_"+id_commande).value);
        let type_cagette_commande = document.getElementById("type_cagette_commande_"+id_commande).value;
        let nb_palettes_commande = document.getElementById("nb_palettes_commande_"+id_commande).innerHTML;
        liste_commandes.push([nb_colis_commande, type_cagette_commande, nb_palettes_commande])
    }
    // console.log(liste_commandes);
    localStorage.setItem('CH_listeCommandes', liste_commandes.toString());
    location.href = "./palette_puzzle.html";
}