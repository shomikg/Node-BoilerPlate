const mongoose = require('mongoose');

const StudentSchema = mongoose.Schema({
    firstName: String,
    lastName: String,
    user: String,
    pass: String,
    roll: String,
    tok : String
}, {
    timestamps: true
    
});

module.exports = mongoose.model('Student', StudentSchema, 'Student');