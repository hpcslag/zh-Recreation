var fs = require('fs'),
	multer = require('multer'),
  mongojs = require('mongojs'),
  o = mongojs('Only',['table']),//個人會員表
  re = mongojs('Recommended',['table']),//邀請人表
  enc = mongojs('encrypt',['table']),//邀請碼資料庫
  mail = require('./mailer.js'),
  md5 = require('../library/encrypt.js'),
  yaml = require('js-yaml'),
  fs   = require('fs');

// Get document, or throw exception on error
try {
  var doc = yaml.safeLoad(fs.readFileSync('./i18n/string.yml', 'utf8'));
  var ip_addr = doc.host;
} catch (e) {
  console.log("namagement_ind.js yaml parse error!");
    process.exit();
}; 

exports.upload = multer({ 
	dest: './public/ind',
  	onFileUploadStart: function (file, req, res) {
  		if (file.mimetype !== 'image/png' && file.mimetype !== 'image/jpg' && file.mimetype !== 'image/jpeg'){
  			res.render('Finish',{message:"檔案不符合副檔名不可以上傳"});
  			return false;
  		}else{
  			return true;
  		}
  	},
});

function search(arr,name){
  for(var i = 0;i<=arr.length;i++){
    if(arr[i].name == name){
      return true;
    }
  }
  return false;
}

function re_db_search (r1,r2,cb){
  var r1_name = r1.name,
    r1_email = r1.email,
    r2_name = r2.name,
    r2_email = r2.email;
  if(r1_email == r2_email){ //如果重複，就回傳錯誤
    cb(false);
  }else{
    var find = false;
     re.table.find(function(err,doc){
      if(err) cb(false);
      else{
        for(var i=0;i<doc.length;i++){
          if(find){
            break;
          }
          if(doc[i].name == r1_name && doc[i].email == r1_email){
            //console.log("找到第一個，開始尋找第二個");
            for(var j=0;j<doc.length;j++){
              if(doc[j].name == r2_name && doc[j].email == r2_email){
                //console.log("兩個都匹配");
                find = true;
                cb(true);
                break;
              }
              if((doc[j].name != r2_name || doc[j].email != r2_email) && j == doc.length-1){
                //console.log("一個找到，最後一個不匹配");
                cb(false);
                break;
              }
            }
          }
          if((doc[i].name != r1_name || doc[i].email != r1_email) && i == doc.length-1){
            //console.log("一個也沒找到");
            cb(false);
          }
        }
      }
    }); 
  }
}

exports.handle = function(req,res){
  try{
    var TABLE = {
      name : req.body.form__char1,//姓名
      sex : req.body.form__char2, //性別
      birthday: req.body.form__char3, //出生年月日
      place : req.body.form__char4, //出生地
      email : req.body.form__char16, //電子信箱
      edu : req.body.form__char5,//畢業學校
      exp : req.body.form__text1,//經歷
      job : req.body.form__char7,//職業
      address_public : req.body.form__char8,//地址公用
      phone_public : req.body.form__char18,//電話公用
      fax_public : req.body.form__char19, //傳真公用
      address : req.body.form__char20,//地址私用
      phone : req.body.form__char21,//電話私人
      fax : req.body.form__char22,//傳真私人
      contact : req.body.form__char23, //聯絡方式
      specialty : req.body.form__char9,//專長
      interest : req.body.form__char10,//興趣
      invite : {
        invite_one_name : req.body.form__char12, //第一位邀請人姓名
        invite_two_name : req.body.form__char13, //第二位邀請人姓名
        invite_one_email : req.body.form__char14, //第一位邀請人電子郵件
        invite_two_email : req.body.form__char15, //第二位邀請人電子郵件
        invite_one_status : false, //第一位邀請人確認狀況
        invite_two_status : false //第二位邀請人確認狀況
      },
      payway : req.body.form__char17,
      agree : req.body.form__char11 == "我同意下列會員條款",
      proof_payment : req.files.form__file1.path //繳費證明位置
    }
  }catch(e){
    console.log('File early not upload!')
  }
  
  //設定有那些沒有填入，就會返回失敗
  if(TABLE.agree &&　req.files.form__file1.size < (32*1000*1000)){
  	//正在檢查資料庫中是否有可用推薦人
    re_db_search({name:TABLE.invite.invite_one_name,email:TABLE.invite.invite_one_email},{name:TABLE.invite.invite_two_name,email:TABLE.invite.invite_two_email},function(status){
      if(status){
      //有推薦人了，檢查是否是重複的項目(以姓名為準)
      o.table.findOne({query:{name:TABLE.name}},function(err,doc){
        if(!err){
          //沒有錯誤
          if(!!doc == false){
            //尚未被註冊
            o.table.insert(TABLE);
            sendLink(TABLE.name,TABLE.email,TABLE.invite.invite_one_email,TABLE.invite.invite_two_email); //送邀請函
            res.render('Finish',{message:"感謝您的填寫，請等候推薦人的確認! 您可以至管理後台查看狀態"});//到ejs接收 boolean
          }else{
            //已經註冊過了
            try{
              fs.unlinkSync(req.files.form__file1.path);
            }catch(e){
              console.log('File early not upload!')
            }
            res.render('Finish',{message:"您已經填寫過這樣的表單了!"});
          }
        }else{
          //發生錯誤
          try{
            fs.unlinkSync(req.files.form__file1.path);
          }catch(e){
            console.log('File early not upload!')
          }
          res.render('Finish',{message:"資料發生錯誤，請再重新嘗試!"});
        }
      });
    }else{
      //沒有推薦人存在
      try{
          fs.unlinkSync(req.files.form__file1.path);
      }catch(e){
        console.log('File early not upload!')
      }
      res.render('Finish',{message:"這個推薦人不存在，請使用其他推薦人!",status:false});
    }
    });
  }else{
    try{
      fs.unlinkSync(req.files.form__file1.path);
    }catch(e){
      console.log('File early not upload!')
    }
    res.render('Finish',{message:"您沒有同意服務條款! 亦或是必填項目"});
  }
}
//res.status(204).end();


function sendLink(me,myemail,people1,people2){
  //即使沒有功能，後台還是可以讓管理員確認狀況
  //Node mail 功能
  //產生邀請碼
  //開啟邀請碼資料庫對應
  //HTML Template 功能!

  //流程: 資料庫開一個link2people 的 table, 放入產生的link和對應的'申請人' (要對應是第幾位邀請人)
  // {link:"123456","request":"申請人",invite_num:1} <- 這位申請人的 invite.invite_one_status
  var people1_md5 = md5(people1);
  var people2_md5 = md5(people2);
  //md5作為id加入資料庫
  enc.table.insert([{link:people1_md5,request:me,invite_num:1},{link:people2_md5,request:me,invite_num:2}]);
  //產生link
  var link1 = ip_addr+'/invite/'+people1_md5;
  var link2 = ip_addr+'/invite/'+people2_md5;
  mail(me,myemail,link1,link2,people1,people2);
}