var ArrayList = require('ArrayList');


var applications = new ArrayList;

applications.add({ 	"id"				:	"00001",
					"nom" 				: "visiocap",
					"configurations" 	: {
						"urlCTG"	: 	"http://toto",
						"log"		:	"c:log.txt"
					}});
					
applications.add({ 	"id"				:	"00002",
					"nom" 				: "esic",
					"configurations" 	: {
						"urlCTG"	: 	"http://toto",
						"log"		:	"c:log.txt"
						}});

//==================================================
//Permet d'avoir une liste d'application
//==================================================
var getApplications = 
	function (req, res){
	
		console.log(req);
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
