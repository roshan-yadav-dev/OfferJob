const mongoose = require('mongoose');
const config = require('./env');

const connectDB = async () => {
    try {
        await mongoose.connect(config.MONGO_URI);

        console.log('MongoDB Connected Successfully');
    } catch (error) {
        console.error('MongoDB Connection Failed');
        console.error(error.message);

        process.exit(1);
    }
};

module.exports = connectDB;
