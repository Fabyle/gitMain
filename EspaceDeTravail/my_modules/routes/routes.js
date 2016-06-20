// Le module de routage des flux http
var utilisateurs = require("./utilisateurs")

// ==================================================
// Gestion des requetes http
// ==================================================
var appRouter = function(app){
	
	// ==================================================
	// Le get de base
	// ================================================== 
	app.get("/", 
			function (req, res){
		res.send("Bienvenue sur l'espace de travail");
	})
	
	// ==================================================
	// Le get de l'utilisateur courant
	// ==================================================
	app.get("/v1/utilisateurs/courant",
			utilisateurs.getCourant);
	
	// ==================================================
	// Le put de l'utilisateur courant
	// ==================================================
	app.post("/v1/utilisateurs/courant",
			utilisateurs.putCourant);
}

//==================================================
//Les exports
//==================================================
module.exports = appRouter