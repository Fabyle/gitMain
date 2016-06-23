/**
 * http://usejsdoc.org/
 */

function configurationESIC(){
	this.repertoire_configuration = "u:\\esic\\configuration";
	this.log = "c:\logESIC.txt"
};

function configurationVISIOCAP(){
	this.url_ctg = "http://srvctgrec/wspasserellerec/services/ctg";
	this.url_habilitation = "http://WSHABil/v3/wshab.asmx";
	this.log = "c:\visiolog.txt"
};

exports.esic = configurationESIC;
exports.visiocap = configurationVISIOCAP;
