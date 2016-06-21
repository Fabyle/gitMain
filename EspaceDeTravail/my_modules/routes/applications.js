var ArrayList = require('ArrayList');


var applications = new ArrayList;

applications.add({ "nom" : "visioCAP",
					"configurations" : {
						"urlCTG"	: 	"http://toto",
						"log"		:	"c:log.txt"
					}});
					
applications.add({ "nom" : "ESIC",
						"configurations" : {
							"urlCTG"	: 	"http://toto",
							"log"		:	"c:log.txt"
						}});

//==================================================
//le get la liste des applications
//==================================================
var getApplications = 
	function (req, res){
		if (!req.query.nom_application) 
			{// le nom de l'application n'est pas renseigné
			// on retourne toutes les applications
			res.send(applications);	
			console.log(applications);
			}
		else {
			// le nom de l'application est renseigné
			// on retourne les applications vérifiant ce nom.
			sousListe = applications.find (function (application){
				return application.nom === req.query.nom_application;
			})
			res.send(sousListe);
		}
		
	};	

//==================================================
//Les exports
//==================================================
exports.getApplications = getApplications
