var fs = require('fs'),
	multer = require('multer'),
	mongojs = require('mongojs'),
	g = mongojs('Group',['table']),
	path = require('path');

exports.upload = multer({ 
	dest: './public/group',
  	onFileUploadStart: function (file, req, res) {
  		if (file.mimetype !== 'image/png' && file.mimetype !== 'image/jpg' && file.mimetype !== 'image/jpeg' && req.files.file.length > (32*1000*1000)){
  			res.render('Finish.ejs',{message:"檔案不符合副檔名不可以上傳"});
  			return false;
  		}else{
  			return true;
  		}
  	},
});

function search(arr,name){
	for(var i = 0;i<= arr.length;i++){
		if(arr[i] == name){
			return true;
		}
	}
	return false;
}

exports.handle = function(req,res){
	try{
		var TABLE = {
		  	name : req.body.form__char4, //團體名稱
		  	services : req.body.form__text1,//業務範圍
		  	people : req.body.form__char6, //負責人
		  	address : req.body.form__char7, //地址
		  	phone : req.body.form__char8, //電話
		  	fax : req.body.form__char9, //傳真
		  	email : req.body.form__char10, //電子郵件
		  	payway : req.body.form__char11, //付款方式,
		  	proof_payment : req.files.form__file1.path, //繳費證明上傳
		  	group_seal : req.files.form__file2.path, //申請團體印鑑
		  	charge_seal :　req.files.form__file3.path, //負責人印鑑
		  	agree_seal : req.body.form__char12 == "我同意下列會員條款", //同意條款
		  	status : false,//確認狀態 (由管理員確認)
		}
	}catch(e){
		console.log('File early not upload')
	}

	//確定資料都有填好!
	if(req.body.form__char12 == "我同意下列會員條款"){//將必填項目判斷至此
	  	g.table.findOne({
			query: { name: req.body.form__char4 }
			},function(err,doc){
				if(!err){
					if(!!doc == false){ //檢查名稱是否重複?
						g.table.insert(TABLE);
  						res.render('Finish.ejs',{message:"感謝您! 您已完成填寫!"})
					}else{
						try{
							fs.unlinkSync(req.files.form__file1.path);
							fs.unlinkSync(req.files.form__file2.path);
							fs.unlinkSync(req.files.form__file3.path);
						}catch(e){
							console.log('File early not upload!');
						}
						res.render('Finish.ejs',{message:"您已經填寫過這樣的表格了!"})
					}
				}else{
					try{
						fs.unlinkSync(req.files.form__file1.path);
						fs.unlinkSync(req.files.form__file2.path);
						fs.unlinkSync(req.files.form__file3.path);
					}catch(e){
						console.log('File early not upload!');
					}
					res.render('Finish.ejs',{message:"資料發生錯誤，請重新嘗試!"})
				}
		});
	}else{
		try{
			fs.unlinkSync(req.files.form__file1.path);
			fs.unlinkSync(req.files.form__file2.path);
			fs.unlinkSync(req.files.form__file3.path);
		}catch(e){
			console.log('File early not upload!')
		}
		res.render('Finish.ejs',{message:"您沒有同意服務條款! 亦或是必填項目"});
	}
}
//res.status(204).end();