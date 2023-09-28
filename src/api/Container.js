const mongoose = require('mongoose');
const fs = require('fs');

class Container {
    constructor() {
    }

    saveProduct(product, file) {
        console.log('Guardando', product);
        let nextId = this.getNextId(file);
        product.id = nextId;
        let allProductArray = this.read(file);
        allProductArray.push(product);
        this.write(allProductArray, file);
    }

    updateProduct(id, product, file) {
        console.log("Actualizando", product);
        let allProductArray = this.read(file);
        let index = allProductArray.findIndex(p => p.id === id);
        if (index >= 0) {
            allProductArray[index] = product;
            this.write(allProductArray, file);
            console.log('Actualizado');
        } else {
            console.log('Producto no encontrado');
        }
    }

    getNextId(file) {
        let lastId = 0;
        let allProductArray = this.read(file);
        if (allProductArray.length > 0) {
            lastId = allProductArray[allProductArray.length - 1].id;
        }
        return lastId + 1;
    }

    read(file) {
        let allProductArray = [];
        try {
            const data = fs.readFileSync(file, 'utf-8');
            allProductArray = JSON.parse(data);
        } catch (error) {
            console.log('Error al leer el archivo', error);
        }
        return allProductArray;
    }

    write(allProductArray, file) {
        try {
            const json = JSON.stringify(allProductArray);
            fs.writeFileSync(file, json);
        } catch (error) {
            console.log('Error al escribir el archivo', error);
        }
    }

    getById(id, file) {
        let allProductArray = this.read(file);
        let product = allProductArray.find(p => p.id === id);
        return product ? product : null;
    }

    getAll(file) {
        return this.read(file);
    }

    deleteById(id, file) {
        let allProductArray = this.read(file);
        let index = allProductArray.findIndex(p => p.id === id);
        if (index >= 0) {
            allProductArray.splice(index, 1);
            this.write(allProductArray, file);
            return id;
        } else {
            console.log('Producto no encontrado');
        }
    }

    deleteAll(file) {
        let allProductArray = [];
        this.write(allProductArray, file);
    }
}

module.exports = Container;

async function main() {
    try {
        await mongoose.connect('mongodb+srv://coderhouse:coderhouse@cluster0.5rl5n6j.mongodb.net/?retryWrites=true&w=majority', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('DB Online');

        const container = new Container();

        const product = { name: 'auto 1', price: 10.99 };
        container.saveProduct(product, 'products.json');

    } catch (error) {
        console.log(error.message);
    } finally {
        mongoose.disconnect(); 
    }

    process.exit();
}

main();
