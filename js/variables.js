// localStorage.clear();

var palette_infos;
var CH_palette_infos = JSON.parse(localStorage.getItem('CH_palette_infos'));
if ((!CH_palette_infos)) {
    palette_infos = new Palette(8, 4, 14.5,rgb_to_hex(20, 20, 250));
    localStorage.setItem('CH_palette_infos', JSON.stringify(palette_infos));
}
else {
    palette_infos = CH_palette_infos;
}


var liste_colis = [];
var CH_liste_colis = JSON.parse(localStorage.getItem('CH_liste_colis'));
if ((!CH_liste_colis)) {
    liste_colis = [
        new TypeColis("carton bois", 2, 2, 10.5, 8, rgb_to_hex(100, 50, 100)),
        new TypeColis("carton beige", 2, 2, 10, 8, rgb_to_hex(100, 100, 20)),
        new TypeColis("IFCO", 2, 2, 10.5, 8, rgb_to_hex(20, 250, 20))
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
    this.couleur = "#"+couleur;

    this.typeobjet = "colis";

    this.aire = longueur * largeur;
    this.nb_par_rang = parseInt(palette_infos.longueur / longueur) * parseInt(palette_infos.largeur / largeur);
}


function Palette(longueur, largeur, hauteur, couleur) {
    this.nom = "palette";
    this.longueur = longueur;
    this.largeur = largeur;
    this.hauteur = hauteur;

    this.typeobjet = "palette";

    this.couleur = "#"+couleur;
}



function color_hex(rgb) { 
    let hex = Number(rgb).toString(16);
    if (hex.length < 2) {
        hex = "0" + hex;
    }
    return hex;
}

function rgb_to_hex(r,g,b) {   
    let rouge = color_hex(r);
    let vert = color_hex(g);
    let bleu = color_hex(b);
    return rouge+vert+bleu;
}