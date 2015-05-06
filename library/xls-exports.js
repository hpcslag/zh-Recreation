var fs = require('fs'),
	path = require('path');

function setField(arr){
	var field = arr;
	return arr;
}

function output(field,data_obj,path){
	var csv_f = fs.createWriteStream(path,{flags: 'w', encoding: 'utf-8',mode: 0666}),
	str = '';
	str += "\ufeff";
	for(var i = 0;i<field.length;i++){
		if(i==field.length-1){
			str += (field[i] + '\n');
		}else{
			str += (field[i] + ',');
		}
	}
	for(var i=0;i<data_obj.length;i++){
		//run all data
		if(data_obj[i].invite.invite_one_status && data_obj[i].invite.invite_one_status){
			for(var j=0;j<field.length;j++){
				//run field item
				for(var k=0;k<Object.keys(data_obj[i]).length;k++){
					//put right data in field
					var data = Object.keys(data_obj[i]);
					if(data[k] == field[j]){
						str += '"' + data_obj[i][data[k]] + '"';
						break;
					}
				}
				if(j == field.length-1){
					break;
				}else{
					str += ',';
				}
			}
			if(i == data_obj.length-1){

			}else{
				str += '\n';
			}
		}
	}
	csv_f.write(str);
	csv_f.close();
}

function output_group(field,data_obj,path){
	var csv_f = fs.createWriteStream(path,{flags: 'w', encoding: 'utf-8',mode: 0666}),
	str = '';
	str += "\ufeff";
	for(var i = 0;i<field.length;i++){
		if(i==field.length-1){
			str += (field[i] + '\n');
		}else{
			str += (field[i] + ',');
		}
	}
	for(var i=0;i<data_obj.length;i++){
		//run all data
		if(data_obj[i].status){
			for(var j=0;j<field.length;j++){
			//run field item
				for(var k=0;k<Object.keys(data_obj[i]).length;k++){
					//put right data in field
					var data = Object.keys(data_obj[i]);
					if(data[k] == field[j]){
						str += '"' + data_obj[i][data[k]] + '"';
						break;
					}
				}
				if(j == field.length-1){
					break;
				}else{
					str += ',';
				}
			}
			if(i == data_obj.length-1){

			}else{
				str += '\n';
			}
		}
	}
	csv_f.write(str);
	csv_f.close();
}

module.exports = function(){
	//recheck is user has two invite people response
	var array = [];
	return {
		setField: function(arr){ array = setField(arr);},
		output : function(document,path){ output(array,document,path) },
		output_group: function(document,path){output_group(array,document,path); }
	}
}