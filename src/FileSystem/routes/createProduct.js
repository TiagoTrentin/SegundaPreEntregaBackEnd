import { Router } from 'express';
import path from 'path';
import fs from 'fs';
import passport from 'passport';
import nodemailer from 'nodemailer'; 
import { serverSocket } from '../../../app.js';

const router = Router();
const ruta = path.join(__dirname, 'files', 'products.json');

async function sendEmail(userEmail, productName) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'tiagoandresisola@gmail.com',
      pass: 'ABCJHIER', 
    },
  });

  const mailOptions = {
    from: 'tiagoandresisola@gmail.com',
    to: userEmail,
    subject: 'Producto eliminado',
    text: `Tu producto ${productName} ha sido eliminado.`,
  };

  await transporter.sendMail(mailOptions);
}

function getProducts() {
  return fs.existsSync(ruta) ? JSON.parse(fs.readFileSync(ruta, 'utf-8')) : [];
}

function saveProducts(products) {
  fs.writeFileSync(ruta, JSON.stringify(products, null, 5));
}

const isAdmin = (user) => user && user.role === 'admin';

router.get('/', (req, res) => {
  const { limit } = req.query;
  let products = getProducts();

  if (limit) {
    const limitValue = parseInt(limit);
    if (!isNaN(limitValue)) {
      products = products.slice(0, limitValue);
    }
  }

  res.json(products);
});

router.get('/:pid', (req, res) => {
  const productId = parseInt(req.params.pid);
  const products = getProducts();
  const product = products.find((product) => product.id === productId);

  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ error: 'Producto no encontrado' });
  }
});

router.put('/:pid', async (req, res) => {
  try {
    const productId = parseInt(req.params.pid);
    const { title, description, code, price, stock, category, thumbnail } = req.body;

    if (![title, description, code, price, stock, category].every(Boolean)) {
      return res.status(400).json({ error: 'Complete todas las casillas solicitadas' });
    }

    const products = getProducts();
    const productIndex = products.findIndex((product) => product.id === productId);

    if (productIndex !== -1) {
      const user = req.user;

      if (isAdmin(user) || products[productIndex].owner === user.email) {
        const originalThumbnail = products[productIndex].thumbnail;

        products[productIndex] = {
          title,
          description,
          code,
          price,
          status: true,
          thumbnail: thumbnail || originalThumbnail,
          stock,
          category,
          id: productId,
          owner: products[productIndex].owner,
        };

        saveProducts(products);
        res.status(200).json({ updatedProduct: products[productIndex] });
      } else {
        res.status(403).json({ error: 'Acceso no autorizado. Solo el propietario o el admin pueden modificar este producto.' });
      }
    } else {
      res.status(404).json({ error: 'Producto no encontrado' });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error en la modificación del producto' });
  }
});

router.delete('/:pid', async (req, res) => {
  try {
    const productId = parseInt(req.params.pid);
    const products = getProducts();
    const productIndex = products.findIndex((product) => product.id === productId);

    if (productIndex !== -1) {
      const user = req.user;

      if (isAdmin(user) || products[productIndex].owner === user.email) {
        const [deletedProduct] = products.splice(productIndex, 1);
        saveProducts(products);

        if (user.premium) {
          await sendEmail(user.email, deletedProduct.title);
        }

        serverSocket.emit('Producto eliminado', { productId, products });

        res.status(200).json({ deletedProduct });
      } else {
        res.status(403).json({ error: 'Acceso no autorizado. Solo el propietario o el admin pueden borrar este producto.' });
      }
    } else {
      res.status(404).json({ error: 'Producto no encontrado' });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error en la eliminación del producto' });
  }
});

router.post('/', passport.authenticate('registro'), async (req, res) => {
    try {
      const { title, description, code, price, stock, category, thumbnail } = req.body;
  
      if (![title, description, code, price, stock, category].every(Boolean)) {
        return res.status(400).json({ error: 'Completa todos los campos requeridos en el cuerpo de la solicitud' });
      }
  
      const user = req.user;
      
      if (!user || !user.premium) {
        return res.status(403).json({ error: 'Acceso no autorizado. Solo usuarios premium pueden crear productos.' });
      }
  
      const products = getProducts();
  
      const newProduct = {
        title,
        description,
        code,
        price,
        status: true,
        thumbnail,
        stock,
        category,
        id: products.length > 0 ? products[products.length - 1].id + 1 : 1,
        owner: user.email,
      };
  
      products.push(newProduct);
  
      saveProducts(products);
  
      serverSocket.emit('newProduct', newProduct, products);
  
      res.status(201).json({ newProduct });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Error en la creación del producto' });
    }
  });
  
export default router;
