import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    role: { type: String, enum: ['admin', 'user'], default: 'user' }, // 'admin' o 'user'
});

const User = mongoose.model('User', userSchema);

const productSchema = new mongoose.Schema({
    marca: { type: String, required: true },
    modelo: { type: String, required: true },
    color: { type: String, required: true },
    kilometraje: { type: String, required: true },
    precio: { type: String, required: true },
    año: { type: String, required: true },
    category: { type: String, required: true },
    id: { type: Number, required: true }
});

const Product = mongoose.model('Product', productSchema);

const isAdmin = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);

        if (!user || user.role !== 'admin') {
            return res.status(403).json({ error: 'Acceso denegado. Se requiere rol de administrador.' });
        }

        next();
    } catch (error) {
        console.error('Error al verificar el rol de administrador:', error);
        return res.status(500).json({ error: 'Error interno al verificar el rol de administrador.' });
    }
};

const isUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);

        if (!user || user.role !== 'user') {
            return res.status(403).json({ error: 'Acceso denegado. Se requiere rol de usuario.' });
        }

        next();
    } catch (error) {
        console.error('Error al verificar el rol de usuario:', error);
        return res.status(500).json({ error: 'Error interno al verificar el rol de usuario.' });
    }
};

const cartSchema = new mongoose.Schema({
    products: [
        {
            productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
            quantity: { type: Number, required: true }
        }
    ],
});

const Cart = mongoose.model('Cart', cartSchema);

export { User, Product, Cart, isAdmin, isUser };
