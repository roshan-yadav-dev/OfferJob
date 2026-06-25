const app = require('./app');
const connectDB = require('./config/db');
const config = require('./config/env');

const startServer = async () => {
    await connectDB();

    const PORT = config.PORT || 5000;

    app.listen(PORT, () => {
        // Silently start server
    });
};

startServer().catch((error) => {
    console.error('Server startup failed');
    console.error(error);
    process.exit(1);
});
