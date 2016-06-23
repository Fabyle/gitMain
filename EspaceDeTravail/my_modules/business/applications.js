var ArrayList = require('ArrayList'),
fournisseur = require('./fournisseur'),
configuration = require('./configuration'),
application_status = require('./application_status');


var applications = new ArrayList;

applications.add({ 	"id"				:	"00001",
					"nom" 				: 	"visiocap",
					"reference_cassini"	:	"Axxxx",
					"fournisseur"		: new fournisseur.fournisseur(),
					"configuration" 	: new configuration.esic(),
					"status"			: new application_status.inconnu()});
					
applications.add({ 	"id"				:	"00002",
					"nom" 				: "esic",
					"reference_cassini"	:	"Axxxx",
					"fournisseur"		: new fournisseur.fournisseur(),
					"configuration" 	: new configuration.visiocap(),
					"status"			: new application_status.inconnu()});

//==================================================
//Permet d'avoir une liste d'application
//==================================================
var getApplications = 
	function (req, res){
	
		if (!req.query.nom)
			{// le nom de l'application n'est pas renseigné
			// on retourne toutes les applications
			res.send(applications);	
			}
		else {
			// le nom de l'application est renseigné
			// on retourne les applications vérifiant ce nom.
			sousListe = applications.find (function (application){
				return application.nom === req.query.nom;
			})
			res.send(sousListe);
		}
		
	};
	
//==================================================
//Permet d'avoir une liste d'application
//==================================================	
var getApplication = 
	function (req, res){
	if (!req.query.nom_application) 
		{// le nom de l'application n'est pas renseigné
		// on retourne toutes les applications
		element = applications.findOne(function (application){
			console.log (req.path);
			splitted = new ArrayList();
			splitted.add(req.path.split("/"));
			console.log (splitted.last());
			return application.id===splitted.last();
		})
		res.send(element);	
		}
};
	

//==================================================
//Les exports
//==================================================
exports.getApplications = getApplications
exports.getApplication = getApplication
