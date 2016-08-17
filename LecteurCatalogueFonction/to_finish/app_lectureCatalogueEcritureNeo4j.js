/**
 * http://usejsdoc.org/
 */
var neo4j = require("./tools/requeteurCypherNeo4J");
var lecteurCatalogue = require("./tools/lecteurCatalogue");

//var params={limit : 10}

/**------------------------------------------------------------------------------
 * Fonction de callback basic
 ------------------------------------------------------------------------------*/
var basicCallback=function (err,data){
	//console.log (JSON.stringify(data))
	};	
	

/**------------------------------------------------------------------------------
* Fonction de création des objets fonctions dans NEO4J
------------------------------------------------------------------------------*/
var createFonction = function (retour){
	retour.forEach(function(each){
		stringFonctionAdapte = JSON.stringify(each).replace(new RegExp('"',"g"),"'");
		stringFonctionAdapte = stringFonctionAdapte.replace(new RegExp("{'","g"),'{');
		stringFonctionAdapte = stringFonctionAdapte.replace(new RegExp(",'","g"),',');
		stringFonctionAdapte = stringFonctionAdapte.replace(new RegExp("':","g"),':');
		
		var queryFonction = 
			"match (e:Espace   { label :'"+ each.espace+"' } )" +
			" create (f:Fonction "+  stringFonctionAdapte +") "+
			" -[:espace]-> e";
		console.log(queryFonction);
		neo4j.cypher(queryFonction,null,basicCallback);			
		});
}

/**------------------------------------------------------------------------------
* Fonction de création des Espaces dans NEO4J
------------------------------------------------------------------------------*/
var createEspace = function (retour, cb){
	var setEspace = new Set();
	
		
	retour.forEach(function(each){
		setEspace.add("create (e:Espace   { label :'"+ each.espace+"' } )");
	});
	setEspace.forEach(function(each){
		neo4j.cypher(each,null,basicCallback);		
	});
	
	cb(retour);
}


/**------------------------------------------------------------------------------
* Fonction de création des Objets dans NEO4J
------------------------------------------------------------------------------*/
var fonctionLecture = function(){
	lecteurCatalogue.lit(function callback(retour){
	if (retour !== null)
		{
		createEspace(retour, createFonction);
		}			
	});
};

/**------------------------------------------------------------------------------
* Le main
------------------------------------------------------------------------------*/
neo4j.cleanAll(fonctionLecture());
	

	

