// Le module de routage des flux http
var utilisateurs = require("../business/utilisateurs"),
	applications = require("../business/applications");

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
	// Le get applications ( mode liste )
	// permet de retourner une liste d'application
	// soit toutes la liste
	// soit vérifiant un critères
	//  http://localhost:3000/v1/applications
	// http://localhost:3000/v1/applications?nom=esic
	// ==================================================
	app.get('/v1/applications',
			applications.getApplications);
	
	// ==================================================
	// Le get applications pour une application en particulier ( mode unitaire )
	// on doit fournir l'id de l'application
	// http://localhost:3000/v1/applications/00001
	// ==================================================
	app.get('/v1/applications/:id',
			applications.get_application);	
	
	// ==================================================
	// Le patch pour changer le status d'une application
	//
	// ==================================================
	app.patch('/v1/applications/:id/:etat',
			applications.change_etat);
	
}

//==================================================
//Les exports
//==================================================
module.exports = appRouter