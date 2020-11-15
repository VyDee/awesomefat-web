//first run source ./.env
//run nodemon sendgrid.js
require('dotenv').config()
const apiKey = process.env.SENDGRID_API_KEY;
const Sendgrid = require('sendgrid')(apiKey)

const express = require('express');
const bodyParser = require('body-parser');
const app = express();
var cors = require('cors');

const senderEmail = 'veedee.2509@gmail.com';

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
  const requestContent = req.body;

  switch(templateName) {
    case "user-contact-us":
      //send contact-us copy email to customer
      request.body = customerContactRequestPersonalization(requestContent);
      break;
    case "owner-contact-us":
      //send contact-us email to owner
      request.body = ownerContactRequestPersonalization(requestContent);
      break;
    case "sign-up":
      request.body = signUpPersonalization(requestContent);
      break
    case "booking-time-update":
      request.body = bookingInfoUpdatePersonalization(requestContent);
      break
  }

  console.log(request);
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
            to: [{ email: `${request.userEmail}` }],
            dynamic_template_data: {
              name: `${request.firstName}, ${request.lastName}`,
              companyName:`${request.companyName}`,
              email: `${request.userEmail}`,
              service: `${request.service}`,
              message: `${request.userMessage}`
            },
        }
    ],
      "from": { email: senderEmail },
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
            dynamic_template_data: {
              name: `${request.firstName}, ${request.lastName}`,
              companyName:`${request.companyName}`,
              email: `${request.userEmail}`,
              service: `${request.service}`,
              message: `${request.userMessage}`
            },
        }
    ],
      "from": { email: senderEmail },
  }
  return contactBody;
}

function signUpPersonalization(request) {
  const contactBody = {
    template_id:'d-c3d0e8a8467645759d03d7e5a778dd0b',
    personalizations: [
        {
            to: [{ email: `${request.userEmail}` }],
            dynamic_template_data: {
              name: `${request.firstName} ${request.lastName}`,
            },
        }
    ],
      "from": { email: senderEmail },
  }
  return contactBody;
}

function bookingInfoUpdatePersonalization(request) {
  const contactBody = {
    template_id:'d-9f1614396d7b496da8420a649f53ae45',
    personalizations: [
        {
            to: [{ email: `${request.userEmail}` }],
            dynamic_template_data: {
              name: `${request.name}`,
              service: `${request.service}`,
              meetingTime: `${request.meetingTime}`,
              meetingDate: `${request.meetingDate}`,
            },
        }
    ],
      "from": { email: senderEmail },
  }
  return contactBody;
}