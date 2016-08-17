/**
 * http://usejsdoc.org/
 */
XLSX = require("xlsx");

var workbook = XLSX.readFile("./data/validationMOA.xlsx");
var first_sheet_name = workbook.SheetNames[0];
var adress_of_cell ='A1';

var worksheet = workbook.Sheets[first_sheet_name];
//console.log(first_sheet_name);
var desired_cell = worksheet[adress_of_cell];
console.log(worksheet);
//console.log(desired_cell);
var desired_value = desired_cell.v;


//desired_cell.v = 'caca';
//XLSX.writeFile(workbook,"out.xlsx");

console.log(desired_value);