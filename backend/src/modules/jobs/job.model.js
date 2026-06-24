const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },

        company: {
            type: String,
            required: true,
            trim: true,
        },

        description: {
            type: String,
            required: true,
        },

        skillsRequired: [
            {
                type: String,
            },
        ],

        location: {
            type: String,
            required: true,
        },

        salary: {
            type: String,
            required: true,
        },

        postedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },

        status: {
            type: String,
            enum: ['ACTIVE', 'CLOSED', 'DELETED'],
            default: 'ACTIVE',
        },
    },
    {
        timestamps: true,
    },
);

module.exports = mongoose.model('Job', jobSchema);
