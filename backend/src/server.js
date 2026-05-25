const app = require('./app');
const connectDB = require('./config/db');
const config = require('./config/env');

// Connect Database
connectDB();

const PORT = config.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
