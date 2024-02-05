import dotenv from 'dotenv';
import { Command, Option } from 'commander';
const programa = new Command(); 

dotenv.config({ path: './src/.env', override: true });

export const config = {
    MONGO_URL: process.env.MONGO_URL || 'mongodb+srv://Tiago:<u6pZgJeuQpC1j0ju>@databasetiago.7dp0zgv.mongodb.net/?retryWrites=true&w=majority&appName=AtlasApp',
    USERS_COLLECTION: process.env.USERS_COLLECTION || 'user',
    PRODUCT_COLLECTION: process.env.PRODUCT_COLLECTION || 'product',
    PASSWORD_ADMINISTRADOR: process.env.PASSWORD_ADMINISTRADOR || 1234, 
    PORT: process.env.PORT || 8080 
};

export default config;