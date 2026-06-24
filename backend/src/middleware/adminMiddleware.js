const protect = require('./authMiddleware');
const authorizeRoles = require('./roleMiddleware');

const adminOnly = [protect, authorizeRoles('admin')];

module.exports = adminOnly;
