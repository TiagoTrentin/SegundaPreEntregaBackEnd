import mongoose from 'mongoose';
import { DB_URL, PORT } from './config.js';


const usuarioSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        unique: true,
        required: true,
        lowercase: true,
    },
}, { timestamps: true });

const Usuario = mongoose.model('Usuario', usuarioSchema);

export default Usuario;
