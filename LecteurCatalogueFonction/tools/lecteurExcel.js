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
		
		mapDeFeuille = new Map();		
		
		
		resultat.forEach(function(each){
			
			// on alimente la map de feuille avec des map de ligne. 
			if(mapDeFeuille.has(each.feuille)){
				mapDeLigne = mapDeFeuille.get(each.feuille);
			}
			else {
				mapDeLigne = new Map();
				mapDeFeuille.set(each.feuille, mapDeLigne);
			}
				
			// on verifie que l'objet est déjà connu. 
			if (mapDeLigne.has(each.ligne)){
				objet = mapDeLigne.get(each.ligne);				
			}
			else {
				objet = new Object();
				objet.feuille = each.feuille;
				objet.ligne = each.ligne;
				mapDeLigne.set(each.ligne, objet);
			}
			objet[each.colonne]=each.valeur;
			
		})
		//console.log(mapDeFeuille);
		callback(mapDeFeuille);
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
var extractTitleLine = function(mapDeFeuilles, callback){
	
	//--------------------- cible du stockage du résultat
	//--- un map avec des feuilles, des lignes, et des objets représentant les lignes. 
	var mapDeFeuillesAfter  = new Map();
	
	//--------------------- on balaye la map de feuilles fournit	
	mapDeFeuilles.forEach( function ( feuille, nomFeuille, mapParcourus){
		
		//--------------------- on créer  une page c.a.d une map de ligne  
		if(mapDeFeuillesAfter.has(nomFeuille)){
			map_de_ligne_nouvelle = mapDeFeuillesAfter.get(nomFeuille);
		}
		else {
			map_de_lignes_nouvelle = new Map();
			mapDeFeuillesAfter.set(nomFeuille, map_de_lignes_nouvelle);
		}
		
		//--------------------- on récupère le titre de la page courante
		contenuDeLaFeuille = feuille;
		ligne_de_titre = contenuDeLaFeuille.get('1');
		
		//--------------------- on lit la page courante		
		contenuDeLaFeuille.forEach(function(objet_ligne){
			
			//--------------------- on ne lit que ce qui n'est pas le titre
			if (objet_ligne !== ligne_de_titre) {
				
				
				//--------------------- on construit un nouvel objet que l'on met à la bonne ligne	
				if (map_de_lignes_nouvelle.has(objet_ligne.ligne)){
					nouvelObjet = map_de_lignes_nouvelle.get(objet_ligne.ligne);				
				}
				else {
					nouvelObjet = new Object();
					map_de_lignes_nouvelle.set(objet_ligne.ligne, nouvelObjet);
				}
				
				//--------------------- on explore la ligne source pour construire l'objet cible
				//--------------------- en appliquant les colonnes de titre pour attributs. 
				for (colonne in objet_ligne){
					if (ligne_de_titre[colonne] !== undefined && 
							colonne !== "feuille" &&
							colonne !== "ligne"){
						var nouvelle_variable = ligne_de_titre[colonne].trim();
						nouvelle_variable = nouvelle_variable.replace(/[\u00E9]/g,'e');
						nouvelle_variable = nouvelle_variable.replace(/[^a-zA-Z0-9]/g,'_');				
						nouvelObjet[nouvelle_variable] = objet_ligne[colonne] ;						
					}
				}
				}
		})
		//--------------------- on alimente les feuilles avec la nouvelle feuille créer. 
		mapDeFeuillesAfter.set(nomFeuille,map_de_lignes_nouvelle);
		})	
		
		callback(mapDeFeuillesAfter);
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
//	extractTitleLine(mapResultat,function(mapResultatAfter){
//		console.log(mapResultatAfter);
//	});
//});

excelLinesToObjectBasedOnTitle("../data/validationMOA.xlsx",function(resultat){
	console.log(resultat);
});

/**------------------------------------------------------------------------------
* Les exports
------------------------------------------------------------------------------*/
exports.excelLinesToObjectBasedOnTitle = excelLinesToObjectBasedOnTitle;
