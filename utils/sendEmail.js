const nodemailer = require("nodemailer");



const sendEmail=(email, subject, text)=>{
	console.log("sendEmail");
	let mailTransporter = nodemailer.createTransport({
		service: "gmail",
		auth: {
		  user: process.env.EMAIL,
		  pass: process.env.PASS,
		},
	  });
	  console.log(process.env.USER);
	  console.log(process.env.PASS);
	let mailDetails = {
		from: "divyaba281103@gmail.com",
		to: email,
		subject: subject,
	  };
	if (text) {
		mailDetails.text = text;
	  }
	
	  mailTransporter.sendMail(mailDetails, function (err, data) {
		if (err) {
		  console.log("Error Occurs" + err);
		} else {
		  console.log("Email sent successfully");
		}
	  });
}
module.exports={sendEmail};