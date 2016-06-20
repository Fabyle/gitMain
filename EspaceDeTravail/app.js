/*------------------------------
 Fichier JS principal		
 démarrage du serveur			
------------------------------*/

var 
	express = require("express"),
	bodyParser = require("body-parser");

var monApplication = express();

// paramètrage de l'application
monApplication.use(bodyParser.json());
monApplication.use(bodyParser.urlencoded( { extended: true }));


// creation de la route
var routes = require("./my_modules/routes/routes.js")(monApplication);

// lancement du serveur sur l'application
var server = monApplication.listen(3000, 
		function(){
			console.log("Listening on port %s...", server.address().port)
})



