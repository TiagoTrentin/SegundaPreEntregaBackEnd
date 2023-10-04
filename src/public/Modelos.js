const mongoose = require('mongoose');

const autoEsquema = new mongoose.Schema({
    nombre: String,
    apellido: String
});

const autosEsquema = new mongoose.Schema({
    titulo: String,
    horas: Number,
    docente: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'docentes'
    }
});

const modelosEsquema = new mongoose.Schema({
    nombre: String,
    apellido: String,
    email: String,
    cursando: [{
        modelo: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'autos'
        }
    }]
});

const AutoModelo = mongoose.model('autos', autoEsquema);
const AutosModelos = mongoose.model('autos', autosEsquema);
const ModelosModelo = mongoose.model('modelos', modelosEsquema);

async function main() {
    try {
        await mongoose.connect('mongodb+srv://coderhouse:coderhouse@cluster0.5rl5n6j.mongodb.net/test?retryWrites=true&w=majority', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('DB Online');

        const modelo = await ModelosModelo.findOne({ _id: '650a3b5b52116b1f9011c83a' })
            .populate('cursando.modelo');

        console.log(JSON.stringify(modelo, null, 3));
    } catch (error) {
        console.error(error.message);
    } finally {
        mongoose.disconnect(); 
    }
}

main();
