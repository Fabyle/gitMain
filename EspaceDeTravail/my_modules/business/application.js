var ArrayList = require('ArrayList'),
fournisseur = require('./fournisseur'),
configuration = require('./configuration'),
application_etat = require('./application_etat'),
utilisateur = require('./utilisateur'),
notation = require('./notation');


var applications = new ArrayList;

applications.add({ 	"id"				:	"00001",
					"nom" 				: 	"visiocap",
					"reference_cassini"	:	"Axxxx",
					"fournisseur"		: new fournisseur.fournisseur(),
					"configuration" 	: new configuration.esic(),
					"etat"				: new application_etat.inconnu(),
					"notations"			: new notation.notation(utilisateur.get_courant()) });
					
applications.add({ 	"id"				:	"00002",
					"nom" 				: "esic",
					"reference_cassini"	:	"Axxxx",
					"fournisseur"		: new fournisseur.fournisseur(),
					"configuration" 	: new configuration.visiocap(),
					"etat"				: new application_etat.inconnu()});


/* --------------------------
 * methode qui fournit toutes les applications
 */

var get_applications = function (){
	return applications;
}


/*-------------------------
 * methode qui recherche une application selon son id
 */

var get_application = 
	function (req){
	element = applications.findOne(function (application){
		splitted = new ArrayList();
		splitted.add(req.path.split("/"));
		//console.log (splitted.last());
		idElement = splitted.get(3);
		console.log (idElement);
		return application.id===idElement;
	});
	return element;
};

/*-------------------------
 * methode qui change l'état
 */
var patch_application_etat = 
	function(req){
	element = get_application(req);
	element.etat = new application_etat.a_demarrer();
}



//==================================================
//Les exports
//==================================================
exports.get_applications = get_applications;
exports.get_application = 	get_application;
exports.patch_application_etat = 	patch_application_etat;

