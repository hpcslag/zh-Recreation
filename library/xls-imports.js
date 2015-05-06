var fs = require('fs'),
	path = require('path'),
	lineReader = require('line-Reader'),
	mongojs = require('mongojs'),
	O = mongojs('Only',['table']),
	G = mongojs('Group',['table']),
	LineByLineReader = require('line-by-line');

function getOut_lr(array){
	var string = array[array.length-1]
	if(string[string.length-1] == '\r'){
		return string.substr(0,string.length-1);
	}else{
		return string;
	}
}

function generate(field,arr){
	var obj = {};
	for(var i = 0;i<field.length;i++){
		obj[field[i]] = arr[i];
		obj['invite'] = {
			invite_one_name : "已由系統指派", //第一位邀請人姓名
	        invite_two_name : "已由系統指派", //第二位邀請人姓名
	        invite_one_email : "NONE", //第一位邀請人電子郵件
	        invite_two_email : "NONE", //第二位邀請人電子郵件
	        invite_one_status : true, //第一位邀請人確認狀況
	        invite_two_status : true //第二位邀請人確認狀況
		}
	}
	return obj;
}

function Import(path,cb){
    lr = new LineByLineReader(path)
    lr.on('error', function (err) {
	    // 'err' contains error object
	    cb(true,"資料發生問題，請重新嘗試")
	});

	var i = 0,
		field = []
		minLength = 0,
		dataBuffer = [], //need to update this
		Nat = false; //Check can update
	lr.on('line', function (line) {
	    // 'line' contains the current line without the trailing newline character.
	    if(i == 0){//流程其一: 完成Field
	    	field = line.split(',');
	    	minLength = field.length;
	    	//console.log("我的資料量: "+field.length);
	    }else{
	    	var objdata = line.split(',');
	    	//console.log("他的資料量:" + objdata.length);
	    	if(objdata.length == minLength){
	    		var pushBuffer = {}; //Object push to dataBuffer
	    		dataBuffer.push(generate(field,objdata));
	    	}else{
	    		Nat = true;//有錯了
	    		cb(true,"欄位錯誤");
	    		
	    	}
	    }
	    i++;
	});

	lr.on('end', function () {
	    // All lines are read, file is closed now.
	    if(Nat == false){
	    	O.table.insert(dataBuffer);
	    }
	    cb(false,"完成寫入");
	});
}

function Import_group(path,cb){
    lr = new LineByLineReader(path)
    lr.on('error', function (err) {
	    // 'err' contains error object
	    cb(true,"資料發生問題，請重新嘗試")
	});

	var i = 0,
		field = []
		minLength = 0,
		dataBuffer = [], //need to update this
		Nat = false; //Check can update
	lr.on('line', function (line) {
	    // 'line' contains the current line without the trailing newline character.
	    if(i == 0){//流程其一: 完成Field
	    	field = line.split(',');
	    	minLength = field.length;
	    	//console.log("我的資料量: "+field.length);
	    }else{
	    	var objdata = line.split(',');
	    	//console.log("他的資料量:" + objdata.length);
	    	if(objdata.length == minLength){
	    		var pushBuffer = {}; //Object push to dataBuffer
	    		dataBuffer.push(generate(field,objdata));
	    	}else{
	    		Nat = true;//有錯了
	    		cb(true,"欄位錯誤");
	    		
	    	}
	    }
	    i++;
	});

	lr.on('end', function () {
	    // All lines are read, file is closed now.
	    if(Nat == false){
	    	G.table.insert(dataBuffer);
	    	console.log("可以插入了");
	    }
	    cb(false,"完成寫入");
	});
}

module.exports = function(){
	return {
		Import : function(path,cb){ return Import(path,cb); },
		Import_group : function(path,cb){ return Import_group(path,cb);}
	}
};