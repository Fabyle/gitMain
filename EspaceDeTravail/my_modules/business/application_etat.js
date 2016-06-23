/**
 * http://usejsdoc.org/
 */

var etat_possible = [ "inconnu", "a_demarrer", "demarree", "a arreter", "arretee" ];

function application_etat_inconnu(){
	this.status = "inconnu";
	this.time_stamp = (new Date()).toLocaleString();
}

function set_etat_a_demarrer(){
	this.status = "a_demarrer";
	this.time_stamp = (new Date()).toLocaleString();
}

exports.inconnu = application_etat_inconnu;
exports.a_demarrer = set_etat_a_demarrer;