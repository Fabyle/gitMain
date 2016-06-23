/**
 * http://usejsdoc.org/
 * couche http des applications
 */
var application = require("../business/application");

//==================================================
//Permet d'avoir une liste d'application
//==================================================
var getApplications_http = 
	function (req, res){
	
		if (!req.query.nom)
			{// le nom de l'application n'est pas renseigné
			// on retourne toutes les applications
			res.send(application.get_applications());	
			}
		else {
			// le nom de l'application est renseigné
			// on retourne les applications vérifiant ce nom.
			sousListe = application.get_applications().find (function (application){
				return application.nom === req.query.nom;
			})
			res.send(sousListe);
		}
		
	};
	
//==================================================
//Permet d'avoir une application
//==================================================	
var get_application_http = 
	function (req, res){
		element = application.get_application(req);
		res.send(element);		
};


//==================================================
//Permet de changer le status de l'application 
//==================================================	
var change_etat_http = 
	function (req, res){
		element = application.patch_application_etat(req);		
		res.send(element);		
};

//==================================================
//Les exports
//==================================================
exports.getApplications_http = 	getApplications_http;
exports.get_application_http = 	get_application_http;
exports.change_etat_http = 	change_etat_http;
