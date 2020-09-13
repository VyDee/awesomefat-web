const express = require('express');
const cors = require("cors");
const bodyParser = require('body-parser');
const nodemailer = require ('nodemailer');

// const details = require("./details.json")

const app = express();
app.use(cors({ origin: "*"}));

//Body Parser Middleware
app.use(bodyParser.json())

app.listen(3000, () => {
  console.log("The server started on port 3000!!!");
})

app.get("/", (req, res) => {
  res.send(
    "<h1 style='text-align: center'>Wellcome to FunOfHeuristic <br><br>😃👻😃👻😃👻😃👻😃</h1>"
  );
});

app.post("/sendmail", (req, res) => {
  console.log("request came");
  // console.log(req)
  let message = req.body;
  console.log("message", message)
  sendMail (message)
})

async function sendMail (senderMessage) {
  console.log(senderMessage)
  const output = `
  <p>You have a new contact request</p>
  <h3>Contact Details</h3>
  <ul>
    <li>Name: ${senderMessage.firstName}, ${senderMessage.lastName}</li>
    <li>Company: ${senderMessage.companyName}</li>
    <li>Email: ${senderMessage.userEmail}</li>
    <li>Service: ${senderMessage.service}</li>
  </ul>
  <h3>Message</h3>
  <p>${senderMessage.userMessage}</p>
  `;
  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: 'veedee.2509@gmail.com', // generated ethereal user
        pass: 'zddyvdoveebzimgv'  // generated ethereal password
    },
    tls:{
      rejectUnauthorized:false
    }
  });

    // setup email data with unicode symbols
  let mailOptions = {
    from: '"Nodemailer Sender Contact Submit" ${senderMessage.userEmail}', // sender address
    to: 'vy.duong@cuw.edu', // list of receivers
    subject: 'Node Contact Request', // Subject line
    text: 'Hello world?', // plain text body
    html: output // html body
  };

   let info = transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        return console.log(error);
    }
    console.log('Message sent: %s', info.messageId);   
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
  });
}
