import { Router } from "express";
import { messageModel } from "../models/messages.model.js";
import { serverSocket } from "../../../app.js";

const router = Router();

router.get('/', async (req, res) => {
    try {
        const messages = await messageModel.find();
        res.json(messages);
    } catch (error) {
        res.status(500).json({ error: 'Error inesperado al obtener mensajes.', detail: error.message });
    }
});

router.post('/', async (req, res) => {
    const { user, message } = req.body;

    try {
        const newMessage = await messageModel.create({ user, message });
        await newMessage.save();

        const messages = await messageModel.find();
        serverSocket.emit('newMessage', newMessage, messages);

        res.status(201).json({ message: 'Mensaje enviado', User: user, Text: message });
    } catch (error) {
        res.status(500).json({ error: 'Error inesperado al enviar mensaje.', detail: error.message });
    }
});

router.delete('/', async (req, res) => {
    try {
        await messageModel.deleteMany({});
        const messages = await messageModel.find();

        serverSocket.emit('cleanMessage', messages);
        res.status(201).json({ message: 'Chat eliminado' });
    } catch (error) {
        res.status(500).json({ error: 'Error inesperado al eliminar chat.', detail: error.message });
    }
});

export default router;
