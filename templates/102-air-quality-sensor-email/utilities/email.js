'use strict';

exports = module.exports = function(options) {
    var nodemailer = require('nodemailer');
    var smtpapi    = require('smtpapi');

    // Build the smtpapi header
    var header = new smtpapi();

    if (options.to === 'object') {
        header.setTos(options.to);
    } else {
        header.addTo(options.to);
    }

    // Add the smtpapi header to the general headers
    var headers    = { 'x-smtpapi': header.jsonString() };

    // Use nodemailer to send the email
    var settings  = {
      host: options.credentials.host,
      port: parseInt(587, 10),
      requiresAuth: true,
      auth: {
        user: options.credentials.user,
        pass: options.credentials.password
      }
    };

    var smtpTransport = nodemailer.createTransport(settings);

    var mailOptions = {
      from:     options.from,
      to:       options.to,
      subject:  options.subject,
      text:     options.text,
      headers:  headers
    };

    smtpTransport.sendMail(mailOptions, function(error, response) {
      smtpTransport.close();

      if (error) {
        options.error('Email failed to send. ' + error);
        return;
      } else {
        options.success(response);
        return;
      }
    });
};
