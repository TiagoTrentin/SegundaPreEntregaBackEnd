import mongoose from "mongoose";
import { Usuario } from "./usuarios.model.js"; 
import { DB_URL, PORT } from './config.js';

class UsuariosMongoDAO {
    constructor() {
    }

    async connectToDatabase() {
        try {
            await mongoose.connect('mongodb+srv://Tiago:<u6pZgJeuQpC1j0ju>@databasetiago.7dp0zgv.mongodb.net/?retryWrites=true&w=majority&appName=AtlasApp', {
                useNewUrlParser: true,
                useUnifiedTopology: true,
                useCreateIndex: true,
            });
            console.log("MongoDB Online");
        } catch (error) {
            console.error("Error al conectar a MongoDB:", error.message);
            throw error;
        }
    }

    async get(filtro = {}) {
        if (filtro["_id"]) {
            if (!mongoose.Types.ObjectId.isValid(filtro["_id"])) {
                throw new Error('Id de usuario inválido');
            }
        }
        return await Usuario.find(filtro);
    }

    async create(usuario) {
        return await Usuario.create(usuario);
    }
}

export const usuariosMongoDAO = new UsuariosMongoDAO();
