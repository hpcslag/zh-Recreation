//Please run first!
var mongojs = require('mongojs')

//////////////////////// 個人會員
var o = mongojs('Only',['table']);
//o.table.insert({name:"MacTaylor"})
/*o.table.find(function(err,doc){
	console.log(doc);
})*/

//////////////////////// 團體會員
var g = mongojs('Group',['table']);
/*g.table.find(function(err,doc){
	console.log(doc)
})*/

//////////////////////// 核准邀請人
var re = mongojs('Recommended',['table']);
//re.table.insert({'name':"Ted Onmewy",'email':'koffugee@gmail.com'});
/*re.table.findOne({query:{'name':"Ted Onmewy"}},function(err,doc){
	console.log(doc)
})*/

/*
function re_db_search (r1,r2,cb){
	var r1_name = r1.name,
		r1_email = r1.email,
		r2_name = r2.name,
		r2_email = r2.email;

	re.table.find(function(err,doc){
		if(err) cb(false);
		else{
			for(var i=0;i<doc.length;i++){
				if(doc[i].name == r1_name && doc[i].email == r1_email){
					console.log("找到第一個，開始尋找第二個");
					for(var j=0;j<doc.length;j++){
						if(doc[j].name == r2_name && doc[j].email == r2_email){
							console.log("兩個都匹配");
							cb(true);
							break;
						}
						if((doc[j].name != r2_name || doc[j].email != r2_email) && j == doc.length-1){
							console.log("一個找到，最後一個不匹配");
							break;
							cb(false);
						}
					}
				}
				if((doc[i].name != r1_name || doc[i].email != r1_email) && i == doc.length-1){
					console.log("一個也沒找到");
					cb(false);
				}
			}
		}
	});
}

re_db_search({name:"Ted Onmewy",email:"koffugee@gmail.com"},{name:"Danny Yang",email:"Seacg@gmail.com"},function(status){
	console.log(status);
});*/

//////////////////////// 核准碼資料庫
var enc = mongojs('encrypt',['table']);
/*enc.table.insert([{link:"test",request:"me",invite_num:1},{link:"test2",request:"me",invite_num:2}]);
enc.table.find(function(err,doc){
	console.log(doc)
	enc.close()
})*/

//////////////////////// 申請人登入
/*var o = mongojs('Only',['table']);
o.table.findOne({birthday:"2015-1-1",email:"123456@gmail.com"},function(err,doc){
	if(!!doc){ //can login
		console.log("可以登入")
	}else{ //can't login
		console.log("沒有找到資料")
	}
})*/

//////////////////////// 管理員登入

//分頁功能
var o = mongojs('Only',['table']);
o.table.find().limit(3).skip(0,function(err,doc){
	console.log(doc);
});
//有多少頁
var max = 0;
o.table.find().count(function(err,max_page){
	max = max_page;
	console.log(max_page);
});