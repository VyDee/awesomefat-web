const apiKey = process.env.SENDGRID_API_KEY;

const Sendgrid = require('sendgrid')(process.env.SENDGRID_API_KEY);
require('dotenv').config()

const express = require('express');
const bodyParser = require('body-parser');
const app = express();
var cors = require('cors');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

app.post('/send-mail', function (req, res) {
  // PUT your send mail logic here, req.body should have your fsubmitted form's values
  let request = Sendgrid.emptyRequest({
    "method": "POST",
    "path": "/v3/mail/send",
    body: {
      template_id:"d-2b31c3de7ee44d1ca3027c5b7d8f5cf7",
      personalizations: [
          {
              to: [{ email: 'vy.duong@cuw.edu' }],
              subject: 'Sendgrid test email from Node.js',
              dynamic_template_data: {
                name:"Vy"
              },
          }
      ],
      from: { email: 'vy.duong@cuw.edu' },
    }
  });
  sendMail(request);
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.send('SEND MAIL');  
})

app.listen(3000, function () {
  console.log('LISTENING on port 3000');
})

function sendMail(request) { 
  // console.log(formData);
  // let request = Sendgrid.emptyRequest({
  //   "method": "POST",
  //   "path": "/v3/mail/send",
  //   body: {
  //     template_id:"d-2b31c3de7ee44d1ca3027c5b7d8f5cf7",
  //     personalizations: [
  //         {
  //             to: [{ email: 'vy.duong@cuw.edu' }],
  //             subject: 'Sendgrid test email from Node.js',
  //             dynamic_template_data: {
  //               name:"Vy"
  //             },
  //         }
  //     ],
  //     from: { email: 'vy.duong@cuw.edu' },
  //   }
  // });

  Sendgrid.API(request, function (error, response) {
    console.log(JSON.stringify(response));
    if (error) {
      console.log('Mail not sent; see error message below.');
    } else {
      console.log('Mail sent successfully!');
    }
    console.log(response);
  });
}