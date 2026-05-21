const bcrypt = require('bcryptjs');
const jwt    = require('jsonwebtoken');
const env    = require('../../../shared/infrastructure/config/env');
const { InvalidCredentials, UserInactive } = require('../domain/exceptions/UserExceptions');

class LoginUser {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }

    async execute({ email, password }) {
        const user = await this.userRepository.findByEmail(email);
        if (!user) throw new InvalidCredentials();

        const match = await bcrypt.compare(password, user.password);
        if (!match) throw new InvalidCredentials();

        if (!user.isActive) throw new UserInactive();

        const token = jwt.sign(
            { sub: user.id, role: user.role },
            env.jwtSecret,
            { expiresIn: env.jwtExpiresIn }
        );

        return { token, user: user.toPublic() };
    }
}

module.exports = LoginUser;
