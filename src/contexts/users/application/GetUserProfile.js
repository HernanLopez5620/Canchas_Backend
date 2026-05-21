const { UserNotFound } = require('../domain/exceptions/UserExceptions');

class GetUserProfile {
<<<<<<< HEAD
=======
    /**
     * @param {import('../domain/UserRepository')} userRepository
     */
>>>>>>> ee0887045723df2bab60499807d8c0d0cfd75e48
    constructor(userRepository) {
        this.userRepository = userRepository;
    }

<<<<<<< HEAD
    async execute({ userId }) {
        const user = await this.userRepository.findById(userId);
        if (!user) throw new UserNotFound();
=======
    /**
     * @param {{ userId: number }} dto
     * @returns {Promise<{ user: object }>}
     */
    async execute({ userId }) {
        const user = await this.userRepository.findById(userId);
        if (!user) throw new UserNotFound();

>>>>>>> ee0887045723df2bab60499807d8c0d0cfd75e48
        return { user: user.toPublic() };
    }
}

<<<<<<< HEAD
module.exports = GetUserProfile;
=======
module.exports = GetUserProfile;
>>>>>>> ee0887045723df2bab60499807d8c0d0cfd75e48
