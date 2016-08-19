/**
 * http://usejsdoc.org/
 */
var excel = require("../tools/lecteurExcel");
var neo4j = require("../tools/requeteurCypherNeo4J");

/**------------------------------------------------------------------------------
 * Fonction de callback basic
 ------------------------------------------------------------------------------*/
var basicCallback=function (err,data){
	console.log (JSON.stringify(data))
	};	
	
	

/**------------------------------------------------------------------------------
	* Fonction qui ecrit les objets, un objet est créé par ligne
	* le label de l'objet est le nom de l'onglet excel ou il existe
	* les attributs sont les noms des colonnes. 
------------------------------------------------------------------------------*/
var fonctionEcriture = function(mapDeFeuilles,callback){
	mapDeFeuilles.forEach( function ( feuille, nomFeuille, mapParcourus){
		console.log("fonctionEcriture");
		var deja_vu_emetteur = new Array;
		var deja_vu_sujet = new Array;
		feuille.forEach( function (ligne, numeroLigne, mapParcourus2){
			
			if ( deja_vu_emetteur.indexOf(ligne.De___nom_) === -1)
				{
				deja_vu_emetteur.push(ligne.De___nom_);
				request ="create (f:emetteur { nom:'"+ligne.De___nom_+"'}) ";				
				console.log(request);
				neo4j.cypher(request,null,function(err,data){});
				}
			if (ligne.Objet !== undefined){
				sujet = neo4j.prepareText(ligne.Objet);
				if ( deja_vu_sujet.indexOf(sujet) === -1)
				{
					deja_vu_sujet.push(sujet);
					request ="create (s:objet { texte:'"+sujet+"'})";
					console.log(request);
					neo4j.cypher(request,null,function(err,data){});
					}				
				}			
			});	
		})
		callback(mapDeFeuilles);
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
			
			if (ligne.Objet !== undefined ){
					requete = "MATCH (f),(s) where " +
					"f:emetteur and "+
					"f.nom = '"+ligne.De___nom_+"' and "+
					"s:objet and "+
					"s.texte = '"+neo4j.prepareText(ligne.Objet)+"' "+
					"create (f) -[r:sujet]-> (s)";
					console.log(requete);
					neo4j.cypher(requete,null,basicCallback);
				}
			
		})
	})
	
}


// le script de lancement
excel.excelLinesToObjectBasedOnTitle("../notcommit/mail.xlsx",function(mapDeFeuilles){
	neo4j.cleanAll(function(){
		fonctionEcriture(mapDeFeuilles, function(){
			fonctionFaireDesLiens(mapDeFeuilles);
		});
	})
});


