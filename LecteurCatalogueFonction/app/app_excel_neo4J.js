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


var fonctionEcriture = function(mapDeFeuilles){
	mapDeFeuilles.forEach( function ( feuille, nomFeuille, mapParcourus){
		feuille.forEach( function (ligne, numeroLigne, mapParcourus2){
			request = JSON.stringify(ligne).replace(new RegExp('"',"g"),"'");
			request = request.replace(new RegExp("{'","g"),'{');
			request = request.replace(new RegExp(",'","g"),',');
			request = request.replace(new RegExp("':","g"),':');
			request =" create (f:"+nomFeuille+" "+request+")";			
			console.log(request);
			neo4j.cypher(request,null,basicCallback);	
		})
	})
}



excel.excelLinesToObjectBasedOnTitle("../data/validationMOA.xlsx",function(mapDeFeuilles){
	//console.log(mapDeFeuilles);
	neo4j.cleanAll(function(){
		fonctionEcriture(mapDeFeuilles);
	})
});


