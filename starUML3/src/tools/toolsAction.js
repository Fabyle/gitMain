/*--------------------------------------------------------------------
 * UTILISATEURS 
 * 
 */
var Transform = require('stream').Transform
, fs= require('fs')
, csv = require('csv-streamify')
, JSONStream = require('JSONStream')
, tools = require('./tools'),
toolsStarUML = require ('./toolsStarUML'),
mysql = require('mysql'),
assert = require('assert'),
stringify = require('csv-stringify');

/* -------------------------------------------------------------------------------------------
 * lecture en base de données mysql
 ---------------------------------------------------------------------------------------------*/
var connexion = mysql.createConnection({
	host : 'localhost',
	user : 'root',
	password : '***REMOVED***',
	database : 'base_organisation'
});


connexion.connect(
	function(err){
	 assert.equal(err,null);
	 
	});

var requeteDataBaseSource = stringify();
connexion.query('select * from ORGACNT0').stream().pipe(requeteDataBaseSource);

//requeteDataBaseSource.pipe(process.stdout);

/* -------------------------------------------------------------------------------------------
 * Le fichier source en csv
 ---------------------------------------------------------------------------------------------*/
//var fichierSourceCSV = fs.createReadStream('../1-sourceCSV/ORGACNT0.csv', { encoding: 'UTF-8' });

/* -------------------------------------------------------------------------------------------
 * Le fichier cible json
 ---------------------------------------------------------------------------------------------*/
var nomDuFichierCible= "../2-tempJSON/bdorg-action.json";
var writeCible = fs.createWriteStream(nomDuFichierCible, { encoding: 'UTF-8' });

/* -------------------------------------------------------------------------------------------
 * Le convertisseur CVS en JSON
 ---------------------------------------------------------------------------------------------*/
var csvToJson = csv({objectMode: true,delimiter: ';' });// comma, semicolon, whatever
var csvToJsonDataBase = csv({objectMode: true,delimiter: ',' });// comma, semicolon, whatever

/* -------------------------------------------------------------------------------------------
 * Le convertisseur JSON to String
 ---------------------------------------------------------------------------------------------*/
var jsonToStrings = JSONStream.stringify("",",","",3);

/* -------------------------------------------------------------------------------------------
 * ParserUtilisateur permet de transformer un tableau en objet cible
 ---------------------------------------------------------------------------------------------*/
var parser = new Transform({objectMode: true, delimiter: ';'});
parser._transform = function(data, encoding, done) {
	
	//ID_TYP_ACN;LB_ACN;LB_TYP_SEU;CO_ACN
		
	if (data[0] !== "" && data[1] !== "LB_ACN") {
				
		var action = {
				"_type": "UMLUseCase",
				"_id": "action"+data[0],
				"_parent": {
					"$ref": "PACKAGE_ACTION"
				},
				"name":  data[4]+"-"+data[1].trim(),
				"ownedElements": []
				,
				"stereotype": "action",
				"visibility": "public",
				"isAbstract": false,
				"isFinalSpecialization": false,
				"isLeaf": false
		}
		
		this.push(action);	
		
	}
	
	
  done();
};

/* -------------------------------------------------------------------------------------------
 * insertion dans starUML des actions
 ---------------------------------------------------------------------------------------------*/

//insertion dans starUML des utilisateur
var fonctionInsererDansStarUML = 
	function(cb) {
	console.log("__________________ ACTION INSERTION STARTING");
	tools.streamToString(fs.createReadStream(nomDuFichierCible),
		function(stringLu){
		toolsStarUML.createStarUML(stringLu,"<templateAction>", 
			function(){
			console.log("__________________ ACTION INSERED");
			cb();			
			});
		});			
	};


//les exports
exports.parser = parser;
//exports.fichierSourceCSV = fichierSourceCSV;
exports.requeteDataBaseSource = requeteDataBaseSource;
exports.csvToJson = csvToJson;
exports.csvToJsonDataBase = csvToJsonDataBase;
exports.jsonToStrings = jsonToStrings;
exports.nomDuFichierCible = nomDuFichierCible;
exports.writeCible = writeCible;
exports.fonctionInsererDansStarUML = fonctionInsererDansStarUML;
