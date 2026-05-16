const { UserNotFound } = require('../domain/exceptions/UserExceptions');

class GetUserProfile {
    /**
     * @param {import('../domain/UserRepository')} userRepository
     */
    constructor(userRepository) {
        this.userRepository = userRepository;
    }

    /**
     * @param {{ userId: number }} dto
     * @returns {Promise<{ user: object }>}
     */
    async execute({ userId }) {
        const user = await this.userRepository.findById(userId);
        if (!user) throw new UserNotFound();

        return { user: user.toPublic() };
    }
}

module.exports = GetUserProfile;
