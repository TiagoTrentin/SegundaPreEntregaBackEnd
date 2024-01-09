import express from 'express';
import mongoose from 'mongoose';
import multer from 'multer';
import { modeloUsuarios } from '../models/usuarios.models.js';

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.post('/api/users/:uid/documents', upload.array('documentos'), async (req, res) => {
  const userId = req.params.uid;
  const documentos = req.files;

  if (!userId || !documentos || documentos.length === 0) {
    return res.status(400).json({ error: 'Falta el usuario o los documentos.' });
  }

  try {
    const usuario = await modeloUsuarios.findById(userId);
    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado.' });
    }

    usuario.documentosCargados = true;
    await usuario.save();

    res.status(200).json({ mensaje: 'Documentos cargados exitosamente.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor en marcha en el puerto ${PORT}`);
});
