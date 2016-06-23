/**
 * http://usejsdoc.org/
 * permet de gerer l'historique d'usage
 */

var ArrayList = require('ArrayList');

var historique = new ArrayList(); 

function creer_evenement(req){
	this.path = req.path;
	this.query = req.query;
	this.time_stamp = (new Date()).toLocaleString();
}


function ajouter_une_action(req){
	evenement = new creer_evenement(req);
	console.log(evenement);
	historique.add(evenement);	
}

exports.ajouter_une_action = ajouter_une_action;