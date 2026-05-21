const bcrypt = require('bcryptjs');
const User   = require('../domain/User');
const { UserAlreadyExists } = require('../domain/exceptions/UserExceptions');

class RegisterUser {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }

    async execute({ name, email, phone, password, role }) {
        const existing = await this.userRepository.findByEmail(email);
        if (existing) throw new UserAlreadyExists();

        const hashed = await bcrypt.hash(password, 12);
        const user   = new User({ name, email, phone, password: hashed, role });
        const saved  = await this.userRepository.save(user);

        return { user: saved.toPublic() };
    }
}

module.exports = RegisterUser;