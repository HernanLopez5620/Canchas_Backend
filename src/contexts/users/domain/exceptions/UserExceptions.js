const DomainException = require('../../../../shared/domain/DomainException');

class UserNotFound extends DomainException {
    constructor() { super('Usuario no encontrado', 404); }
}

class UserAlreadyExists extends DomainException {
    constructor() { super('El correo ya está registrado', 409); }
}

class InvalidCredentials extends DomainException {
    constructor() { super('Correo o contraseña incorrectos', 401); }
}

class UserInactive extends DomainException {
    constructor() { super('La cuenta está desactivada', 403); }
}

module.exports = { UserNotFound, UserAlreadyExists, InvalidCredentials, UserInactive };
