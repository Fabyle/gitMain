// lecture du fichier
var fs= require('fs');
var fichier;

/**------------------------------------------------------------------------------
* Fonction de lecture du catalogue fonctions XML 
------------------------------------------------------------------------------*/
function lit(cb)
	{
	fs.readFile('./data/Catalogue_Fonctions.xml', 'utf8', 
		function(err, data){
		if(err) {
			return console.log (err);
		}		
		var XmlDocument = require('xmldoc').XmlDocument;
		var fonctions = new XmlDocument(data);
		var array_retour = new Array();
		
		
		fonctions.eachChild(function(fonction) {
			var fonctionJSON = new Object();
			fonctionJSON.code = 	fonction.children[0].val.trim();
			fonctionJSON.libelle = 	fonction.children[1].val.trim();		
			
			// pas de libellé court pour cette fonction 
			if ( Object.getOwnPropertyDescriptor(fonction.children[4].attr, "xsi:type") !== undefined){
				fonctionJSON.libelleCourt ="";
				fonctionJSON.espace = fonction.children[5].val.trim();
				indice = 4			
			}
			// présence d'un libellé court
			if ( Object.getOwnPropertyDescriptor(fonction.children[5].attr, "xsi:type") !== undefined){
				fonctionJSON.libelleCourt = fonction.children[2].val.trim();
				fonctionJSON.espace = fonction.children[6].val.trim();
				indice = 5	
			}
			
			// résolution de la technologie et de l'impact		
			fonctionJSON.technologie = Object.getOwnPropertyDescriptor(fonction.children[indice].attr, "xsi:type").value;
			if (fonctionJSON.technologie=="fct:TechnologieWeb"){
				fonctionJSON.impact = "Windows 7-64bits ou IE 11";
			}
			else {
				fonctionJSON.impact = "Windows 7-64bits";
			}
			array_retour.push(fonctionJSON);
			
			})
			//console.log (array_retour);
			cb(array_retour);
			})};

			
// ----------exemple d'usage
//retour = lit(function callback(retour){
//	console.log(retour);
//});

/**------------------------------------------------------------------------------
* Les exports
------------------------------------------------------------------------------*/
exports.lit = lit;

		
		
		
		

	
	




