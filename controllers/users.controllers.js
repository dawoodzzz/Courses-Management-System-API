const User = require('../models/user.model.js')
const asyncWarpper = require('../middelwhare/asyncwarpper.js')
const bycript = require('bcryptjs')
const httpStatus = require('../utils/httpStatusText.js')
const generateJwt = require('../utils/generate.jwt.js')

const getUsers = asyncWarpper(async (req, res) => {
    const query = req.query
    const limit = query.limit || 10
    const page = query.page || 1
    const skip = (page - 1) * limit
    const users = await User.find({}, { "__v": false, password: false }).limit(limit).skip(skip)
    res.json({ status: httpStatus.SUCCESS, data: users })
})
const register = asyncWarpper(async (req, res) => {
    const { firstName, lastName, email, password, role } = req.body
    const avatar = req.file?.filename || null
    const user = await User.findOne({ email: email })
    if (user) {
        res.status(400).json({ status: httpStatus.FAIL, data: "email is already exists" })
        return
    }
    const hashedPassword = await bycript.hash(password, 10)
    const newUser = new User({ firstName, lastName, email, password: hashedPassword, role, avatar: avatar })
    const token = await generateJwt({ email: newUser.email, id: newUser._id, role: newUser.role, avatar: avatar })
    await newUser.save()
    res.status(201).json({ status: httpStatus.SUCCESS, data: newUser, token })
})
const login = asyncWarpper(async (req, res) => {
    const { email, password } = req.body
    const user = await User.findOne({ email: email })
    if (!user) {
        res.status(400).json({ status: httpStatus.FAIL, data: "email is not exists" })
        return
    }
    const matchPassword = await bycript.compare(password, user.password)
    if (!matchPassword) {
        res.status(400).json({ status: httpStatus.FAIL, data: "password is not correct" })
        return
    }
    const token = await generateJwt({ email: user.email, id: user._id, role: user.role })
    res.status(200).json({ status: httpStatus.SUCCESS, data: user, token })

})
const deleteUser = asyncWarpper(async (req, res) => {
    const { email, password } = req.body
    const user = await User.findOne({ email: email })
    if (!user) {
        res.status(400).json({ status: httpStatus.FAIL, data: "email is not exists" })
        return
    }
    const matchPassword = await bycript.compare(password, user.password)
    if (!matchPassword) {
        res.status(400).json({ status: httpStatus.FAIL, data: "password is not correct" })
        return
    }
    await User.deleteOne({ email: email })
    res.status(200).json({ status: httpStatus.SUCCESS, data: "user deleted successfully" })
})

module.exports = {
    getUsers,
    register,
    login,
    deleteUser
}

