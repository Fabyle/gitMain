var fs= require('fs'),
replace = require('replace-in-file')

//on fait une copie du modele star uml
var fichierBaseStarUML = "../3-templateStarUML/basic_withTemplate2.mdj";
var copieFichierBaseStarUML = "./bdorgStarUML.mdj";
fs.createReadStream(fichierBaseStarUML).pipe(fs.createWriteStream(copieFichierBaseStarUML));

/*----------------------------------------*/
var createStarUML = function(stringContenu, template, cb){
	
	replace({
		 
		//Single file 
		files: copieFichierBaseStarUML,
		 
		//Or multiple files 
//		files: [
//		        'path/to/file',
//		        'path/to/other/file',
//		        ],
		 
//		  //Replacement to make (can be string or regex) 
		  replace: template,
		  with: stringContenu
		 
	}, function(error, changedFiles) {
		 
		  //Catch errors 
		  if (error) {
		    return console.error('Error occurred:', error);
		  }
		 
		  //List changed files 
		 //console.log('Modified files:', changedFiles.join(', '));
		 cb();
		});
};

//les exports
exports.createStarUML = createStarUML