var mongojs = require('mongojs'),
	o = mongojs('Only',['table']),
	url = require('url'),
	punycode = require('punycode'),
	yaml = require('js-yaml'),
	fs   = require('fs');

// Get document, or throw exception on error
try {
  var doc = yaml.safeLoad(fs.readFileSync('./i18n/string.yml', 'utf8'));
  var page = doc.page;
} catch (e) {
	console.log("namagement_ind.js yaml parse error!");
  	process.exit();
};

exports.index = function(req,res){
	//總頁數
	//本頁是第幾頁
	//本頁數量的內容(陣列)
	var page_id = req.param('id'); //本頁
	var max_count = page.max; //一頁顯示幾個
	var skip = page_id == 0 ? 0 : page_id * max_count; //本頁起始點
	
	o.table.find().count(function(err,max_page){//有多少資料
		var total_page = (max_page % max_count != 0)? Math.floor(max_page/max_count) : Math.floor(max_page/max_count)-1;//計算成頁面數量
		//如果沒有頁數了
		if(page_id > total_page){
			res.send("已經沒有資料可以訪問了");
		}else{
			o.table.find().limit(max_count).skip(skip,function(err,doc){
				res.render('admin-ind',{data:doc,page:{this_page:page_id,total_page:total_page}});
			});
		}
	});
};

//修改對象 (multple) 可批次修改
//不做這個功能

//單一對象修改, 可以重發信件 (顯示)
exports.modify = function(req,res){
	var pc = req.param('name');
	var name = punycode.decode(pc);

	o.table.findOne({name:name},function(err,doc){
		if(err || doc == null){
			res.send('找不到使用者');
		}else{
			res.render('admin-ind-modify',{data:doc});//顯示id
		}
	});
}

//單一對象修改 (接收修改)
exports.post_modify = function(req,res){
	o.table.findOne({_id:mongojs.ObjectId(req.body._id)},function(err,doc){
		var TABLE = doc;
		TABLE.name = req.body._name;
		TABLE.edu = req.body.edu;
		TABLE.exp = req.body.exp;
		TABLE.job = req.body.job;
		TABLE.address_public = req.body.address_public;
		TABLE.phone_public = req.body.phone_public;
		TABLE.fax_public = req.body.fax_public;
		TABLE.address = req.body.address;
		TABLE.phone = req.body.phone;
		TABLE.fax = req.body.fax;
		TABLE.contact = req.body.contact;
		TABLE.specialty = req.body.specialty;
		TABLE.interest = req.body.interest;
		TABLE.email = req.body.email;
		o.table.update({_id:mongojs.ObjectId(req.body._id)},TABLE);
		var usl = punycode.encode(TABLE.name);
		res.redirect(url.resolve('../',usl));//修改完後回去
	});
}

//直接確認邀請
exports.responses = function(req,res){
	var name = req.param('name'),
		number = req.param('number');
	
	if(number == 1){
		o.table.findAndModify({
		    query: { name: name },
		    update: { $set: { 'invite.invite_one_status' : true } },
		    new: true
		}, function(err, doc, lastErrorObject) {
			var puny = punycode.encode(name);
			res.redirect('../../../'+puny);
		});
	}else{
		o.table.findAndModify({
		    query: { name: name },
		    update: { $set: { 'invite.invite_two_status' : true } },
		    new: true
		}, function(err, doc, lastErrorObject) {
			var puny = punycode.encode(name);
			res.redirect('../../../'+puny);
		});
	}
};

//search 中文 to punycode and go to 會員資料
exports.pc2se = function(req,res){
	var query = req.body.search;
	var puny = punycode.encode(query);
	res.redirect('../name/'+puny);
}

//利用:name轉換punycode 連結
exports.url2se = function(req,res){
	var param = req.param('code');
	var puny = punycode.encode(param);
	res.redirect('../name/'+puny);
}