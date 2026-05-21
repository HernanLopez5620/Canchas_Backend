// src/domain/DomainException.js
class DomainException extends Error {
    constructor(message, statusCode = 400) {
        super(message);
        this.name        = 'DomainException';
        this.statusCode  = statusCode;
    }
}

module.exports = DomainException;
