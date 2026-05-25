const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');
const routes = require('./routes');

const app = express();
const path = require('path');
// Security Middleware
app.use(helmet());

// Rate Limiting
app.use(
    rateLimit({
        windowMs: 15 * 60 * 1000,
        max: 100,
    }),
);

// Middleware
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(morgan('dev'));
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Test Route
app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'Backend Server Running',
    });
});

// API Routes
app.use('/api', routes);

const errorHandler = require('./middleware/errorMiddleware');

app.use(errorHandler);

module.exports = app;
