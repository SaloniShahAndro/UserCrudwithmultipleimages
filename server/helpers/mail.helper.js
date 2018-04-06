var path = require('path');
var nodemailer = require('nodemailer');
var EmailTemplate = require('email-templates').EmailTemplate

var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: 'zaptechzapian@gmail.com', // Your email id
      pass: 'zaptech123#' // Your password
    }
});


/**
 * Function will send the mail 
 * 
 * data :
 * {
 *      from : mail-id
 *      to : mail-id
 *      subject : Mail Subject
 *      template : email template name
 *      temp_data : ( JSON ) dynamic data that will be rendered 
 * }
 */
exports.sendMail = (data) => {   
    var templateDir = path.join(__dirname, '../templates/email', data.template)
    var mailTemplate = new EmailTemplate(templateDir);
    return mailTemplate.render(data.temp_data).then(result => {
        var mailOptions = {
            from: 'admin@admin.com', // sender address
            to: data.to ? data.to : 'saloni@zaptechsolutions.com', // list of receivers
            subject: data.subject ? data.subject : 'Welcome Email Usercrud', // Subject line
            html: result.html // You can choose to send an HTML body instead
        };
        return transporter.sendMail(mailOptions);
    }).catch(err => {
        return Promise.reject(err);
    });
}
