var hauteur_max = 0;
var CH_hauteur_max = localStorage.getItem('CH_hauteur_max');
if (!CH_hauteur_max || CH_hauteur_max == null || CH_hauteur_max == undefined) {
    hauteur_max = 255;
    localStorage.setItem('CH_hauteur_max', hauteur_max);
}
else {
    hauteur_max = CH_hauteur_max;
}

var hauteur_dangereuse = 0;
var CH_hauteur_dangereuse = localStorage.getItem('CH_hauteur_dangereuse');
if (!CH_hauteur_dangereuse || CH_hauteur_dangereuse == null || CH_hauteur_dangereuse == undefined) {
    hauteur_dangereuse = 245;
    localStorage.setItem('CH_hauteur_dangereuse', hauteur_dangereuse);
}
else {
    hauteur_dangereuse = CH_hauteur_dangereuse;
}

var palette_infos;
var CH_palette_infos = JSON.parse(localStorage.getItem('CH_palette_infos'));
if (!CH_palette_infos) {
    palette_infos = new Palette(4, 2, 14.5,rgb_to_hex(20, 20, 250));
    localStorage.setItem('CH_palette_infos', JSON.stringify(palette_infos));
}
else {
    palette_infos = CH_palette_infos;
}


var liste_colis = [];
var CH_liste_colis = JSON.parse(localStorage.getItem('CH_liste_colis'));
if (!CH_liste_colis) {
    liste_colis = [
        new TypeColis("cagette bois", 1, 1, 12.3, rgb_to_hex(222,184,135)),
        new TypeColis("COGIT", 2, 1, 10.4, rgb_to_hex(0,100,0)),
        new TypeColis("IFCO (petit)", 2, 1, 11.5, rgb_to_hex(0,255,0)),
        new TypeColis("carton noir", 2, 1, 10.73, rgb_to_hex(50, 50, 50)),
        new TypeColis("IFCO (grand)", 2, 1, 18.5, rgb_to_hex(0,255,0)),
        new TypeColis("carton rouge", 1, 1, 12, rgb_to_hex(255, 0, 0)),
        new TypeColis("carton blanc", 2, 1, 17.33, rgb_to_hex(255, 255, 255))
    ];
    localStorage.setItem('CH_liste_colis', JSON.stringify(liste_colis));
}
else {
    liste_colis = CH_liste_colis;
}

var max_palettes = 0;
var CH_max_palettes = localStorage.getItem('CH_max_palettes');
if (!CH_max_palettes || CH_max_palettes == null || CH_max_palettes == undefined) {
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

function TypeColis(nom, longueur, largeur, hauteur, couleur) {
    this.nom = nom;
    this.longueur = parseInt(longueur);
    this.largeur = parseInt(largeur);
    this.hauteur = parseFloat(hauteur);
    this.couleur = "#"+couleur;

    this.typeobjet = "colis";

    this.aire = this.longueur * this.largeur;
    this.nb_par_rang = parseInt(palette_infos.longueur / this.longueur) * parseInt(palette_infos.largeur / this.largeur);
}

function Palette(longueur, largeur, hauteur, couleur) {
    this.nom = "palette";
    this.longueur = parseInt(longueur);
    this.largeur = parseInt(largeur);
    this.hauteur = parseFloat(hauteur);

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