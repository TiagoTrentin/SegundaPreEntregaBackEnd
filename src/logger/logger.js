const fs = require('fs');

const LogLevel = {
  DEBUG: 0,
  HTTP: 1,
  INFO: 2,
  WARNING: 3,
  ERROR: 4,
  FATAL: 5,
};

class CustomLogger {
  constructor(level, logToFile = false) {
    this.level = level;
    this.logToFile = logToFile;

    if (logToFile && this.level <= LogLevel.ERROR) {
      this.errorFile = 'errors.log';
      fs.writeFileSync(this.errorFile, '');
    }
  }

  log(message, logLevel) {
    if (logLevel >= this.level) {
      const logMessage = `[${new Date().toISOString()}] [${logLevel}] ${message}`;
      
      console.log(logMessage);

      if (this.logToFile && logLevel >= LogLevel.ERROR) {
        fs.appendFileSync(this.errorFile, logMessage + '\n');
      }
    }
  }

  debug(message) {
    this.log(message, LogLevel.DEBUG);
  }

  http(message) {
    this.log(message, LogLevel.HTTP);
  }

  info(message) {
    this.log(message, LogLevel.INFO);
  }

  warning(message) {
    this.log(message, LogLevel.WARNING);
  }

  error(message) {
    this.log(message, LogLevel.ERROR);
  }

  fatal(message) {
    this.log(message, LogLevel.FATAL);
  }
}

const developmentLogger = new CustomLogger(LogLevel.DEBUG);

const productionLogger = new CustomLogger(LogLevel.INFO, true);

developmentLogger.debug('Este es un mensaje de debug para desarrollo');
developmentLogger.info('Este es un mensaje de info para desarrollo');
developmentLogger.http('Este es un mensaje de http para desarrollo');
developmentLogger.warning('Este es un mensaje de warning para desarrollo');
developmentLogger.error('Este es un mensaje de error para desarrollo');
developmentLogger.fatal('Este es un mensaje de fatal para desarrollo');

productionLogger.debug('Este es un mensaje de debug para producción');
productionLogger.info('Este es un mensaje de info para producción');
productionLogger.warning('Este es un mensaje de warning para producción');
productionLogger.error('Este es un mensaje de error para producción');
