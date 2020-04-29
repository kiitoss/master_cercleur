// localStorage.clear();

var liste_colis = [];
var CH_liste_colis = JSON.parse(localStorage.getItem('CH_liste_colis'));
if ((!CH_liste_colis)) {
    liste_colis = [
        new TypeColis("carton bois", 2, 2, 10.5, 8, "brown"),
        new TypeColis("carton beige", 2, 2, 10, 8, "yellow"),
        new TypeColis("IFCO", 2, 2, 10.5, 8, "green")
    ];
    localStorage.setItem('CH_liste_colis', JSON.stringify(liste_colis));
}
else {
    liste_colis = CH_liste_colis;
}


var max_palettes = 0;
var CH_max_palettes = localStorage.getItem('CH_max_palettes');
if ((!CH_max_palettes)) {
    max_palettes = 2;
    localStorage.setItem('CH_max_palettes', max_palettes);
}
else {
    max_palettes = CH_max_palettes;
}



var palette_infos;
var CH_palette_infos = JSON.parse(localStorage.getItem('CH_palette_infos'));
if ((!CH_palette_infos)) {
    palette_infos = new Palette(8, 2, 14.5);
    localStorage.setItem('CH_palette_infos', JSON.stringify(palette_infos));
}
else {
    palette_infos = CH_palette_infos;
}


var AP_palette = [];
for (let j=0; j<palette_infos.largeur; j++) {
    AP_palette.push([]);
    for (let i=0; i<palette_infos.longueur; i++) {
        AP_palette[j].push("0");
    }
}

function TypeColis(nom, longueur, largeur, hauteur, nb_par_rang, couleur) {
    this.nom = nom;
    this.longueur = longueur;
    this.largeur = largeur;
    this.hauteur = hauteur;
    this.nb_par_rang = nb_par_rang;
    this.couleur = couleur;

    this.aire = longueur * largeur;
}


function Palette(longueur, largeur, hauteur) {
    this.longueur = longueur;
    this.largeur = largeur;
    this.hauteur = hauteur;
}