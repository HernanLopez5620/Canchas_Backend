require('dotenv').config();
const app = require('./src/app');
const env = require('./src/shared/infrastructure/config/env');
const { getPool } = require('./src/shared/infrastructure/database/MySqlConnection');

async function main() {
    const pool = getPool();
    await pool.query('SELECT 1');
    console.log('✅ Conexión a MySQL exitosa');

    app.listen(env.port, () => {
        console.log(`🚀 Servidor en http://localhost:${env.port}`);
        console.log(`📋 Ambiente: ${env.nodeEnv}`);
    });
}

main().catch(err => {
    console.error('❌ Error al arrancar:', err.message);
    process.exit(1);
});