const nodemailer = require("nodemailer");
const moment = require("moment");
const DaysToEnd = 7;
const CredsModel = require("./creds");
const ChangePasswordMessage = require("./changePasswordMessage").changePasswordMessageFunc(DaysToEnd);
const { OTLMessage } = require("./otlMessage");
const UserGmail = 'testNodeMailerViktor@gmail.com';
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: UserGmail,
    pass: 'nodeMailer'
  }
});

function sendNotify(email, title, textHtml) {
  let mailOptions = {
    from: UserGmail,
    to: email,
    subject: title,
    html: textHtml
  }
  transporter.sendMail(mailOptions);
}

CredsModel.find({}).then((result) => {
  result = result.map(cred => cred.toObject());
  for (let credo of result) {
    sendNotify(credo.emailToSubscribe, 'Oracle - скриншоты времени (No reply)', OTLMessage)
  }
  result = result.map((c) => {
    return {
      expire: c.expire,
      email: c.emailToSubscribe
    }
  }).filter((a) => {
    return moment.utc(a.expire).diff(moment.utc(), 'days') <= DaysToEnd;
  });
  if (!!result.length) {
    for (let name of result) {

      sendNotify(name.email, 'Credentials will expires (No reply)', ChangePasswordMessage)
    }
  }
}).catch((err) => console.log(err))




