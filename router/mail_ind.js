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
}


// create reusable transporter object using SMTP transport
var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: mail.mail,
        pass: mail.password
    }
});

exports.sendEmail = function(mailOptions){
    transporter.sendMail(mailOptions, function(error, info){
        if(error){
            console.log(error);
        }else{
            //console.log('Message sent: ' + info.response);
        }
    });
}