const MySqlBookingRepository = require('../../../contexts/bookings/infrastructure/MySqlBookingRepository');

const INTERVAL_MS = 5 * 60 * 1000;

function startExpiryJob() {
    const repo = new MySqlBookingRepository();

    const run = async () => {
        try {
            await repo.expireOldPending();
        } catch (err) {
            console.error('[ExpiryJob] Error:', err.message);
        }
    };

    run();
    setInterval(run, INTERVAL_MS);
    console.log('⏱️  Job de expiración de reservas iniciado');
}

module.exports = { startExpiryJob };