var liste_colis = [
    new TypeColis("carton bois", 2, 2, 10.5, 8, "brown"),
    new TypeColis("carton beige", 2, 2, 10, 8, "yellow"),
    new TypeColis("IFCO", 2, 2, 10.5, 8, "green")
];

var AP_palette = [
    ["0","0","0","0","0","0","0","0"],
    ["0","0","0","0","0","0","0","0"],
    ["0","0","0","0","0","0","0","0"],
    ["0","0","0","0","0","0","0","0"]
];

function TypeColis(nom, longueur, largeur, hauteur, nb_par_rang, couleur) {
    this.nom = nom;
    this.longueur = longueur;
    this.largeur = largeur;
    this.hauteur = hauteur;
    this.nb_par_rang = nb_par_rang;
    this.couleur = couleur;

    this.aire = longueur * largeur;
}