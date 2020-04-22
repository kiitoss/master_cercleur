// Affectation de la hauteur de "affichage_palette" en fonction de la hauteur de "choix_palette".
let height_choix_palettes = document.getElementById("choix_palettes").offsetHeight;
document.getElementById("affichage_palette").style.height = "calc(90vh - "+height_choix_palettes+"px)";
