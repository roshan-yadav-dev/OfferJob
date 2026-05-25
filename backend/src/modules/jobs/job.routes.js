const express = require('express');

const {
    createJobController,
    getJobsController,
    getJobController,
} = require('./job.controller');

const protect = require('../../middleware/authMiddleware');

const authorizeRoles = require('../../middleware/roleMiddleware');

const router = express.Router();

// Recruiter Only Route
router.post('/', protect, authorizeRoles('recruiter'), createJobController);

// Public Routes
router.get('/', getJobsController);

router.get('/:id', getJobController);

module.exports = router;
