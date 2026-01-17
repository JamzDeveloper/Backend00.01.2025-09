/*
    DEFINIR ESQUEMAS/MODELOS DE LA DB
*/
export class User{
    constructor(id, email, password, role='user'){
        this.id=id
        this.email = email
        this.password = password
        this.role = role
    }
}