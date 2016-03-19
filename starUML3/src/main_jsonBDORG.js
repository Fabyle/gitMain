/**
 * http://usejsdoc.org/
 */

var JSONStream = require('JSONStream'), 
fs= require('fs'),
tools = require('./tools/tools'),
toolsUtilisateur = require ('./tools/toolsUtilisateur'),
toolsLienActionProfil = require ('./tools/toolsLienActionProfil'),
toolsLienCelluleUtilisateurs = require ('./tools/toolsLienCelluleUtilisateurs'),
toolsSousProfil = require ('./tools/toolsSousProfil'),
toolsProfilMetier = require ('./tools/toolsProfilMetier'),
toolsProfilUsage = require ('./tools/toolsProfilUsage'),
toolsAction = require ('./tools/toolsAction'),
toolsCellule = require ('./tools/toolsCellule'),
toolsStarUML = require ('./tools/toolsStarUML'),
events = require('events');


/*--------------------------------------------------------------------
 * Le pipe pour faire une string avec du JSON
 * il faut en faire 3 sinon la sortie de l'un va dans le fichier 3 fois...
 */
var jsonToStringsUtilisateur = JSONStream.stringify("",",","",3);
var jsonToStringsAction = JSONStream.stringify("",",","",3);
var jsonToStringsCellule = JSONStream.stringify("",",","",3);
var jsonToStringsProfil = JSONStream.stringify("",",","",3); // attention il ne démarre plus par une virgule car on ne le met plus à la suite
var jsonToStringsProfilMetier = JSONStream.stringify("",",","",3); // attention il ne démarre plus par une virgule car on ne le met plus à la suite
var jsonToStringsProfilUsage = JSONStream.stringify("",",","",3); // attention il ne démarre plus par une virgule car on ne le met plus à la suite
var jsonToStringsSousProfil = JSONStream.stringify("","","",3); // attention dans ce cas on ne met pas de virgule entre les objets
var jsonToStringsLienActionProfil = JSONStream.stringify("","","",3);// attention dans ce cas on ne met pas de virgule entre les objets
var jsonToStringsLienCelluleUtilisateur = JSONStream.stringify("","","",3);// attention dans ce cas on ne met pas de virgule entre les objets

var event = new events.EventEmitter();


//--------------------------------------------------------------------
// DEROULEMENT
// -------------------------------------------------------------------




//--------------------------------------------------------------------
// 1 - On construit les objets actions.
//--------------------------------------------------------------------
console.log("__________________ ACTION ORGANISATION FILE STARTING");
//toolsAction.fichierSourceCSV
toolsAction.requeteDataBaseSource
.pipe(toolsAction.csvToJsonDataBase)
//.pipe(toolsAction.csvToJson)
.pipe(toolsAction.parser)
.pipe(jsonToStringsAction)
.pipe(toolsAction.writeCible, { end: false });
	

//--------------------------------------------------------------------
// 2 - On construit une map de profil / sous profil 
//--------------------------------------------------------------------
var mapDeSousLien = new Map();

toolsSousProfil.parserDansMAPLien.mapDeSousLien = mapDeSousLien;

console.log("__________________ LIEN SOUS PROFIL FILE STARTING");
//toolsSousProfil.fichierSourceCSV
toolsSousProfil.requeteDataBaseSource
.pipe(toolsSousProfil.csvToJsonDataBase)
//.pipe(toolsSousProfil.csvToJson)
.pipe(toolsSousProfil.parser)
.pipe(jsonToStringsSousProfil)
//.pipe(writeCible, { end: false });
.pipe(toolsSousProfil.parserDansMAPLien)
.pipe(process.stdout, { end: false }); //stdout pour finir proprement à revoir

//--------------------------------------------------------------------
//2 - On construit une map de profil / actions
//--------------------------------------------------------------------
toolsSousProfil.parserDansMAPLien.on('end',
	function(){
	toolsLienActionProfil.parserDansMAPLien.mapDeSousLien = mapDeSousLien;

	console.log("__________________ LIEN PROFIL ET ACTION FILE STARTING");
	//toolsLienActionProfil.fichierSourceCSV
	toolsLienActionProfil.requeteDataBaseSource
	.pipe(toolsLienActionProfil.csvToJsonDataBase)
	//.pipe(toolsLienActionProfil.csvToJson)
	.pipe(toolsLienActionProfil.parser)
	.pipe(jsonToStringsLienActionProfil)
	//.pipe(writeCible, { end: false });
	.pipe(toolsLienActionProfil.parserDansMAPLien)
	.pipe(process.stdout, { end: false }); //stdout pour finir proprement à revoir
	});

//--------------------------------------------------------------------
//2 - On construit une map de cellule / utilisateurs
//-------------------------------------------------------------------
toolsLienActionProfil.parserDansMAPLien.on('end',
		function(){
		toolsLienCelluleUtilisateurs.parserDansMAPLien.mapDeSousLien = mapDeSousLien;

		console.log("__________________ LIEN CELLULE ET UTILISATEUR FILE STARTING");
		//toolsLienCelluleUtilisateurs.fichierSourceCSV
		toolsLienCelluleUtilisateurs.requeteDataBaseSource
		.pipe(toolsLienCelluleUtilisateurs.csvToJsonDataBase)
		//.pipe(toolsLienCelluleUtilisateurs.csvToJson)
		.pipe(toolsLienCelluleUtilisateurs.parser)
		.pipe(jsonToStringsLienCelluleUtilisateur)
		//.pipe(writeCible, { end: false });
		.pipe(toolsLienCelluleUtilisateurs.parserDansMAPLien)
		.pipe(process.stdout, { end: false }); //stdout pour finir proprement à revoir
		});



