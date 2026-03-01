const mongoose = require('mongoose');

const validator = require('validator')
const Rule = require('../utils/Roles')
const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        validate: [validator.isEmail, "invalid email"]
    },
    password: {
        type: String,
        required: true
    },
    token: {
        type: String
    },
    role: {
        type: String,
        enum: [Rule.ADMIN, Rule.USER, Rule.MANGER],
        default: Rule.USER
    },
    avatar: {
        type: String,
        default: '../uploads/avatar.avif'
    }
})




module.exports = mongoose.model('users', userSchema)