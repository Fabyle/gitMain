/**
 * http://usejsdoc.org/
 * permet de faire des appels vers neo4j
 */
var r = require("request");


var txtUrl = "http://localhost:7474/db/data/transaction/commit";
var username = "neo4j";
var password = "***REMOVED***";
var auth ="Basic "+ new Buffer(username+":"+password).toString('base64');

/**------------------------------------------------------------------------------
* Fonction pour envoyer des ordre CYPHER pour NEO4J
------------------------------------------------------------------------------*/
function cypher(query,params,cb)
	{
	r.post({
		uri:txtUrl, 
		headers : {
			'Authorization':auth
		},
		json:{statements:[{statement:query,parameters:params}]}},
		function(err,res){
				//console.log(err);
				if ( res !== undefined)
				cb(err,res.body)});
	}

/**------------------------------------------------------------------------------
* Fonction pour envoyer des ordre de nettoyage pour NEO4J
------------------------------------------------------------------------------*/
function cleanAll(callback){
	cypher('MATCH ()-[r]-() DELETE r',null,
            function(){
      console.log('Nettoyage des liens'); 
      cypher('MATCH (n) DELETE n ', null, 
                   function(){
            console.log('Nettoyage des noeuds');
            callback();
      })});

}

/**------------------------------------------------------------------------------
* Fonction qui permet de nettoyer un texte avant que ce texte soit intégré dans une requete 
------------------------------------------------------------------------------*/
function prepareText(texte){
	texte = texte.replace(new RegExp("'","g"),"_");
	texte = texte.replace(new RegExp('"',"g"),"'");
	texte = texte.replace(new RegExp("{'","g"),'{');
	texte = texte.replace(new RegExp(",'","g"),',');
	texte = texte.replace(new RegExp("':","g"),':');
	return texte; s
}

/**------------------------------------------------------------------------------
* Les Exports
------------------------------------------------------------------------------*/
exports.cypher = cypher;
exports.cleanAll = cleanAll;
exports.prepareText = prepareText;
