import express from 'express';
import mongoose from 'mongoose';
import multer from 'multer';
import { modeloUsuarios } from '../models/usuarios.models.js';

const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf']; 

    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Tipo de archivo no permitido.'));
    }
  },
  destination: (req, file, cb) => {
    const tipoArchivo = req.body.tipoArchivo; 

    if (tipoArchivo === 'perfil') {
      cb(null, 'uploads/profiles/');
    } else if (tipoArchivo === 'documento') {
      cb(null, 'uploads/documents/');
    } else {
      cb(new Error('Tipo de archivo no válido.'));
    }
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    cb(null, `${timestamp}_${file.originalname}`);
  }
});

app.post('/api/users/:uid/documents', upload.array('documentos'), async (req, res) => {
  const userId = req.params.uid;
  const tipoArchivo = req.body.tipoArchivo;

  if (!userId || !tipoArchivo) {
    return res.status(400).json({ error: 'Falta el usuario o el tipo de archivo.' });
  }

  try {
    const usuario = await modeloUsuarios.findById(userId);
    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado.' });
    }
    
    const archivosGuardados = req.files.map(file => file.filename);

    usuario.documentosCargados = true;
    await usuario.save();

    res.status(200).json({ mensaje: 'Documentos cargados exitosamente.', archivosGuardados });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor en marcha en el puerto ${PORT}`);
});
