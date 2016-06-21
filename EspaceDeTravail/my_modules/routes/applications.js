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
//le get la liste des applications
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
	
var getApplication = 
	function (req, res){
	if (!req.query.nom_application) 
		{// le nom de l'application n'est pas renseigné
		// on retourne toutes les applications
		res.send(applications);	
		}
};
	

//==================================================
//Les exports
//==================================================
exports.getApplications = getApplications
exports.getApplication = getApplication
