/**
 * http://usejsdoc.org/
 */
var r = require("request");

var txtUrl = "http://localhost:7474/db/data/transaction/commit";
var username = "neo4j";
var password = "***REMOVED***";
var auth ="Basic "+ new Buffer(username+":"+password).toString('base64');


function cypher(query,params,cb)
	{
	r.post({
		uri:txtUrl, 
		headers : {
			'Authorization':auth
		},
		json:{statements:[{statement:query,parameters:params}]}},
		function(err,res){
				cb(err,res.body)})
	}

var query="MATCH (utilisateur:Utilisateur)  -[*]-> (action:Action) where  action.code_action =~ '2002' return utilisateur.nom, action.libelle";

var params={limit : 10}
var cb=function (err,data){console.log (JSON.stringify(data))};

cypher(query,params,cb);


