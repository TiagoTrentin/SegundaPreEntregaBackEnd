export class UserDTO {
    constructor(username, email, firstName, lastName) {
        this.username = username;
        this.email = email;
        this.firstName = firstName;
        this.lastName = lastName;
    }

    static fromUserModel(userModel) {
        return new UserDTO(
            userModel.username,
            userModel.email,
            userModel.firstName,
            userModel.lastName,
        );
    }
}
