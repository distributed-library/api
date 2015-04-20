var nodemailer = require("nodemailer"), 
    algorithm = 'aes-256-ctr',
    crypto = require('crypto');

var username = process.env.SENDGRID_USERNAME;
var password = process.env.SENDGRID_PASSWORD;
var privateKey = process.env.PRIVATE_PASSPHARSE;

// create reusable transport method (opens pool of SMTP connections)
console.log(Config.email.username+" "+Config.email.password);
var smtpTransport = nodemailer.createTransport("SMTP", {
  service: "SendGrid",
  auth: {
    user: username,
    pass: password
  }
});

exports.decrypt = function(password) {
  return decrypt(password);
};
exports.encrypt = function(password) {
  return encrypt(password);
};
exports.sentMailVerificationLink = function(user, token) {
  var emailHost = 'https://distributed-library-api.herokuapp.com/users/confirmation?token=' + token;
  var from = "noreply@gmail.com";
  var mailbody = "<p>Thanks for Registering on api.</p><p>Please verify your email by clicking on the verification link below.<br/><a href="+emailHost+">Verification Link</a></p>";
  mail(from, user.userName , "Account Verification", mailbody);
};
exports.sentMailForgotPassword = function(user) {
  var from = Config.email.accountName+" Team<" + Config.email.username + ">";
  var mailbody = "<p>Your "+Config.email.accountName+" Account Credential</p><p>username : "+user.userName+" , password : "+decrypt(user.password)+"</p>"
  mail(from, user.userName , "Account password", mailbody);
};
// method to decrypt data(password)
function decrypt(password) {
  var decipher = crypto.createDecipher(algorithm, privateKey);
  var dec = decipher.update(password, 'hex', 'utf8');
  dec += decipher.final('utf8');
  return dec;
}
// method to encrypt data(password)
function encrypt(password) {
  var cipher = crypto.createCipher(algorithm, privateKey);
  var crypted = cipher.update(password, 'utf8', 'hex');
  crypted += cipher.final('hex');
  return crypted;
}

function mail(from, email, subject, mailbody){
  var mailOptions = {
    from: from, // sender address
    to: email, // list of receivers
    subject: subject, // Subject line
    //text: result.price, // plaintext body
    html: mailbody // html body
  };

  smtpTransport.sendMail(mailOptions, function(error, response) {
    if (error) {
      console.error(error);
    }
    smtpTransport.close(); // shut down the connection pool, no more messages
  });
}