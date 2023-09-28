import mongoose, { Schema } from "mongoose";

const express = require('express');
const routerProduct = require('./router/products.router');
const app = express();
const port = 3000; 

const autosModelos=mongoose.model('modelos',new mongoose.Schema({
     titulo: String, kilometros: Number, modelo: String
}))
   
const modelosEsquema=new mongoose.Schema({
    nombre: String, marca: String, color: String,
    Disponible:{
        type: [
            {
                modelo:{
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'modelos'
                }
            }
        ]
    }
})

const autosModelo=mongoose.model('modelo',modelosEsquema)


try{
    await mongoose.connect('')
    console.log('DB Online')

    //crear autos
    //let auto1=await autosModelo.create({
        //titulo: 'Sedan', kilometros: 40000, modelo: 'Audi'
    //})

    //let auto2=await autosModelo.create({
        //titulo: 'Coupe', kilometros: 23000, modelo: 'Porsche'
    //})

    //console.log(auto1, auto2)

    //let modelo=await autosModelo.create({
        //nombre: 'Charger', marca: 'Dodge', color: 'Gris',
        //modelo: [{modelos:'650a345e0d59ae24bfff461e1'},{modelo:'650a345e0d59ae24bff461e2'}]
    //})

    //console.log(modelo)

} catch (error) {
    console.log(error.message)
}

process.exit()