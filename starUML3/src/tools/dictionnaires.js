/**
 * http://usejsdoc.org/
 */
var Transform = require('stream').Transform
, fs= require('fs')
, csv = require('csv-streamify'),
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

var lbCellule_idCellule = new Map();

/* -------------------------------------------------------------------------------------------
 * Le convertisseur CVS en JSON
 ---------------------------------------------------------------------------------------------*/
var csvToJson = csv({objectMode: true,delimiter: ';' });// comma, semicolon, whatever
var csvToJsonDataBase = csv({objectMode: true,delimiter: ',' });// comma, semicolon, whatever

var parser = new Transform({objectMode: true, delimiter: ';'});
parser._transform = function(data, encoding, done) {
	
	/*------
	 * ID_CLL
	 * ID_STR_PNT
	 * ID_UTL_RSP
	 * ID_TYP_MDE_AFC
	 * ID_ADR_TEL_1
	 * ID_ADR_TEL_2
	 * NO_PST_TEL
	 * LB_CLL
	 * BL_REV_CRB_GRP
	 * QI_MAJ
	 * TS_MAJ
	 */
	if (data[0] !== "" && data[7] !== "LB_CLL" ) {
		
		lbCellule_idCellule.set(data[7].trim(),data[0]);	
		
	}
	
	
  done();
};


//fichierSourceCSV
//.pipe(csvToJson)
requeteDataBaseSource
.pipe(csvToJsonDataBase)
.pipe(parser, { end: false });

//csvToJson.on("end",function(){
//	console.log(lbCellule_idCellule);
//});


exports.lbCellule_idCellule = lbCellule_idCellule

