function ajout_commande(quantite=1) {
    // Ajoute une nouvelle ligne pour une nouvelle commande.
    for (let i = 0; i < quantite; i++) {
        let body = document.body;
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

        body.insertBefore(nouvelle_ligne, inserer_valider);
    }
}

ajout_commande(3);