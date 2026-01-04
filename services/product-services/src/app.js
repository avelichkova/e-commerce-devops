const express = require("express");
const cors = require('cors');
const helmet = require('helmet');
const winston = require('winston');

const { initializeDB } = require('./config/database');
const productRoutes = require('./routes/productRoutes');
const { pool } = require('./config/database');

const app = express();
const PORT = 3001;

// Logger config
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'product-service.log' })
    ]
});

// Middleware

app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

//Logging middleware

app.use((req, res, next) => {
    logger.info(`${req.method} ${req.path}`, {
        method: req.method,
        url: req.path,
        ip: req.ip,
        userAgent: req.get('User-Agent')
    });
    next();
});

app.get('/health', async (req, res) => {
    try {
        await pool.query('SELECT 1');

        res.json({
            service: 'product-service',
            status: 'healthy',
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.status(503).json({
            service: 'product-service',
            status: 'unhealthy',
            timestamp: new Date().toISOString(),
            error: error.message
        });
    } 
});

app.use('/api/products', productRoutes);

const startServer = async () => {
    try {
        await initializeDB();
        app.listen(PORT, '0.0.0.0', () => {
            logger.info(`Product service running on port ${PORT}`);
            console.log(`Product service running on port ${PORT}`);
        });
    } catch (error) {
        logger.error('Failed to start server: ', error);
        process.exit(1);
    }
};

startServer();
module.exports = app;
