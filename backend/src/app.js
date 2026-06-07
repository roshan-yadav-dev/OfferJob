const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
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
const corsOrigin = process.env.CORS_ORIGIN || 'http://localhost:3000';
app.use(
    cors({
        origin: [corsOrigin, 'http://localhost:5173'],
        credentials: true,
    }),
);
app.use(express.json());
app.use(cookieParser());
app.use(morgan('dev'));
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Test Route
app.get('/health', (req, res) => {
    const databaseConnected = mongoose.connection.readyState === 1;

    res.status(databaseConnected ? 200 : 503).json({
        success: databaseConnected,
        status: databaseConnected ? 'ok' : 'degraded',
        service: 'backend',
        database: databaseConnected ? 'connected' : 'disconnected',
    });
});

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
