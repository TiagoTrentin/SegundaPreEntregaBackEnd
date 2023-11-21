import CustomError from './CustomError.js';

class TipoDeErrores {
    static BAD_REQUEST = new CustomError('Solicitud incorrecta', 400);
    static UNAUTHORIZED = new CustomError('No autorizado', 401);
    static FORBIDDEN = new CustomError('Prohibido', 403);
    static NOT_FOUND = new CustomError('No encontrado', 404);
    static METHOD_NOT_ALLOWED = new CustomError('Método no permitido', 405);
    static CONFLICT = new CustomError('Conflicto', 409);
    static INTERNAL_SERVER_ERROR = new CustomError('Error interno del servidor', 500);
    static NOT_IMPLEMENTED = new CustomError('No implementado', 501);
    static BAD_GATEWAY = new CustomError('Puerta de enlace incorrecta', 502);
    static SERVICE_UNAVAILABLE = new CustomError('Servicio no disponible', 503);
}

export default TipoDeErrores;
