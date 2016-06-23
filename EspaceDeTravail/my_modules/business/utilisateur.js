/**
 * http://usejsdoc.org/
 * couche business des utilisateurs
 * 
 */
var utilisateur_courant = {
			"nom" 		: "Lemoine",
			"prenom" 	: "Fabien",
			};


// ==================================================
// le get de l'utilisateur courant
// ==================================================
var get_courant = function (){
	return utilisateur_courant; 
}
	
// ==================================================
// Les exports
// ==================================================	
exports.get_courant = get_courant;
