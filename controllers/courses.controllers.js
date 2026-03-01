const { body, validationResult } = require("express-validator")

const Course = require('../models/course.model.js')

const httpStatus = require('../utils/httpStatusText.js')

const asyncWarpper = require('../middelwhare/asyncwarpper.js')

const AppError = require('../utils/apperror.js')
const validateCourse = [
    body('title').notEmpty().isLength({ min: 3 }).withMessage("Title must be at least 3 characters long"),
    body('price').notEmpty().isNumeric().withMessage("Price must be a number"),
]

const getCourses = asyncWarpper(async (req, res) => {

    const query = req.query
    const limit = query.limit || 10
    const page = query.page || 1
    const skip = (page - 1) * limit
    const courses = await Course.find({}, { "__v": false }).limit(limit).skip(skip)
    res.json({ status: httpStatus.SUCCESS, data: courses })
})

const getCourseById = asyncWarpper(async (req, res) => {
    const course = await Course.findById(req.params.courseId)

    if (course) {
        res.json({ status: httpStatus.SUCCESS, data: course })
    } else {
        throw AppError.create("Invalid object Id", 404, httpStatus.FAIL)
    }

})

const addCourse = asyncWarpper(async (req, res) => {

    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ status: httpStatus.FAIL, errors: errors.array() })
    }
    const newCourse = new Course(req.body)
    await newCourse.save()
    res.status(201).json({ status: httpStatus.SUCCESS, data: newCourse })
})

const updateCourse = async (req, res) => {
    try {
        const courseId = req.params.courseId
        const course = await Course.findByIdAndUpdate(courseId, { ...req.body }, { new: true })
        if (!course) {
            return res.status(404).json({ status: httpStatus.FAIL, data: null, message: "Course not found" })
        }
        res.status(200).json({ status: httpStatus.SUCCESS, data: course })
    } catch {
        res.status(500).send({ status: httpStatus.ERROR, message: null })
    }

}

const deleteCourse = asyncWarpper(async (req, res) => {

    await Course.deleteOne({ _id: req.params.courseId })

    res.status(200).json({ status: httpStatus.SUCCESS, data: null })

})

module.exports = {
    getCourses,
    getCourseById,
    addCourse,
    updateCourse,
    deleteCourse,
    validateCourse

}
