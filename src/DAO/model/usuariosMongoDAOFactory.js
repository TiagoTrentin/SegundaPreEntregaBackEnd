import { UsuariosMongoDAO } from "../DAO/model/usuariosMongoDAO.js";

class UsuariosMongoDAOFactory {
    static createDAO() {
        return new UsuariosMongoDAO();
    }
}

export default UsuariosMongoDAOFactory;
