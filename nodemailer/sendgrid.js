//first run source ./.env
//run nodemon sendgrid.js
require('dotenv').config()
const apiKey = process.env.SENDGRID_API_KEY;
const Sendgrid = require('sendgrid')(apiKey)

const express = require('express');
const bodyParser = require('body-parser');
const app = express();
var cors = require('cors');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

app.post('/send-mail', function (req, res) {
  let request = Sendgrid.emptyRequest({
    "method": "POST",
    "path": "/v3/mail/send"
  });
  
  const templateName = `${req.body.templateName}`;
  // console.log(templateName);
  switch(templateName) {
    case "contact-us":
      //send copy email to customer
      request.body = customerContactRequestPersonalization(req);
      sendMail(request);
      //send email to owner
      request.body = ownerContactRequestPersonalization(req);
      break;
  }

  sendMail(request);
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.send('SEND MAIL');  
})

app.listen(3000, function () {
  console.log('LISTENING on port 3000');
})

function sendMail(request) { 
  Sendgrid.API(request, function (error, response) {
    // console.log(JSON.stringify(response));
    if (error) {
      console.log('Mail not sent; see error message below.');
    } else {
      console.log('Mail sent successfully!');
    }
    console.log(response);
  });
}

//Different template response

//Contact Us Copy Customer Template
function customerContactRequestPersonalization(request) {
  const contactBody = {
    template_id:'d-534c4f1722fa49b49c9b11c52c7a2006',

    personalizations: [
        {
            to: [{ email: `${request.body.userEmail}` }],
            subject: 'Sendgrid test email from Node.js',
            dynamic_template_data: {
              name: `${request.body.firstName}, ${request.body.lastName}`,
              companyName:`${request.body.companyName}`,
              email: `${request.body.userEmail}`,
              service: `${request.body.service}`,
              message: `${request.body.userMessage}`
            },
        }
    ],
      "from": { email: 'veedee.2509@gmail.com' },
  }
  return contactBody;
}

//Contact Us Owner Template
function ownerContactRequestPersonalization(request) {
  const contactBody = {
    template_id:'d-eeec45afa891494384ea7798f258b5b5',
    personalizations: [
        {
            to: [{ email: 'veedee.2509@gmail.com' }],
            subject: 'Sendgrid test email from Node.js',
            dynamic_template_data: {
              name: `${request.body.firstName}, ${request.body.lastName}`,
              companyName:`${request.body.companyName}`,
              email: `${request.body.userEmail}`,
              service: `${request.body.service}`,
              message: `${request.body.userMessage}`
            },
        }
    ],
      "from": { email: 'veedee.2509@gmail.com' },
  }
  return contactBody;
}