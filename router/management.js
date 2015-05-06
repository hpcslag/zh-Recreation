var yaml = require('js-yaml'),
	fs   = require('fs'),
	md5 = require('../library/encrypt.js'),
	cexp = require('../library/xls-exports.js'),
	multer = require('multer'),
	path = require('path'),
	mongojs = require('mongojs'),
	O = mongojs('Only',['table']),
	G = mongojs('Group',['table']),
	imports = require('../library/xls-imports.js');

// Get document, or throw exception on error
try {
  var doc = yaml.safeLoad(fs.readFileSync('./i18n/string.yml', 'utf8'));
  var admin = doc.user;
} catch (e) {
	console.log("Management.js yaml parse error!");
  	process.exit();
}

//匯入檔案
exports.upload = multer({ dest: './public/import' });

exports.index = function(req,res){
	res.render('admin-index');
};

//確認有無登入
exports.checkLogin = function(req,res,next){
	if(!!req.session.imadmin){
		next();
	}else{
		res.redirect('/admin/login')
	}
};


function login(username,password){
	for(var i =0;i<admin.length;i++){
		if(admin[i].username == username && admin[i].password == password){
			return true;
		}
	}
	return false;
}

//登入auth
exports.auth = function(req,res){
	if(!!req.session.imadmin){
		res.redirect('/admin');
	}else{
		var username = req.body.username,
			password = md5(req.body.password);
		if(login(username,password)){
			req.session.imadmin = true;
			res.redirect("/admin");
		}else{
			res.redirect('login?error=1')
		}
	}	
};

//登入 login
exports.login = function(req,res){
	if(!!req.session.imadmin){
		res.redirect('/admin');
	}else{
		res.render('admin-login',{ csrfToken: req.csrfToken() });
	}	
};

//登出 logout
exports.logout = function(req,res){
	if(!!req.session.imadmin){
		req.session.imadmin = null;
		res.redirect('/admin/login');
	}else{
		res.redirect('/admin/login');
	}
};

//訪問system, 可以匯出 個人會員資料, 團體會員資料.
exports.user_data = function(req,res){
	csv = cexp();
	var who = req.param('who');
	//先確定有雙方同意才可以確認
	if(who == "Only"){
		csv.setField(['name','sex','birthday','place','email','edu','exp','job','address_public','phone_public','fax_public','address','phone','fax','contact','specialty','interest','payway','proof_payment']);
		O.table.find(function(err,doc){
			//跑回圈把可用的匯出去
			csv.output(doc,path.join(__dirname,'../public/csv/Only.csv'));
			res.redirect('/public/csv/Only.csv');
		});
	}else{
		csv.setField(['name','services','people','address','phone','fax','email','payway','proof_payment','group_seal','charge_seal']);
		G.table.find(function(err,doc){
			csv.output_group(doc,path.join(__dirname,'../public/csv/Group.csv'));
			res.redirect('/public/csv/Group.csv');
		});
	}
}
//修改同意資料 (檔案式儲存) ("沒有"分團體、個人)

//匯入檔案
exports.imports_front = function(req,res){
	var who = req.param('who'),
		v = '';
	if(who == "Only"){
		v = 'Only';
	}else{
		v = 'Group';
	}
	res.render('admin-import',{who:v});
}
exports.imports_Only = function(req,res){
	//post
	var Import = imports();
	Import.Import(req.files.fileToUpload.path,function(err,status){
		if(err){
			console.log("資料有誤");
			console.log(status);
			try{
				fs.unlinkSync(req.files.fileToUpload.path);
			}catch(e){
			}
			res.render('Finish',{message:"匯入的資料發生異常，請注意匯入手冊中的資料規範"});
		}else{
			console.log("匯入完成");
			//匯入成功後刪除
			try{
				fs.unlinkSync(req.files.fileToUpload.path);
				res.redirect('/admin/ind');
			}catch(e){
			}
		}
	});
};
exports.imports_Group = function(req,res){
		//post
	var Import = imports();
	Import.Import_group(req.files.fileToUpload.path,function(err,status){
		if(err){
			console.log("資料有誤");
			console.log(status);
			try{
				fs.unlinkSync(req.files.fileToUpload.path);
			}catch(e){
			}
			res.render('Finish',{message:"匯入的資料發生異常，請注意匯入手冊中的資料規範"});
		}else{
			console.log("匯入完成");
			//匯入成功後刪除
			try{
				fs.unlinkSync(req.files.fileToUpload.path);
				res.redirect('/admin/Group');
			}catch(e){
			}
		}
	});
};
exports.select = function(req,res){
	res.render('admin-system');
}