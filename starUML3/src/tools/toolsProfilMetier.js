/*--------------------------------------------------------------------
 * PROFIL 
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
	password : 'snoopy007',
	database : 'base_organisation'
});


connexion.connect(
	function(err){
	 assert.equal(err,null);
	 
	});

var requeteDataBaseSource = stringify();
connexion.query('select * from ORGPRFT0').stream().pipe(requeteDataBaseSource);

//requeteDataBaseSource.pipe(process.stdout);

/* -------------------------------------------------------------------------------------------
 * Le fichier source en csv
 ---------------------------------------------------------------------------------------------*/
//var fichierSourceCSV = fs.createReadStream('../1-sourceCSV/ORGPRFT0.csv', { encoding: 'UTF-8' });

/* -------------------------------------------------------------------------------------------
 * Le fichier cible json
 ---------------------------------------------------------------------------------------------*/

var nomDuFichierCible= "../2-tempJSON/bdorg-profilMetier.json";
var writeCible = fs.createWriteStream(nomDuFichierCible, { encoding: 'UTF-8' });

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
	
	//console.log(this.mapDeSousLien);
	
	//ID_PRF;LB_PRF;QI_MAJ;TS_MAJ
	var stereotype = "Profil"
		if (data[0] !== "" && data[0] !== "ID_PRF" /*&& ! data[1].match("PRF-UTL")*/) {
			
			if (data[1].startsWith("U-")) {
				stereotype = "Profil Usage";
			}
			
			if (data[1].startsWith("B_") || data[1].startsWith("M-") || data[1].startsWith("S-") ) {
				stereotype = "Profil Métier";
			}
			
			if (data[1].startsWith("PRF-UTL")) {
				stereotype = "Profil Utilisateur";
			}
			
			
			
			
		if (stereotype == "Profil Métier"){
		var profil = {
				"_type": "UMLUseCase",
				"_id": data[0].trim(),
				"_parent": {
					"$ref": "PACKAGE_PROFIL_METIER"
				},
				"name":  data[0].trim()+"-"+data[1].trim(),
				"ownedElements": this.mapDeSousLien.get(data[0])
				,
				"stereotype": stereotype,
				"visibility": "public",
				"isAbstract": false,
				"isFinalSpecialization": false,
				"isLeaf": false
		}
		
		this.push(profil);	
		}
	}
	
	
  done();
};

/* -------------------------------------------------------------------------------------------
 * insertion dans starUML des profils métiers
 ---------------------------------------------------------------------------------------------*/

var fonctionInsererDansStarUML = 
	function(cb) {
	console.log("__________________ PROFIL METIER INSERTION STARTING");
	tools.streamToString(fs.createReadStream(nomDuFichierCible),
		function(stringLu){
		toolsStarUML.createStarUML(stringLu,"<templateProfilMetier>", 
			function(){
			console.log("__________________ PROFIL METIER INSERED");
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
exports.nomDuFichierCible = nomDuFichierCible;
exports.writeCible = writeCible;
exports.fonctionInsererDansStarUML = fonctionInsererDansStarUML;


