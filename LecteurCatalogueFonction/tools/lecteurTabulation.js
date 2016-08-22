/**
 * http://usejsdoc.org/
 */
var fs = require('fs');
var readline = require('readline');

var lireTabulation = function (file_name,callback){
	
	var liste = new Array;

	rl = readline.createInterface({
			//input: fs.createReadStream(file_name),
			input: fs.createReadStream("../notcommit/mail.txt"),
			terminal: false	});
	
	rl.on('line', function(line){
	
		var data = line.split("\t");
		var mail = new Object;
		mail.de = data[0];
		mail.Cc = data[1];
		mail.Cci = data[2];
		// 3 est 
		mail.objet = data[4];
		liste.push(mail);
		//console.log(mail);
	});
	
	rl.on('close',function(){
		console.log(liste);		
		callback(liste);
	})
	
}


exports.lireTabulation = lireTabulation;


