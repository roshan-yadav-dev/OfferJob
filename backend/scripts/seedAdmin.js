/**
 * Seed a platform admin user.
 * Usage: node scripts/seedAdmin.js
 *
 * Env: ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_NAME (optional)
 */
require('dotenv').config();
const mongoose = require('mongoose');

const User = require('../src/modules/users/user.model');
const config = require('../src/config/env');

async function seedAdmin() {
    const email = process.env.ADMIN_EMAIL || 'admin@smartportal.com';
    const password = process.env.ADMIN_PASSWORD || 'Admin@123456';
    const name = process.env.ADMIN_NAME || 'Platform Admin';

    await mongoose.connect(config.MONGO_URI);

    const existing = await User.findOne({ email });

    if (existing) {
        existing.role = 'admin';
        existing.isActive = true;
        existing.password = password;
        await existing.save();
        console.log(`Updated existing user as admin: ${email}`);
    } else {
        await User.create({
            name,
            email,
            password,
            role: 'admin',
            isActive: true,
        });
        console.log(`Created admin user: ${email}`);
    }

    await mongoose.disconnect();
}

seedAdmin().catch((error) => {
    console.error('Failed to seed admin:', error.message);
    process.exit(1);
});
