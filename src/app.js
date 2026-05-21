const express    = require('express');
const cors       = require('cors');
const helmet     = require('helmet');
const errorHandler  = require('./shared/infrastructure/middlewares/errorHandler');
const userRouter    = require('./contexts/users/infrastructure/UserController');
const venueRouter   = require('./contexts/venues/infrastructure/VenueController');
const courtRouter   = require('./contexts/courts/infrastructure/CourtController');
const bookingRouter = require('./contexts/bookings/infrastructure/BookingController');

const app = express();

app.use(helmet());
app.use(cors({
    origin: (origin, callback) => {
        if (!origin || origin.startsWith('http://localhost')) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
}));
app.use(express.json());

app.get('/health', (req, res) =>
    res.json({ ok: true, env: process.env.NODE_ENV })
);

app.use('/api/users',    userRouter);
app.use('/api/venues',   venueRouter);
app.use('/api/courts',   courtRouter);
app.use('/api/bookings', bookingRouter);

app.use(errorHandler);

module.exports = app;

