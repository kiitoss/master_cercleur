var choix_type_colis = ["carton bois", "carton beige", "IFCO"];

var status_creation_commande = new Object();
status_creation_commande.estOuvert = false;
status_creation_commande.nb_colis = null;

function ajout_commande(quantite=1) {
    // Ajoute une nouvelle ligne pour une nouvelle commande.
    for (let i = 0; i < quantite; i++) {
        let main_part = document.getElementById("main");;
        let inserer_valider = document.getElementById("inserer_valider");

        let nouvelle_ligne = document.createElement("div");
        nouvelle_ligne.setAttribute("class", "ligne_commande");

        let colis_infos = document.createElement("div");
        colis_infos.setAttribute("class", "colis_infos");

        let label_colis = document.createElement("label");
        label_colis.setAttribute("for", "input_colis");
        label_colis.innerHTML = "Colis: ";


        let input_colis = document.createElement("input");
        input_colis.setAttribute("type", "number");
        input_colis.setAttribute("id", "input_colis");
        input_colis.setAttribute("name", "input_colis");
        input_colis.setAttribute("min", "0");
        input_colis.setAttribute("max", "500");
        input_colis.setAttribute("size", "1");

        colis_infos.appendChild(label_colis);
        colis_infos.appendChild(input_colis);


        let cagette_infos = document.createElement("div");
        cagette_infos.setAttribute("class", "cagette_infos");

        let label_cagette = document.createElement("label");
        label_cagette.setAttribute("for", "input_cagette");
        label_cagette.innerHTML = "Type cagette: ";


        let input_cagette = document.createElement("input");
        input_cagette.setAttribute("type", "text");
        input_cagette.setAttribute("id", "input_cagette");
        input_cagette.setAttribute("name", "input_cagette");
        input_cagette.setAttribute("maxlength", "50");
        input_cagette.setAttribute("size", "10");

        cagette_infos.appendChild(label_cagette);
        cagette_infos.appendChild(input_cagette);


        let palette_infos = document.createElement("div");
        palette_infos.setAttribute("class", "palette_infos");

        let btn_palette = document.createElement("button");
        btn_palette.innerHTML = "=";

        palette_infos.appendChild(btn_palette);



        nouvelle_ligne.appendChild(colis_infos);
        nouvelle_ligne.appendChild(cagette_infos);
        nouvelle_ligne.appendChild(palette_infos);

        main_part.insertBefore(nouvelle_ligne, inserer_valider);
    }
}

function terminer_ajout(ajout_valide) {
    if (ajout_valide) {
        ajout_commande();
    }
    document.getElementById("ac_main_ajout_commande").innerHTML = "";
    document.getElementById("ajouter_commande").style.display = "none";
    status_creation_commande.estOuvert = false;
    status_creation_commande.nb_colis = null;
}

function creation_commande_p1() {
    // Initialisation
    if (!status_creation_commande.estOuvert) {
        document.getElementById("ajouter_commande").style.display = "block";
    }
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

    if (status_creation_commande.nb_colis != null) {
        document.getElementById("ac_input_colis").value = status_creation_commande.nb_colis;
    }

    document.getElementById("ac_input_colis").focus()

    // Ecriture dans le bouton ac_bouton_suivant et affectation de la valeure onclick.
    document.getElementById("ac_bouton_suivant").innerHTML = "suivant";
    document.getElementById("ac_bouton_suivant").setAttribute("onclick", "creation_commande_p2()");

    // Affectation de la valeur onclick du bouton ac_bouton_retour_arriere.
    document.getElementById("ac_bouton_retour_arriere").setAttribute("onclick", "terminer_ajout(false)");
}

function creation_commande_p2() {
    // Récupération et stockage du nombre de colis rentrés.
    let nb_colis = document.getElementById("ac_input_colis").value;
    if (nb_colis.length == 0) {
        nb_colis = 0;
    }
    status_creation_commande.nb_colis = parseInt(nb_colis);

    // Initialisation.
    document.getElementById("ac_main_ajout_commande").innerHTML = "";
    document.getElementById("ac_titre_ajout_commande").innerHTML = "Type de colis";

    // Création de la liste de choix.
    let main_part = document.getElementById("ac_main_ajout_commande");
    for (let i=0; i<choix_type_colis.length; i++) {
        let nouveau_colis = document.createElement("div");
        nouveau_colis.setAttribute("class", "ac_LC_colis");
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

    // Affectation de la valeur onclick du bouton ac_bouton_retour_arriere.
    document.getElementById("ac_bouton_retour_arriere").setAttribute("onclick", "creation_commande_p1()");

    
}






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