const { UserNotFound } = require('../domain/exceptions/UserExceptions');

class GetUserProfile {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }

    async execute({ userId }) {
        const user = await this.userRepository.findById(userId);
        if (!user) throw new UserNotFound();
        return { user: user.toPublic() };
    }
}

module.exports = GetUserProfile;