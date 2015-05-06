var mongojs = require('mongojs'),
	g = mongojs('Group',['table']),
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

//顯示首頁項目
exports.index = function(req,res){
	//總頁數
	//本頁是第幾頁
	//本頁數量的內容(陣列)
	var page_id = req.param('id'); //本頁
	var max_count = page.max; //一頁顯示幾個
	var skip = page_id == 0 ? 0 : page_id * max_count; //本頁起始點
	
	g.table.find().count(function(err,max_page){//有多少資料
		var total_page = (max_page % max_count != 0)? Math.floor(max_page/max_count) : Math.floor(max_page/max_count)-1;//計算成頁面數量
		//如果沒有頁數了
		if(page_id > total_page){
			res.send("已經沒有資料可以訪問了");
		}else{
			g.table.find().limit(max_count).skip(skip,function(err,doc){
				res.render('admin-group',{data:doc,page:{this_page:page_id,total_page:total_page}});
			});
		}
	});
};

//顯示單一條目
exports.modify = function(req,res){
	var pc = req.param('name');
	var name = punycode.decode(pc);

	g.table.findOne({name:name},function(err,doc){
		if(err || doc == null){
			res.send('找不到使用者');
		}else{
			res.render('admin-group-modify',{data:doc});//顯示id
		}
	});
};

//接收單一項目修改
exports.post_modify = function(req,res){
	g.table.findOne({_id:mongojs.ObjectId(req.body._id)},function(err,doc){
		var TABLE = doc;
		TABLE.name = req.body._name;
		TABLE.people = req.body.people;
		TABLE.services = req.body.services;
		TABLE.address = req.body.address;
		TABLE.phone = req.body.phone;
		TABLE.fax = req.body.fax;
		TABLE.email = req.body.email;
		g.table.update({_id:mongojs.ObjectId(req.body._id)},TABLE);
		var usl = punycode.encode(TABLE.name);
		res.redirect(url.resolve('../',usl));//修改完後回去
	});
};

//直接完成邀請
exports.responses = function(req,res){
	var name = req.param('name');
	g.table.findAndModify({
	    query: { name: name },
	    update: { $set: { 'status' : true } },
	    new: true
	}, function(err, doc, lastErrorObject) {
		var puny = punycode.encode(name);
		res.redirect('../'+puny);//待修改
	});
};

//search 中文 to punycode and go to 會員資料
exports.pc2se = function(req,res){
	var query = req.body.search;
	var puny = punycode.encode(query);
	res.redirect('/admin/group/name/'+puny);
}

//利用:name轉換punycode 連結
exports.url2se = function(req,res){
	var param = req.param('code');
	var puny = punycode.encode(param);
	res.redirect('/admin/group/name/'+puny);
}