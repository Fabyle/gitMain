/**
 * http://usejsdoc.org/
 */
var fs = require('fs');
var readline = require('readline');

// un petit commentaire

var liste = new Array;

readline.createInterface({
	input: fs.createReadStream("../notcommit/mail.txt"),
	terminal: false
}).on('line', function(line){
	
	
	var data = line.split("\t");
	var objet = new Object;
	objet.de = data[0];
	objet.Cc = data[1];
	objet.Cci = data[2];
	objet.Objet = data[3];
	
	console.log('Line :'+ objet.Cc);
	
	liste.push(objet);
	
});


