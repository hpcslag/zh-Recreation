var imports = require('./xls-imports.js');

var Import = imports();
Import.Import('IND.csv',function(err,status){
	if(err){
		console.log("資料有誤");
		console.log(status);
	} 
	else console.log("匯入完成");
});
/*Import.Import_group('Only.csv',function(err,status){
	if(err){
		console.log("資料有誤");
		console.log(status);
	} 
	else console.log("匯入完成");
});
*/