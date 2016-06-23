/**
 * http://usejsdoc.org/
 * couche http des utilisateurs
 * 
 */
var utilisateur = require("../business/utilisateur");

var get_courant_http = 
	function (req, res){		
		res.send(utilisateur.get_courant());
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
	 		utilisateur.get_courant().nom =req.headers.nom;
	 		utilisateur.get_courant().prenom = req.headers.prenom;
			res.setHeader('location', '/v1/utilisateurs/courant');
			return res.status(201).send(null);
		 	}
};

//==================================================
//Les exports
//==================================================	
exports.get_courant_http = get_courant_http;
exports.put_courant_http = put_courant_http;
