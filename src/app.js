import express from 'express';
import path from 'path';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import multer from 'multer';
import nodemailer from 'nodemailer';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Server } from 'socket.io';

import productsRouter from './routes/products.router.js';
import cartRouter from './routes/cartsRoutes.js';
import viewRouter from './routes/view.router.js';
import sessionsRouter from './routes/sessions.router.js';

import { DB_URL, PORT } from './config.js';

dotenv.config();

const app = express();

app.engine('handlebars', engine({ allowProtoMethodsByDefault: true }));
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, '/views'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '/public')));

app.use('/api/products/', productsRouter);
app.use('/api/messages/', messageRoute);
app.use('/api/carts/', cartRouter);
app.use('/', viewRouter);

app.use(bodyParser.json());

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Api de usuarios',
      version: '1.0.0',
      description: 'Documentacion de Api de Usuarios',
    },
  },
  apis: ['./*.js'],
};

const specs = swaggerJsdoc(options);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

const serverExpress = app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});

const serverSocket = new Server(serverExpress);

serverSocket.on('connection', (socket) => {
  console.log(`Cliente conectado con ID ${socket.id}`);
});

try {
  await mongoose.connect(process.env.DB_URL, { useNewUrlParser: true, useUnifiedTopology: true });
  console.log('Base de datos en línea');
} catch (error) {
  console.error('Error al conectar a la base de datos:', error.message);
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './src/tmp/uploads');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

const transporter = nodemailer.createTransport({
  service: 'gmail',
  port: 587,
  auth: {
    user: 'tiagoandresisola@gmail.com',
    pass: process.env.EMAIL_PASSWORD,
  },
});

const enviar = async (to, subject, message, adjuntos = []) => {
  let attachments = adjuntos.map((adjunto) => ({
    path: adjunto.path,
    filename: adjunto.filename,
  }));

  return transporter.sendMail({
    from: 'Tiago <tiagoandresisolai@gmail.com>',
    to,
    subject,
    html: `<p style="color:cyan;">${message}</p>`,
    attachments,
  });
};

app.post('/mail', upload.array('adjuntos'), async (req, res) => {
  let { to, subject, message } = req.body;

  if (!to || !subject || !message) {
    res.setHeader('Content-Type', 'application/json');
    return res.status(400).json({ error: 'Faltan datos' });
  }

  let regExMail = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  let toArreglo = to.split(',');

  let error = toArreglo.some((direccion) => !regExMail.test(direccion.trim()));

  if (error) {
    res.setHeader('Content-Type', 'application/json');
    return res.status(400).json({ error: 'Una o más direcciones de correo son inválidas' });
  }

  try {
    let resultado = await enviar(to, subject, message, req.files);

    req.files.forEach((adjunto) => fs.unlinkSync(adjunto.path));

    res.setHeader('Content-Type', 'application/json');
    return res.status(200).json({ payload: resultado });
  } catch (error) {
    console.error('Error al enviar el correo electrónico:', error);
    res.setHeader('Content-Type', 'application/json');
    return res.status(500).json({ error: 'Error interno al enviar el correo electrónico' });
  }
});

const server = app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});

export { serverSocket };
