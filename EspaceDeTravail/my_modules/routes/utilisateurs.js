var utilisateurCourant = {
			"nom" 		: "Lemoine",
			"prenom" 	: "Fabien"
		};

// ==================================================
// le get de l'utilisateur courant
// ==================================================
var getCourant = 
	function (req, res){		
		res.send(utilisateurCourant);
	};
	
// ==================================================
// le get de l'utilisateur courant
// retourne un 201 - 
// ==================================================
var putCourant = 
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
exports.getCourant = getCourant
exports.putCourant = putCourant