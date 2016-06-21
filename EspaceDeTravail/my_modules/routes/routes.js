// Le module de routage des flux http
var utilisateurs = require("./utilisateurs"),
	applications = require("./applications");

// ==================================================
// Gestion des requetes http
//  on fait le choix d'utiliser le snake case pour la forme des URLs avec _
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
	// Le get de l'utilisateur courant ( utiliser le snake case avec _ )
	// http://localhost:3000/v1/utilisateur_courant
	// ==================================================
	app.get("/v1/utilisateur_courant",
			utilisateurs.getCourant);
	
	// ==================================================
	// Le post de l'utilisateur courant
	//
	// ==================================================
	app.post("/v1/utilisateur_courant",
			utilisateurs.putCourant);
	
	// ==================================================
	// Le get applications
	// avec une expression régulière permettant d'avoir les urls suivantes
	// http://localhost:3000/v1/applications
	// http://localhost:3000/v1/applications?nom_application=ESIC
	// ==================================================
	app.get(/v1\/applications.*/,
			applications.getApplications);
	
	
	// ==================================================
	// Le get applications avec expression régulière pour trouver 
	// une application en particulier
	// http://localhost:3000/v1/applications/?nom_application=ESIC
	// ==================================================
	//app.get(,
	//		applications.getApplication);
	
	
}

//==================================================
//Les exports
//==================================================
module.exports = appRouter