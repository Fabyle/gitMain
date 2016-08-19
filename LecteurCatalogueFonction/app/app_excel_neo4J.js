/**
 * http://usejsdoc.org/
 */
var excel = require("../tools/lecteurExcel");
var neo4j = require("../tools/requeteurCypherNeo4J");

/**------------------------------------------------------------------------------
 * Fonction de callback basic
 ------------------------------------------------------------------------------*/
var basicCallback=function (err,data){
	//console.log (JSON.stringify(data))
	};	
	
	

/**------------------------------------------------------------------------------
	* Fonction qui ecrit les objets, un objet est créé par ligne
	* le label de l'objet est le nom de l'onglet excel ou il existe
	* les attributs sont les noms des colonnes. 
------------------------------------------------------------------------------*/
var fonctionEcriture = function(mapDeFeuilles,callback){
	mapDeFeuilles.forEach( function ( feuille, nomFeuille, mapParcourus){
		feuille.forEach( function (ligne, numeroLigne, mapParcourus2){
			request = neo4j.prepareText(JSON.stringify(ligne));
			request =" create (f:"+nomFeuille+" "+request+")";			
			console.log(request);
			neo4j.cypher(request,null,function(err,data){
				
			});	
		})
		callback(mapDeFeuilles);
	})
}

/**------------------------------------------------------------------------------
* Fonction qui fait le lien
* le lien se fait si on a le meme titre de colonne dans excel et la meme valeur de cellule
* si ces conditions sont remplis alors le lien se fait. 
* Les liens sont fait dans les deux directions. 
------------------------------------------------------------------------------*/
var fonctionFaireDesLiens = function(mapDeFeuilles){
	
	mapDeFeuilles.forEach( function ( feuille, nomFeuille, mapParcourus){
		feuille.forEach( function (ligne, numeroLigne, mapParcourus2){
			
			for (colonne in ligne){
				requete = "MATCH (n),(m) where " +
						"NOT n:"+nomFeuille+" and "+
						"m:"+nomFeuille+" and "+
						"n."+neo4j.prepareText(colonne)+" = '"+neo4j.prepareText(ligne[colonne])+"' and " +
						"m."+neo4j.prepareText(colonne)+" = '"+neo4j.prepareText(ligne[colonne])+"' " +
						"create (m)-[r:"+nomFeuille+"_"+neo4j.prepareText(colonne)+"]->(n) "
						"return n, m ";
				//console.log(requete);
				neo4j.cypher(requete,null,basicCallback);
			}
			
			
		})
	})

	
	
	
}


// le script de lancement
excel.excelLinesToObjectBasedOnTitle("../data/validationMOA.xlsx",function(mapDeFeuilles){
	//console.log(mapDeFeuilles);
	neo4j.cleanAll(function(){
		fonctionEcriture(mapDeFeuilles, function(){
			fonctionFaireDesLiens(mapDeFeuilles);
		});
	})
});


