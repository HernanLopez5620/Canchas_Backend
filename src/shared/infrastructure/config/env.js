require('dotenv').config();

const required = (key) => {
    const val = process.env[key];
    if (!val) throw new Error(`Variable de entorno requerida no definida: ${key}`);
    return val;
};

const env = {
    nodeEnv:      process.env.NODE_ENV   || 'development',
    port:         Number(process.env.PORT) || 3000,

    jwtSecret:    required('JWT_SECRET'),
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',

    db: {
        host:     required('DB_HOST'),
        port:     Number(process.env.DB_PORT) || 3306,
        user:     required('DB_USER'),
        password: required('DB_PASSWORD'),
        name:     required('DB_NAME'),
    },
};

module.exports = env;
