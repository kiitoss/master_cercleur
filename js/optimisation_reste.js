var commandes_aOptimiser = [];


// Récupération des variables stockées en local.
var CH_listeCommandesAOptimiser = localStorage.getItem('CH_listeCommandesAOptimiser');
if (!CH_listeCommandesAOptimiser) {
    alert("Erreur passation liste commandes à optimiser.");
    location.href = "./index.html";
}
else {
    commandes_aOptimiser = CH_listeCommandesAOptimiser.split(',')
    main();
}


function main() {
    console.log(commandes_aOptimiser);
}