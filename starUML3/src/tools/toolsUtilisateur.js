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
connexion.query('select * from ORGUTLT0').stream().pipe(requeteDataBaseSource);

//requeteDataBaseSource.pipe(process.stdout);

/* -------------------------------------------------------------------------------------------
 * Le fichier source en csv
 ---------------------------------------------------------------------------------------------*/
//var fichierSourceCSV = fs.createReadStream('../1-sourceCSV/ORGUTLT0.csv', { encoding: 'UTF-8' });

/* -------------------------------------------------------------------------------------------
 * Le fichier cible json
 ---------------------------------------------------------------------------------------------*/
var nomDuFichierCible= "../2-tempJSON/bdorg-utilisateur.json";
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
	
	
//	var utilisateur = {
//			typeObjet				:	"UTILISATEUR",
//			ID_UTL 					:	data[0],
//			LB_SGN_SAL				:	data[1],
//			CO_SAL					:	data[2],
//			ID_TYP_PRM_ABS			:	data[3],
//			ID_STR					:	data[4],
//			ID_CLL					:	data[5],
//			ID_PRF					:	data[6],
//			ID_ADR_TEL_1		 	:	data[7],
//			ID_ADR_TEL_2			:	data[8],
//			NO_PST_TEL				:	data[9],
//			CO_CVL					:	data[10],
//			LB_INI		 			:	data[11],
//			LB_NOM					:	data[12],
//			LB_PRE					:	data[13],
//			DT_DEB		 			:	data[14],
//			DT_FIN					:	data[15],
//			TX_ACT					:	data[16],
//			BL_ACT					:	data[17],
//			BL_PVI_ACS_CRB_GRP	 	:	data[18],
//			LB_FNC_SGN				:	data[19],
//			BL_SGN_ELC				:	data[20],
//			QI_MAJ					:	data[21],
//			TS_MAJ					:	data[22]			
//			
//	};
	
	id_cll = dictionnaires.lbCellule_idCellule.get(constantes.lb_cll);
	
	if (data[0] !== "" && data[1] !== "LB_SGN_SAL" &&
			data[17] =="O"  && data[5] === id_cll) {
		
		
		var ownedElements;
		if (this.mapDeSousLien.get(data[6]) == null){
			ownedElements =new Array();
		}
		else {
			// on construit un lien direct utilisateur sous profil. on efface le profil propre à l'utilisateur
			var stringOwned = JSON.stringify(this.mapDeSousLien.get(data[6]));
			var regex = new RegExp(data[6],"g");
			ownedElements = JSON.parse(stringOwned.replace(regex,"utilisateur"+data[1].trim()));			
		}
		
		
		
		var utilisateur = {
				"_type": "UMLActor",
				"_id": "utilisateur"+data[1].trim(),
				"_parent": {
					"$ref": "PACKAGE_UTILISATEURS"
				},
				"name":  data[1].trim()+"-"+data[13].trim()+" "+data[12].trim(),
				"ownedElements": ownedElements,
				"stereotype": "Utilisateur",
				"visibility": "public",
				"isAbstract": false,
				"isFinalSpecialization": false,
				"isLeaf": false
		}
		
		this.push(utilisateur);	
		
	}
	
	
  done();
};


/* -------------------------------------------------------------------------------------------
 * insertion dans starUML des utilisateur
 ---------------------------------------------------------------------------------------------*/

var fonctionInsererDansStarUML = 
	function(cb) {
	console.log("__________________ UTILISATEUR INSERTION STARTING");
	tools.streamToString(fs.createReadStream(nomDuFichierCible),
		function(stringLu){
		toolsStarUML.createStarUML(stringLu,"<templateUtilisateur>", 
			function(){
			console.log("__________________ UTILISATEUR INSERED");
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
