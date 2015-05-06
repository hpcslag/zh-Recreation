var mongojs = require('mongojs'),
	o = mongojs('Only',['table']),
	mail = require('./mail_ind.js');

function getData(name,cb){
	o.table.findOne({name:name},function(err,doc){
		if(!!doc){ //can login
			cb(doc);
		}else{ //can't login
			req.session.logined = null;
			req.session.uid = null;
			res.redirect('i_login?error=2');
		}
	});
}

exports.index = function(req,res){
	getData(req.session.uid,function(doc){
		res.render('modify_ind',{message:"熱烈歡迎你登入! ",name:req.session.uid,data:doc});
	});
};

exports.checkLogin = function(req,res,next){
	if(!!req.session.logined && !!req.session.uid){ //islogined?
		next();
	}else{
		res.redirect('i_login');
	}
};

exports.log_auth = function(req,res){
	var birth = req.body.birthday,
		email = req.body.email;

	o.table.findOne({birthday:birth,email:email},function(err,doc){
		if(!!doc){ //can login
			req.session.uid = doc.name;
			req.session.logined = true;
			res.redirect('modify_ind');
		}else{ //can't login
			res.redirect('i_login?error=1');
		}
	});
};

exports.login = function(req,res){
	if(!!req.session.logined && !!req.session.uid){
		res.redirect('modify_ind');
	}else{
		res.render("login")
	}
};

exports.logout = function(req,res){
	if(!!req.session.logined){
		req.session.logined = null;
		req.session.uid = null;
		res.redirect('i_login');
	}else{
		res.redirect('i_login');
	}
};

exports.modify_data = function(req,res){
	//This is post method
	getData(req.session.uid,function(doc){
		var TABLE = doc;
		if(req.body.email != TABLE.email){
			var mailOptions1 = {
		        from: '中華民國戶外遊憩學會 <cacheservs@gmail.com>', // sender address
		        to: TABLE.email, // list of receivers
		        subject: '電子郵件修改通知', // Subject line
		        text: 'Invite Request', // plaintext body
		        html: '<p style="font-family:Microsoft JhengHei,LiHei Pro,Helvetica,Open sans;">親愛的會員您好，您於 '+ new Date() +' 修改了您的電子郵件 ('+req.body.email+') ，請注意如果這不是您的電子郵件，這代表您可能被非法人士入侵，請盡速聯絡本會或進行修改!' // html body
		    };
			mail.sendEmail(mailOptions1);
		}
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
		o.table.update({name:req.session.uid},TABLE);
		res.redirect('/modify_ind');
	});
};