// Le module de routage des flux http
var utilisateur_http = require("../http_layer/utilisateur_http"),
	application_http = require("../http_layer/application_http"),
	historique = require("./historique");

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
		historique.ajouter_une_action(req);
		res.send("Bienvenue sur l'espace de travail");
	})
	
	// ==================================================
	// Le get de l'utilisateur courant ( utiliser le snake case avec _ )
	// http://localhost:3000/v1/utilisateur_courant
	// ==================================================
	app.get("/v1/utilisateur_courant",function (req, res){
		historique.ajouter_une_action(req);
		utilisateur_http.get_courant_http(req,res);
	});
	
	// ==================================================
	// Le post de l'utilisateur courant
	//
	// ==================================================
	app.post("/v1/utilisateur_courant",function (req, res){
		historique.ajouter_une_action(req);
		utilisateur_http.put_courant_http(req,res)
	});
		
	
	// ==================================================
	// Le get applications ( mode liste )
	// permet de retourner une liste d'application
	// soit toutes la liste
	// soit vérifiant un critères
	//  http://localhost:3000/v1/applications
	// http://localhost:3000/v1/applications?nom=esic
	// ==================================================
	app.get('/v1/applications',
			application_http.getApplications_http);
	
	// ==================================================
	// Le get applications pour une application en particulier ( mode unitaire )
	// on doit fournir l'id de l'application
	// http://localhost:3000/v1/applications/00001
	// ==================================================
	app.get('/v1/applications/:id',
			application_http.get_application_http);	
	
	// ==================================================
	// Le patch pour changer le status d'une application
	//
	// ==================================================
	app.patch('/v1/applications/:id/:etat',
			application_http.change_etat_http);
	
}

//==================================================
//Les exports
//==================================================
module.exports = appRouter