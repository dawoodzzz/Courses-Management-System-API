const { body, validationResult } = require("express-validator")

const Course = require('../models/course.model.js')

const httpStatus = require('../utils/httpStatusText.js')


const getCourses = async (req, res) => {
    const courses = await Course.find()
    res.json({ status: httpStatus.SUCCESS, data: courses })
}

const validateCourse = [
    body('title').notEmpty().isLength({ min: 3 }).withMessage("Title must be at least 3 characters long"),
    body('price').notEmpty().isNumeric().withMessage("Price must be a number"),
]

const getCourseById = async (req, res) => {

    try {
        const course = await Course.findById(req.params.courseId)

        if (course) {
            res.json({ status: httpStatus.SUCCESS, data: course })
        } else {
            res.status(404).send({ status: httpStatus.FAIL, data: null })
        }
    } catch (error) {
        res.status(500).send({ status: httpStatus.ERROR, data: null, message: "Invalid object Id" })
    }
}

const addCourse = async (req, res) => {


    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ status: httpStatus.FAIL, errors: errors.array() })
    }
    const newCourse = new Course(req.body)
    await newCourse.save()
    res.status(201).json({ status: httpStatus.SUCCESS, data: newCourse })

}

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

const deleteCourse = async (req, res) => {

    const result = await Course.deleteOne({ _id: req.params.courseId })

    res.status(200).json({ status: httpStatus.SUCCESS, data: null })

}

module.exports = {
    getCourses,
    getCourseById,
    addCourse,
    updateCourse,
    deleteCourse,
    validateCourse

}
