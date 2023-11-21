import TipoDeErrores from './tipoDeErrores.js';

throw TipoDeErrores.BAD_REQUEST;

throw TipoDeErrores.UNAUTHORIZED;

class CustomError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.name = this.constructor.name;
        this.statusCode = statusCode || 500;

        Error.captureStackTrace(this, this.constructor);
    }
}

const generateErrors = (count) => {
    const errors = [];

    for (let i = 0; i < count; i++) {
        const message = `Error personalizado #${i + 1}`;
        const statusCode = 400 + i; 

        errors.push(new CustomError(message, statusCode));
    }

    return errors;
};

const errors = generateErrors(100);

errors.forEach((error, index) => {
    console.log(`Error ${index + 1}: ${error.message}, Código de estado: ${error.statusCode}`);
});

throw errors[0];
