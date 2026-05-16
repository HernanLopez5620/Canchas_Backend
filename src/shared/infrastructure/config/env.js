require('dotenv').config();

const env = {
    nodeEnv: process.env.NODE_ENV || 'development',
    port: Number(process.env.PORT) || 3000,
    jwtSecret: process.env.JWT_SECRET,
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
};

if (!env.jwtSecret) throw new Error('JWT_SECRET no definido en .env');

module.exports = env;