/*--------------------------------------------------------------------
 * Sous profil 
 * 
 */
var Transform = require('stream').Transform
, fs= require('fs')
, csv = require('csv-streamify')
, JSONStream = require('JSONStream'),
mysql = require('mysql'),
assert = require('assert'),
stringify = require('csv-stringify');

/* -------------------------------------------------------------------------------------------
 * lecture en base de données mysql
 ---------------------------------------------------------------------------------------------*/
var connexion = mysql.createConnection({
	host : 'localhost',
	user : 'root',
	password : 'snoopy007',
	database : 'base_organisation'
});


connexion.connect(
	function(err){
	 assert.equal(err,null);
	 
	});

var requeteDataBaseSource = stringify();
connexion.query('select * from ORGHACT0').stream().pipe(requeteDataBaseSource);

//requeteDataBaseSource.pipe(process.stdout);

/* -------------------------------------------------------------------------------------------
 * Le fichier source en csv
 ---------------------------------------------------------------------------------------------*/
//var fichierSourceCSV = fs.createReadStream('../1-sourceCSV/ORGHACT0.csv', { encoding: 'UTF-8' });


/* -------------------------------------------------------------------------------------------
 * Le convertisseur CVS en JSON
 ---------------------------------------------------------------------------------------------*/
var csvToJson = csv({objectMode: true,delimiter: ';' });// comma, semicolon, whatever
var csvToJsonDataBase = csv({objectMode: true,delimiter: ',' });// comma, semicolon, whatever
/* -------------------------------------------------------------------------------------------
 * Parser profil permet de transformer un tableau en objet cible
 ---------------------------------------------------------------------------------------------*/
var parser = new Transform({objectMode: true, delimiter: ';'});
parser._transform = function(data, encoding, done) {
	
	//﻿ID_HAB_ACN;VA_SEU;ID_TYP_ACN;ID_PRF;QI_MAJ;TS_MAJ
	if (data[0] !== "" && data[0] !== "ID_HAB_ACN"){
		var lienProfilAction = {
				"_type": "UMLDependency",
				"_id": data[3]+"->"+"action"+data[2],
				"_parent": {
					"$ref": data[3]
				},
				"name": data[1],
				"source": {
					"$ref": data[3]
				},
				"target": {
					"$ref": "action"+data[2]
				},
				"visibility": "public"
			}		

		this.push(lienProfilAction);
	}
		
		
	
	
  done();
};

/* -------------------------------------------------------------------------------------------
 * Pour faire une MAP de lien
 ---------------------------------------------------------------------------------------------*/

var lien;
var parserDansMAPLien = new Transform({objectMode: true, delimiter: ''});
parserDansMAPLien._transform = function(data, encoding, done) {
	
	// A regarder aussi require(through) qui permet de faire des stream
	// bi directionnel
	if (data != null && data.length != 0){
		// data est une string
		lien = JSON.parse(data);
//		console.log(lien.source.$ref);
//		console.log(data);
//		console.log("------------------------------------");
		if (this.mapDeSousLien.get(lien.source.$ref) == null){
			this.mapDeSousLien.set(lien.source.$ref, new Array());
		}
		this.mapDeSousLien.get(lien.source.$ref).push(lien);
		
		this.push("");
	}
		
	done();
};



//les exports
exports.parserDansMAPLien = parserDansMAPLien;
exports.parser = parser;
//exports.fichierSourceCSV = fichierSourceCSV;
exports.requeteDataBaseSource = requeteDataBaseSource;
exports.csvToJson = csvToJson;
exports.csvToJsonDataBase = csvToJsonDataBase;
