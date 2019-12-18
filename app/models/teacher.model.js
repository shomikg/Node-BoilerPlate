const mongoose = require('mongoose');

const TeacherSchema = mongoose.Schema({
    firstName: String,
    lastName: String,
    user: String,
    pass: String,
    role: String,
    tok: String
}, {
    timestamps: true
    
});

module.exports = mongoose.model('Teacher', TeacherSchema, 'Teacher');