// src/domain/DomainException.js
class DomainException extends Error {
    constructor(message, statusCode = 400) {
        super(message);
        this.name = this.constructor.name;
        this.statusCode = statusCode;
    }
}

module.exports = DomainException;