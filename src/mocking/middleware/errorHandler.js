export const errorHandler = (err, req, res, next) => {

    if (err.name === 'ValidationError') {
        return res.status(400).json({ error: 'Error de validación', details: err.errors });
    }

    console.error('Error inesperado:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
};

export const notFoundHandler = (req, res) => {
    res.status(404).json({ error: 'Recurso no encontrado' });
};
