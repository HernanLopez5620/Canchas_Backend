// src/domain/DomainException.js
class DomainException extends Error {
    constructor(message, statusCode = 400) {
        super(message);
<<<<<<< HEAD
        this.name        = 'DomainException';
        this.statusCode  = statusCode;
    }
}

module.exports = DomainException;
=======
        this.name = this.constructor.name;
        this.statusCode = statusCode;
    }
}

module.exports = DomainException;
>>>>>>> ee0887045723df2bab60499807d8c0d0cfd75e48
