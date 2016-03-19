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
	password : '***REMOVED***',
	database : 'base_organisation'
});


connexion.connect(
	function(err){
	 assert.equal(err,null);
	 
	});

var requeteDataBaseSource = stringify();
connexion.query('select * from ORGUTLT0').stream().pipe(requeteDataBaseSource);

//requeteDataBaseSource.pipe(process.stdout);

/* -------------------------------------------------------------------------------------------
 * Le fichier source en csv
 ---------------------------------------------------------------------------------------------*/
//var fichierSourceCSV = fs.createReadStream('../1-sourceCSV/ORGUTLT0.csv', { encoding: 'UTF-8' });


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
	
//	var utilisateur = {
//	typeObjet				:	"UTILISATEUR",
//	ID_UTL 					:	data[0],
//	LB_SGN_SAL				:	data[1],
//	CO_SAL					:	data[2],
//	ID_TYP_PRM_ABS			:	data[3],
//	ID_STR					:	data[4],
//	ID_CLL					:	data[5],
//	ID_PRF					:	data[6],
//	ID_ADR_TEL_1		 	:	data[7],
//	ID_ADR_TEL_2			:	data[8],
//	NO_PST_TEL				:	data[9],
//	CO_CVL					:	data[10],
//	LB_INI		 			:	data[11],
//	LB_NOM					:	data[12],
//	LB_PRE					:	data[13],
//	DT_DEB		 			:	data[14],
//	DT_FIN					:	data[15],
//	TX_ACT					:	data[16],
//	BL_ACT					:	data[17],
//	BL_PVI_ACS_CRB_GRP	 	:	data[18],
//	LB_FNC_SGN				:	data[19],
//	BL_SGN_ELC				:	data[20],
//	QI_MAJ					:	data[21],
//	TS_MAJ					:	data[22]			
//	
//};
	if (data[0] !== "" && data[0] !== "ID_UTL"){
		var lienCelluleUtilisateur = {
				"_type": "UMLDependency",
				"_id": "cellule"+data[5]+"->"+"utilisateur"+data[1].trim(),
				"_parent": {
					"$ref": "cellule"+data[5]
				},
				"source": {
					"$ref": "cellule"+data[5]
				},
				"target": {
					"$ref": "utilisateur"+data[1].trim()
				},
				"visibility": "public"
			}		

		this.push(lienCelluleUtilisateur);
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
