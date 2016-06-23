var ArrayList = require('ArrayList'),
fournisseur = require('./fournisseur'),
configuration = require('./configuration'),
application_etat = require('./application_etat');


var applications = new ArrayList;

applications.add({ 	"id"				:	"00001",
					"nom" 				: 	"visiocap",
					"reference_cassini"	:	"Axxxx",
					"fournisseur"		: new fournisseur.fournisseur(),
					"configuration" 	: new configuration.esic(),
					"status"			: new application_etat.inconnu()});
					
applications.add({ 	"id"				:	"00002",
					"nom" 				: "esic",
					"reference_cassini"	:	"Axxxx",
					"fournisseur"		: new fournisseur.fournisseur(),
					"configuration" 	: new configuration.visiocap(),
					"status"			: new application_etat.inconnu()});

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
//Permet d'avoir une application
//==================================================	
var get_application = 
	function (req, res){
		element = basic_get_application(req, res);
		res.send(element);		
};


var basic_get_application = 
	function (req, res){
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

//==================================================
//Permet de changer le status de l'application 
//==================================================	
var change_etat = 
	function (req, res){
		element = basic_get_application(req, res);
		element.status = new application_etat.a_demarrer();
		res.send(element);		
};
	

//==================================================
//Les exports
//==================================================
exports.getApplications = 	getApplications;
exports.get_application = 	get_application;
exports.change_etat = 	change_etat;
