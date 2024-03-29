const dotenv = require('dotenv');
const pug = require('pug');
const nodemailer = require('nodemailer');
const { htmlToText } = require('html-to-text');

dotenv.config({ path: './config.env' });

class Email {
  constructor(emails) {
    this.emails = emails;
    this.from = `Carlos Quintero <${process.env.EMAIL_FROM}>`;
  }

  newTransport() {
    if (process.env.NODE_ENV === 'production') {
      return nodemailer.createTransport({
        service: 'SendGrid',
        auth: {
          user: process.env.SENDGRID_USER,
          pass: process.env.SENDGRID_PASS
        }
      });
    }

    return nodemailer.createTransport({
      host: 'smtp.mailtrap.io',
      port: 2525,
      auth: {
        user: process.env.MAILTRAP_USER,
        pass: process.env.MAILTRAP_PASS
      }
    });
  }

  async send(template, subject, emailData) {
    const html = pug.renderFile(
      `${__dirname}/../emails/${template}.pug`,
      emailData
    );
    await this.newTransport().sendMail({
      from: this.from,
      to: this.emails,
      html,
      text: htmlToText(html),
      subject: subject
    });
  }

  async sendWelcome(name) {
    await this.send('welcome', 'Welcome to Academlo Movies ', { name });
  }

  async sendNewMovie(newMovie, movieActors) {
    await this.send('newMovie', 'we have a new movie for you', {
      newMovie,
      movieActors
    });
  }
}

module.exports = { Email };
