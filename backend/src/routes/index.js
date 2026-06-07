const express = require('express');

const authRoutes = require('../modules/auth/auth.routes');
const jobRoutes = require('../modules/jobs/job.routes');
const router = express.Router();

const applicationRoutes = require('../modules/applications/application.routes');
const uploadRoutes = require('./upload.routes');
const recruiterRoutes = require('../modules/recruiter/recruiter.routes');

router.use('/auth', authRoutes);
router.use('/jobs', jobRoutes);
router.use('/applications', applicationRoutes);
router.use('/upload', uploadRoutes);
router.use('/recruiter', recruiterRoutes);

module.exports = router;