//--------------------------------------------------------------------
// 3 - On construit un JSON des utilisateurs
//--------------------------------------------------------------------
//on donne la map de lien sous profil au parser
toolsLienCelluleUtilisateurs.parserDansMAPLien.on('end',
	function(){
	toolsUtilisateur.parser.mapDeSousLien = mapDeSousLien;
	console.log("__________________ UTILISATEUR FILE STARTING");
	//toolsUtilisateur.fichierSourceCSV
	toolsUtilisateur.requeteDataBaseSource
	.pipe(toolsUtilisateur.csvToJsonDataBase)
	.pipe(toolsUtilisateur.parser)
	//.pipe(toolsUtilisateur.jsonToStrings)
	.pipe(jsonToStringsUtilisateur)
	.pipe(toolsUtilisateur.writeCible, { end: false });
	});

//--------------------------------------------------------------------
//	3.1 - On construit un JSON des profil métier quand la map des liens profil / sous Profil est prete
//-------------------------------------------------------------------
toolsLienActionProfil.parserDansMAPLien.on('end',
	function(){
	console.log("__________________ LIEN ACTION PROFIL FILE ENDED");
	console.log("__________________ PROFIL METIER FILE STARTING");
		// on donne la map de lien sous profil au parser
	toolsProfilMetier.parser.mapDeSousLien = mapDeSousLien;	
	// pour les profils
	//toolsProfilMetier.fichierSourceCSV
	toolsProfilMetier.requeteDataBaseSource
	.pipe(toolsProfilMetier.csvToJsonDataBase)
	//.pipe(toolsProfilMetier.csvToJson)
	.pipe(toolsProfilMetier.parser)
	.pipe(jsonToStringsProfilMetier)
	.pipe(toolsProfilMetier.writeCible, { end: false });
	
	});

//--------------------------------------------------------------------
//	3.1 - On construit un JSON des profil usage quand la map des liens profil / sous Profil est prete
//-------------------------------------------------------------------
toolsLienActionProfil.parserDansMAPLien.on('end',
	function(){
	console.log("__________________ PROFIL USAGE FILE STARTING");
	// on donne la map de lien sous profil au parser
	toolsProfilUsage.parser.mapDeSousLien = mapDeSousLien;
	// pour les profils
	//toolsProfilUsage.fichierSourceCSV
	toolsProfilUsage.requeteDataBaseSource
		.pipe(toolsProfilUsage.csvToJsonDataBase)
		//.pipe(toolsProfilUsage.csvToJson)
		.pipe(toolsProfilUsage.parser)
		.pipe(jsonToStringsProfilUsage)
		.pipe(toolsProfilUsage.writeCible, { end: false });	
	});


//--------------------------------------------------------------------
//1 - On construit les objets Cellules.
//--------------------------------------------------------------------
jsonToStringsUtilisateur.on('end',
	function(){
	toolsUtilisateur.writeCible.end();
	console.log("__________________ UTILISATEUR FILE ENDED");
	console.log("__________________ CELLULE FILE STARTING");
	toolsCellule.parser.mapDeSousLien = mapDeSousLien;
	
	//toolsCellule.fichierSourceCSV
	toolsCellule.requeteDataBaseSource
	.pipe(toolsCellule.csvToJsonDataBase)
	//.pipe(toolsCellule.csvToJson)
	.pipe(toolsCellule.parser)
	.pipe(jsonToStringsCellule)
	.pipe(toolsCellule.writeCible, { end: false });
	});


//--------------------------------------------------------------------
// 4 - Quand le fichier des utilisateurs est pret on l'insere dans la starUML
//-------------------------------------------------------------------

//jeux de trace pour les actions
jsonToStringsCellule.on('end',
		function(){
		
		});


// jeux de trace pour les actions
jsonToStringsAction.on('end',
		function(){
		console.log("__________________ ACTION FILE ENDED");
		toolsAction.writeCible.end();		
		});

//jeux de trace pour les profil métier
jsonToStringsProfilMetier.on('end',
		function(){
		console.log("__________________ PROFIL METIER FILE ENDED");
		toolsProfilMetier.writeCible.end();
		});

//jeux de trace pour les profils d'usage
jsonToStringsProfilUsage.on('end', 
		function(){
		console.log("__________________ PROFIL USAGE FILE ENDED");
		toolsProfilUsage.writeCible.end();	
		});

//jeux de trace pour les utilisateurs et insertion dans starUML
jsonToStringsCellule.on('end',
		function(){
		console.log("__________________ CELLULE FILE ENDED");
		toolsCellule.writeCible.end();		
		
		toolsUtilisateur.fonctionInsererDansStarUML(
			function(){
				event.emit("UTILISATEUR_DONE");
			});
		});

//insertion des profils métier dans star UML
event.on("UTILISATEUR_DONE",
	function(){
	toolsProfilMetier.fonctionInsererDansStarUML(
		function(){
		event.emit("PROFIL_METIER_DONE");
		});
	});
		
//insertion des profils d'usage dans star UML
event.on("PROFIL_METIER_DONE",
	function(){
	toolsProfilUsage.fonctionInsererDansStarUML(
		function(){
		event.emit("PROFIL_USAGE_DONE");
		});
	});


//insertion des profils d'usage dans star UML
event.on("PROFIL_USAGE_DONE",
	function(){
	toolsAction.fonctionInsererDansStarUML(
		function(){
		event.emit("ACTION_DONE");
		});
	});

event.on("ACTION_DONE",
		function(){
		toolsCellule.fonctionInsererDansStarUML(
			function(){
			event.emit("CELLULE_DONE");
			});
		});
	


event.on("CELLULE_DONE", tools.lancerStarUML);






 






