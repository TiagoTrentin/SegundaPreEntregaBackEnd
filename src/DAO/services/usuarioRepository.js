class UsuariosRepository {
    constructor(dao) {
        this.dao = dao;
    }

    async getAllUsers() {
        try {
            const users = await this.dao.get();
            return users;
        } catch (error) {
            console.error("Error al obtener usuarios:", error);
            throw error;
        }
    }

    async getUserById(id) {
        try {
            const user = await this.dao.get({ _id: id });
            return user;
        } catch (error) {
            console.error(`Error al obtener usuario con ID ${id}:`, error);
            throw error;
        }
    }

    async getUserByEmail(email) {
        try {
            const user = await this.dao.get({ email });
            return user;
        } catch (error) {
            console.error(`Error al obtener usuario con email ${email}:`, error);
            throw error;
        }
    }

    async createUser(nombre, email) {
        try {
            const newUser = await this.dao.create({ nombre, email });
            return newUser;
        } catch (error) {
            console.error("Error al crear usuario:", error);
            throw error;
        }
    }
}

export default UsuariosRepository;
