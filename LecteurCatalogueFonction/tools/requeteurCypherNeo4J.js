/**
 * http://usejsdoc.org/
 * permet de faire des appels vers neo4j
 */
var r = require("request");

// 127.0.0.1 en local 
//var txtUrl = "http://localhost:7474/db/data/transaction/commit";
var txtUrl = "http://127.0.0.1:7474/db/data/transaction/commit";
var username = "neo4j";
var password = "snoopy007";
var auth ="Basic "+ new Buffer(username+":"+password).toString('base64');

/**------------------------------------------------------------------------------
* Fonction pour envoyer des ordre CYPHER pour NEO4J
------------------------------------------------------------------------------*/
function cypher(query,params,cb)
	{
	//console.log("cypher");
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
	console.log('cleanAll');
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
function prepareTextForJSON(texte){
	texte = texte.replace(new RegExp("'","g"),"_");
	texte = texte.replace(new RegExp('"',"g"),"'");
	texte = texte.replace(new RegExp("{'","g"),'{');
	texte = texte.replace(new RegExp(",'","g"),',');
	texte = texte.replace(new RegExp("':","g"),':');
	return texte; 
}


function prepareText(texte){
	texte = texte.replace(/[^a-zA-Z0-9]/g,'_');		
	return texte; 
}

/**------------------------------------------------------------------------------
* Les Exports
------------------------------------------------------------------------------*/
exports.cypher = cypher;
exports.cleanAll = cleanAll;
exports.prepareTextForJSON = prepareTextForJSON;
exports.prepareText = prepareText;
