<<<<<<< HEAD
const express    = require('express');
const cors       = require('cors');
const helmet     = require('helmet');
const errorHandler  = require('./shared/infrastructure/middlewares/errorHandler');
const userRouter    = require('./contexts/users/infrastructure/UserController');
const venueRouter   = require('./contexts/venues/infrastructure/VenueController');
const courtRouter   = require('./contexts/courts/infrastructure/CourtController');
=======
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const errorHandler = require('./shared/infrastructure/middlewares/errorHandler');
const userRouter = require('./contexts/users/infrastructure/UserController');
const venueRouter = require('./contexts/venues/infrastructure/VenueController');
const courtRouter = require('./contexts/courts/infrastructure/CourtController');
>>>>>>> ee0887045723df2bab60499807d8c0d0cfd75e48
const bookingRouter = require('./contexts/bookings/infrastructure/BookingController');

const app = express();

app.use(helmet());
<<<<<<< HEAD
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
=======
app.use(cors());
app.use(express.json());


app.get('/health', (req, res) => res.json({ ok: true, env: process.env.NODE_ENV }));

app.use('/api/users', userRouter);
app.use('/api/venues', venueRouter);
app.use('/api/courts', courtRouter);
>>>>>>> ee0887045723df2bab60499807d8c0d0cfd75e48
app.use('/api/bookings', bookingRouter);

app.use(errorHandler);

<<<<<<< HEAD
module.exports = app;

=======
module.exports = app;
>>>>>>> ee0887045723df2bab60499807d8c0d0cfd75e48
