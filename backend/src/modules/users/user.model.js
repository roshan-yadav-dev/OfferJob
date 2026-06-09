const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },

        password: {
            type: String,
            required: true,
        },

        role: {
            type: String,
            enum: ['student', 'recruiter', 'admin'],
            default: 'student',
        },

        resumeUrl: {
            type: String,
            default: null,
        },

        resumePublicId: {
            type: String,
            default: null,
        },

        // Student Profile Fields
        collegeName: {
            type: String,
            default: null,
        },

        currentCGPA: {
            type: Number,
            default: null,
        },

        currentSemester: {
            type: Number,
            default: null,
        },

        passoutYear: {
            type: Number,
            default: null,
        },

        mobileNumber: {
            type: String,
            default: null,
        },

        city: {
            type: String,
            default: null,
        },

        state: {
            type: String,
            default: null,
        },

        // Recruiter Profile Fields
        companyName: {
            type: String,
            default: null,
        },

        currentPosition: {
            type: String,
            default: null,
        },

        address: {
            type: String,
            default: null,
        },
    },
    {
        timestamps: true,
    },
);

// Hash Password Before Save
userSchema.pre('save', async function () {
    if (!this.isModified('password')) {
        return;
    }

    const salt = await bcrypt.genSalt(10);

    this.password = await bcrypt.hash(this.password, salt);
});

// Compare Password
userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
