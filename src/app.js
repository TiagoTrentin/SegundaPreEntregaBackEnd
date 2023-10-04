import express from 'express';
import path from 'path';
import { Server } from 'socket.io';
import { engine } from 'express-handlebars';
import mongoose from 'mongoose';
import productsRouter from './dao/MongoDb/routes/products.routes.js';
import viewRouter from './dao/MongoDb/routes/views.routes.js';
import cartRouter from './dao/MongoDb/routes/cart.routes.js';
import messageRoute from './dao/MongoDb/routes/messages.routes.js';

const PORT = 3000;
const DB_URI = 'mongodb://localhost:27017/';

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

const serverExpress = app.listen(PORT, () => {
    console.log(`Server escuchando en puerto ${PORT}`);
});

const serverSocket = new Server(serverExpress);

serverSocket.on('connection', socket => {
    console.log(`Se ha conectado un cliente con id ${socket.id}`);
});

try {
    await mongoose.connect(DB_URI);
    console.log('DB online');
} catch (error) {
    console.error('Error al conectar a la base de datos:', error.message);
}

export { serverSocket };
