 /* ---------
	char   szIDUTI[9];  // Identifiant utilisateur
       char   szLBUTI[33]; // Libelle utilisateur
       char   szCOPROF[3]; // Code profil
       char   szCODEL[9];  // Code delegation
       char   szIDSTA[15]; // Nom netbios de la station
       char   szINSEC[3];  // Indice de securite
       char   szIDSOC[3];  // Identifiant societe
       char   szIDMES[7];  // Identifiant messagerie
       char szEspaddon[5]; // Identifiant Espaddon
       char szIdEnv[10];   // Identifiant Environnement
---------*/


var utilisateurCourant = {
			"nom" 		: "Lemoine",
			"prenom" 	: "Fabien",
			};


// ==================================================
// le get de l'utilisateur courant
// ==================================================
var getCourant = function (){
	return utilisateurCourant; 
}


var get_courant_http = 
	function (req, res){		
		res.send(getCourant());
	};
	
// ==================================================
// le post de l'utilisateur courant
// retourne un 201 - 
// ==================================================
var put_courant_http = 
	function (req, res){
		console.log(req.headers);
	 	if(!req.headers.nom || !req.headers.prenom){
	 		return res.send({"status": "error", "message" : "missing parameter"});
	 	}
	 	else {
	 		utilisateurCourant.nom =req.headers.nom;
	 		utilisateurCourant.prenom = req.headers.prenom;
	 		res.setHeader('location', '/v1/utilisateurs/courant');
	 		return res.status(201).send(null);
	 	}
		};
	
// ==================================================
// Les exports
// ==================================================	
exports.get_courant_http = get_courant_http;
exports.getCourant = getCourant;
exports.put_courant_http = put_courant_http;