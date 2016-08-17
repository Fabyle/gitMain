/**
 * http://usejsdoc.org/
 */
var neo4j = require("./tools/requeteurCypherNeo4J");
var lecteurCatalogue = require("./tools/lecteurCatalogue");



var params={limit : 10}
var callback=function (err,data){
	console.log (JSON.stringify(data))};
	
//titre des colonnes
console.log("Espace;Code fonction;Libellé de la fonction;Libellé court;Technologie;Impacts potentiels; OK /KO ; Description de l'anomalie");
	
	
lecteurCatalogue.lit(function callback(retour){
	
		if (retour !== null)
			{
			retour.forEach(function(each){
				
				console.log(each.espace+";"+
						each.code+";"+
						each.libelle+";"+
						each.libelleCourt+";"+
						each.technologie+";"+
						each.impact+";;;");
				});
			}			
		});
		
	

