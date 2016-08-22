/**
 * http://usejsdoc.org/
 */
var lecteurTabulation = require("../tools/lecteurTabulation");
var neo4j = require("../tools/requeteurCypherNeo4J");

/**------------------------------------------------------------------------------
 * Fonction de callback basic
 ------------------------------------------------------------------------------*/
var basicCallback=function (err,data){
	console.log (JSON.stringify(data))
	};	
	
	

/**------------------------------------------------------------------------------
	Ecriture des emetteurs des mails et des objets.  
------------------------------------------------------------------------------*/
var fonctionEcriture = function(listeDeMail,callback){
	
		console.log("fonctionEcriture");
		var deja_vu_emetteur = new Array;
		var deja_vu_sujet = new Array;
		listeDeMail.forEach( function (mail){
			
			if ( deja_vu_emetteur.indexOf(mail.de) === -1)
				{
				deja_vu_emetteur.push(mail.de);
				request ="create (f:emetteur { nom:'"+mail.de+"'}) ";				
				console.log(request);
				neo4j.cypher(request,null,function(err,data){});
				}
			if (mail.objet !== undefined){
				sujet = neo4j.prepareText(mail.objet);
				if ( deja_vu_sujet.indexOf(sujet) === -1)
				{
					deja_vu_sujet.push(sujet);
					request ="create (s:objet { texte:'"+sujet+"'})";
					console.log(request);
					neo4j.cypher(request,null,function(err,data){});
					}				
				}			
			});	
		
		callback(listeDeMail);
	}


/**------------------------------------------------------------------------------
	Liens entres les mails et les objets. 
------------------------------------------------------------------------------*/
var fonctionFaireDesLiens = function(listeMail){
	
	listeMail.forEach( function (mail){
			
			if (mail.objet !== undefined ){
					requete = "MATCH (f),(s) where " +
					"f:emetteur and "+
					"f.nom = '"+mail.de+"' and "+
					"s:objet and "+
					"s.texte = '"+neo4j.prepareText(mail.objet)+"' "+
					"create (f) -[r:sujet]-> (s)";
					console.log(requete);
					neo4j.cypher(requete,null,basicCallback);
				}
			
		})
	
	
}


// le script de lancement
lecteurTabulation.lireTabulation("../notcommit/mail.txt",function(listeMail){
	neo4j.cleanAll(function(){
		console.log("pouet");
		fonctionEcriture(listeMail, function(){
			fonctionFaireDesLiens(listeMail);
		});
	})
});


