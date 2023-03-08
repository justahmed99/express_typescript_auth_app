class Users {
    email: string;
    username: string;
    name: string;
    password: string;
    isActive: boolean;
    constructor(
        email: string,
        username: string,
        name: string,
        password: string,
        isActive: boolean
    ) {
        this.email = email
        this.username = username
        this.name = name
        this.password = password
        this.isActive = isActive
    }
}