var nodemailer = require('nodemailer'),
    yaml = require('js-yaml'),
    fs   = require('fs');

// Get document, or throw exception on error
try {
  var doc = yaml.safeLoad(fs.readFileSync('./i18n/string.yml', 'utf8'));
  var mail = doc.email;
} catch (e) {
    console.log("mail_ind.js yaml parse error!\n"+e);
    process.exit();
};

// create reusable transporter object using SMTP transport
var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: mail.mail,
        pass: mail.password
    }
});

function sendEmail(mailOptions){
    transporter.sendMail(mailOptions, function(error, info){
        if(error){
            console.log(error);
        }else{
            //console.log('Message sent: ' + info.response);
        }
    });
}


module.exports = function(me,meemail,link1,link2,people1,people2){
    var mailOptions1 = {
        from: '中華民國戶外遊憩學會 <cacheservs@gmail.com>', // sender address
        to: 'lagbybaha@gmail.com', // list of receivers
        subject: me + ' 邀請您推薦回應信函', // Subject line
        text: 'Invite Request', // plaintext body
        html: '<p style="font-family:Microsoft JhengHei,LiHei Pro,Helvetica,Open sans;">親愛的會員您好，'+me+'邀請您推薦他加入中華民國戶外遊憩學會。 <br>若您有意願回應' +me+'的邀請，勞煩您點擊下方的連結，以回應該申請人的請求，那麼他就會成為中華民國戶外遊憩學會的一份子； <br>若您沒有意願回應'+ me+ '的邀請，那麼請不要點擊下方的連結。 <br> <a href=" '+link1+' " style="color:#1CA5B6;">'+link1+'</a><br><br><br> 本封信件來自中華民國戶外遊憩學會系統信箱，有問題您可以直接回覆本郵件!</p>' // html body
    };
    var mailOptions2 = {
        from: '中華民國戶外遊憩學會 <cacheservs@gmail.com>', // sender address
        to: 'lagbybaha@gmail.com', // list of receivers
        subject: me + ' 邀請您推薦回應信函', // Subject line
        text: 'Invite Request', // plaintext body
        html: '<p style="font-family:Microsoft JhengHei,LiHei Pro,Helvetica,Open sans;">親愛的會員您好，'+me+'邀請您推薦他加入中華民國戶外遊憩學會。 <br>若您有意願回應' +me+'的邀請，勞煩您點擊下方的連結，以回應該申請人的請求，那麼他就會成為中華民國戶外遊憩學會的一份子； <br>若您沒有意願回應'+ me+ '的邀請，那麼請不要點擊下方的連結。 <br> <a href=" '+link2+' " style="color:#1CA5B6;">'+link2+'</a><br><br><br> 本封信件來自中華民國戶外遊憩學會系統信箱，有問題您可以直接回覆本郵件!</p>' // html body
    };
    sendEmail(mailOptions1);
    sendEmail(mailOptions2);
}