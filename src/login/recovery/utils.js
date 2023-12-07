import express from 'express';
import nodemailer from 'nodemailer';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import winston from 'winston';

import { config } from './config/config.js';

const app = express();

app.use(express.json());

const logger = winston.createLogger({
  level: 'warn',
  transports: [
    new winston.transports.File({
      level: 'warn',
      filename: './src/errores.log',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.prettyPrint()
      ),
    }),
  ],
});

if (config.MODE !== 'production') {
  console.log('ingreso');
  logger.add(
    new winston.transports.Console({
      level: 'silly',
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.timestamp(),
        winston.format.simple()
      ),
    })
  );
}

export const middLog = (req, res, next) => {
  req.logger = logger;
  next();
};

const users = [
  {
    username: 'Aaab',
    email: 'aaab@example.com',
    password: 'hashedpassword',
  },
  {
    username: 'BbbC',
    email: 'bbbc@example.com',
    password: 'hashedpassword',
  },  
  {
    username: 'CccD',
    email: 'cccd@example.com',
    password: 'hashedpassword',
  },
];

const passwordResetTokens = new Map();

app.post('/forgot-password', (req, res) => {
  const { email } = req.body;
  const user = users.find((u) => u.email === email);

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  const token = crypto.randomBytes(20).toString('hex');
  const expirationTime = Date.now() + 3600000; // 

  passwordResetTokens.set(token, { user, expirationTime });

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'aaab@gmail.com', 
      pass: 'hashedpassword', 
    },
  });

  const resetLink = `http://localhost:3000/reset-password?token=${token}`;
  const mailOptions = {
    from: 'ABC@gmail.com', 
    to: email,
    subject: 'Password Reset',
    text: `Click on the following link to reset your password: ${resetLink}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return res.status(500).json({ message: 'Error sending email' });
    }

    res.json({ message: 'Email sent successfully' });
  });
});

app.get('/reset-password', (req, res) => {
  const { token } = req.query;
  const tokenData = passwordResetTokens.get(token);

  if (!tokenData || tokenData.expirationTime < Date.now()) {
    return res.redirect('/generate-new-link');
  }

  res.json({ username: tokenData.user.username });
});

app.post('/reset-password', (req, res) => {
  const { token, newPassword } = req.body;
  const tokenData = passwordResetTokens.get(token);

  if (!tokenData || tokenData.expirationTime < Date.now()) {
    return res.status(400).json({ message: 'Invalid or expired token' });
  }

  const { user } = tokenData;

  if (newPassword === user.password) {
    return res.status(400).json({ message: 'Cannot use the same password' });
  }

  user.password = newPassword;

  passwordResetTokens.delete(token);

  res.json({ message: 'Password reset successful' });
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
