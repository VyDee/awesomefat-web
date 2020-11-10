const nodemailer = require("nodemailer");
const ejs = require("ejs")
const { promises: fs } = require('fs');

/** Start Mail Helper */

class Mail {

  constructor() 
  {
    this.mailer;
    this.SUBJECT = null
    this.FROM = process.env.MAIL_FROM || null;
    this.DATA = null;
    this.TO = null;
    this.CC = null;
    this.BCC = null;
    this.ATTACHMENTS = [];
    this.TEXT = null
  }

  /**
   * 
   * @param {String} subject
   * @returns {Mail}
   */
  subject(subject) {
    this.SUBJECT = subject;
    return this;
  }

  /**
   * 
   * @param {String|Array} from
   * @returns {Mail}
   */
  from(from) 
  {
    this.FROM = from;
    return this;
  }

  /**
   * 
   * @param {String|Array} to
   * @returns {Mail}
   */
  to(to) 
  {
    this.TO = to;
    return this;
  }

  /**
   * 
   * @param {String|Array} cc
   * @returns {Mail}
   */
  cc(cc) 
  {
    this.CC = cc;
    return this;
  }

  /**
   * 
   * @param {String|Array} bcc
   * @returns {Mail}
   */
  bcc(bcc) 
  {
    this.BCC = bcc;
    return this;
  }

  /**
   * 
   * @param {Array} attachments
   * @returns {Mail}
   */
  attachments(attachments) 
  {
    this.ATTACHMENTS = attachments;
    return this;
  }

  /**
   * 
   * @param {String|Array} template
   * @returns {Mail}
   */
  template(template) 
  {
    this.TEMPLATE = template;
    return this;
  }


  /**
   * 
   * @param {String} text
   * @returns {Mail}
   */
  text(text) 
  {
    this.TEXT = text;
    return this;
  }

  /**
   * 
   * @param {Object} data
   * @returns {Mail}
   */
  data(data) 
  {
    this.DATA = data;
    return this;
  }


  validate()
  {
    if(!this.SUBJECT)
    {
      throw new Error("Subject Required!")
    }

    if(!this.FROM)
    {
      throw new Error("From Address Required!")
    }

    if(!this.TO)
    {
      throw new Error("TO Address Required!")
    }

    if(!this.TEMPLATE)
    {
      throw new Error("Path to Template File Required!")
    }
  }

  /**
   * 
   * @returns {Nodemailer Promise}
   */
  async send() 
  {

    this.mailer = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: process.env.MAIL_PORT,
      secure:
        process.env.MAIL_ENCRYPTION === "ssl" ||
        process.env.MAIL_ENCRYPTION === "tls",
      auth: {
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD,
      },
    });

    this.validate();

    const htmlStr = await fs.readFile(this.TEMPLATE,
      'utf8'
    );
    const html = ejs.render(htmlStr, this.DATA);

    const mailOptions = {
      from: `"${process.env.APP_NAME}" <${this.FROM}>`,
      to: this.TO,
      subject: this.SUBJECT,
      cc: this.CC,
      bcc: this.BCC,
      attachments: this.ATTACHMENTS,
      text: this.TEXT,
      html: html,
    };
    return this.mailer.sendMail(mailOptions);
  }
}

/** End Mail Helper */

module.exports = Mail;
