import express from 'express';
import { UserDTO } from '../dto/userDTO.js';

const router = express.Router();

router.get('/current', (req, res) => {
    if (!req.user) {
        return res.status(401).json({ error: 'Usuario no autenticado' });
    }

    const userDTO = UserDTO.fromUserModel(req.user);

    res.json(userDTO);
});

export default router;
