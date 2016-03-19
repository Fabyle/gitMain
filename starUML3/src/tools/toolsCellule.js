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
constantes = require('./constantes'),
dictionnaires = require('./dictionnaires'),
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
connexion.query('select * from ORGCLLT0').stream().pipe(requeteDataBaseSource);

//requeteDataBaseSource.pipe(process.stdout);
/* -------------------------------------------------------------------------------------------
 * Le fichier source en csv
 ---------------------------------------------------------------------------------------------*/
//var fichierSourceCSV = fs.createReadStream('../1-sourceCSV/ORGCLLT0.csv', { encoding: 'UTF-8' });

/* -------------------------------------------------------------------------------------------
 * Le fichier cible json
 ---------------------------------------------------------------------------------------------*/
var nomDuFichierCible= "../2-tempJSON/bdorg-cellule.json";
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
	
	//ID_CLL	ID_STR_PNT	ID_UTL_RSP	ID_TYP_MDE_AFC	ID_ADR_TEL_1	ID_ADR_TEL_2	NO_PST_TEL	LB_CLL	BL_REV_CRB_GRP	QI_MAJ	TS_MAJ

	id_cll = dictionnaires.lbCellule_idCellule.get(constantes.lb_cll);
		
	if (data[0] !== "" && data[7] !== "LB_CLL" && data[0] == id_cll) {
		
		var cellule = {
				"_type": "UMLUseCase",
				"_id": "cellule"+data[0],
				"_parent": {
					"$ref": "PACKAGE_CELLULE"
				},
				"name":  data[7].trim(),
				"ownedElements": this.mapDeSousLien.get("cellule"+data[0])
				,
				"stereotype": "cellule",
				"visibility": "public",
				"isAbstract": false,
				"isFinalSpecialization": false,
				"isLeaf": false
		}
		
		this.push(cellule);	
		
	}
	
	
  done();
};

/* -------------------------------------------------------------------------------------------
 * insertion dans starUML des actions
 ---------------------------------------------------------------------------------------------*/

//insertion dans starUML des utilisateur
var fonctionInsererDansStarUML = 
	function(cb) {
	console.log("__________________ CELLULE INSERTION STARTING");
	tools.streamToString(fs.createReadStream(nomDuFichierCible),
		function(stringLu){
		toolsStarUML.createStarUML(stringLu,"<templateCellule>", 
			function(){
			console.log("__________________ CELLULE INSERED");
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

