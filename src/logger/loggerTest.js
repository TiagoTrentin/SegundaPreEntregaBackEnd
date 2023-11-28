const express = require('express');
const winston = require('winston');
const expressWinston = require('express-winston');
const fs = require('fs');

const app = express();
const port = 3000;

const highLevelLogger = winston.createLogger({
  transports: [
    new winston.transports.File({ filename: 'high-level-logs.log', level: 'error' }),
    new winston.transports.Console(),
  ],
});

const consoleLogger = winston.createLogger({
  transports: [new winston.transports.Console()],
});

app.use(expressWinston.logger({
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'express-requests.log' }),
  ],
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.simple()
  ),
}));

app.get('/loggerTest', (req, res) => {
  highLevelLogger.error('Esto es un error importante');
  highLevelLogger.warn('Esto es una advertencia importante');

  consoleLogger.info('Esto reemplaza a console.log()');

  res.send('Logs de prueba generados. Revisa los archivos de log.');
});

app.use(expressWinston.errorLogger({
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'express-errors.log', level: 'error' }),
  ],
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.simple()
  ),
}));

app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
