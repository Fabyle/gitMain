/**
 * http://usejsdoc.org/
 */
XLSX = require("xlsx");

/**------------------------------------------------------------------------------
* Fonction qui lit un fichier excel et qui en restitue un JSON 
* l'objet retourner est de la forme liste de 
* { feuille, cellule, colonne, ligne,  valeur } 
------------------------------------------------------------------------------*/
var excelToObject = function(file_name, callback){
	
	// creation du résultat contenant le nom de la feuille, le label de la cellule, et la valeur
	var liste_feuille_cellule_valeur = new Array;
	
	
	// creation de l'objet workbook
	var workbook = XLSX.readFile(file_name);
	
	// liste des feuilles
	var sheet_name_list = workbook.SheetNames;
	//console.log (sheet_name_list);
	
	sheet_name_list.forEach( function(sheet_name){
		var worksheet = workbook.Sheets[sheet_name];
		//console.log (worksheet);
		
		// l'instruction for in permet d'itérer sur les propriétés enumérables d'un objet
		for ( property in worksheet ){
			// all keys that do not begin "!" correspond to cell adress 
			if ( property[0] === "!") continue;
			//console.log(sheet_name+" "+property+" "+JSON.stringify(worksheet[property].v))
			var feuille_cellule_valeur= new Object;
			feuille_cellule_valeur.feuille = sheet_name;
			feuille_cellule_valeur.cellule = property;
			feuille_cellule_valeur.colonne = property.replace(/[0-9]+/g,'');
			feuille_cellule_valeur.ligne = property.replace(/[A-Z]+/g,'');
			feuille_cellule_valeur.valeur = worksheet[property].v;
			liste_feuille_cellule_valeur.push(feuille_cellule_valeur);
		}
		
	})
	callback(liste_feuille_cellule_valeur);	
}

/**------------------------------------------------------------------------------
* Fonction qui lit un fichier excel et qui en restitue un JSON 
* les objets renvoyer représente des lignes 
* ------------------------------------------------------------------------------*/
var excelLinesToObject = function(file_name, callback){
	
	excelToObject(file_name,function(resultat){
		
		mapResultat = new Map();
		
		resultat.forEach(function(each){
			// on verifie que l'objet est déjà connu. 
			if (mapResultat.has(each.ligne)){
				objet = mapResultat.get(each.ligne);				
			}
			else {
				objet = new Object();
				objet.feuille = each.feuille;
				objet.ligne = each.ligne;
				mapResultat.set(each.ligne, objet);
			}
			objet[each.colonne]=each.valeur;
			
		})
		//console.log(mapResultat);
		callback(mapResultat);
	});
	
};

/**------------------------------------------------------------------------------
* NE FONCTIONNE QUE SI ON A UN EXCEL MONO FEUILLE. 
* 
* permet d'obtenir un objet par ligne.
* Les attributs de l'objet sont les titres des colonnes. 
* 
* 
* excelLinesToObject("../data/validationMOA.xlsx",function(mapResultat){
	extractTitleLine(mapResultat);
});
* ------------------------------------------------------------------------------*/
var extractTitleLine = function(mapResultatBefore, callback){
	titres = mapResultat.get('1');
	var mapResultatAfter = new Map();
	
	mapResultat.forEach(function(each){		
		if (each !== titres) {
			// on repose un nouvel objet dans la nouvelle mapResultat		
			if (mapResultatAfter.has(each.ligne)){
				nouvelObjet = mapResultatAfter.get(each.ligne);				
			}
			else {
				nouvelObjet = new Object();
				mapResultatAfter.set(each.ligne, nouvelObjet);
			}
			for (colonne in each){
				// retrait des blancs
				if (titres[colonne] !== undefined && 
						colonne !== "feuille" &&
						colonne !== "ligne"){
					var nouvelle_variable = titres[colonne].trim();
					nouvelle_variable = nouvelle_variable.replace(/[\u00E9]/g,'e');
					nouvelle_variable = nouvelle_variable.replace(/[^a-zA-Z0-9]/g,'_');				
					nouvelObjet[nouvelle_variable] = each[colonne] ;
				}
			}
				
			//console.log(nouvelObjet);
			
			
		}})
		callback(mapResultatAfter.values());
	};
	
/**------------------------------------------------------------------------------
* NE FONCTIONNE QUE SI ON A UN EXCEL MONO FEUILLE. 
* Fonction qui lit un fichier excel et qui en restitue une liste d'objet 
* dont les attributs sont les colonnes titres du document excel 
*
* ------------------------------------------------------------------------------*/
var excelLinesToObjectBasedOnTitle = function( filename, callback){
	
	excelLinesToObject(filename,function(mapResultatBefore){
		extractTitleLine(mapResultatBefore, callback);
	});
};

/**------------------------------------------------------------------------------
* Code de test
------------------------------------------------------------------------------*/
//excelToObject("../data/validationMOA.xlsx",function(resultat){
//	console.log(resultat);
//});

//excelLinesToObject("../data/validationMOA.xlsx",function(mapResultat){
//	extractTitleLine(mapResultat);
//});

//excelLinesToObjectBasedOnTitle("../data/validationMOA.xlsx",function(resultat){
//	console.log(resultat);
//});

/**------------------------------------------------------------------------------
* Les exports
------------------------------------------------------------------------------*/
exports.excelLinesToObjectBasedOnTitle = excelLinesToObjectBasedOnTitle;
