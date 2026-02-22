const express = require("express")

require("node:dns/promises").setServers(["1.1.1.1", "8.8.8.8"]);
const app = express()

require('dotenv').config()

const mongoose = require("mongoose")
const url = process.env.MONGO_URL

const httpStatus = require('./utils/httpStatusText')

mongoose.connect(url).then(() => {
    console.log("connected to mongodb")
}).catch((err) => {
    console.log(err)
})


app.use(express.json())



const control = require("./controllers/courses.controllers")


app.get('/api/courses', control.getCourses)

app.get('/api/courses/:courseId', control.getCourseById)

app.post('/api/courses', control.validateCourse, control.addCourse)

app.patch('/api/courses/:courseId', control.validateCourse, control.updateCourse)

app.delete('/api/courses/:courseId', control.deleteCourse)

app.all(/(.*)/, (req, res, next) => {
    res.status(404).json({ status: httpStatus.FAIL, data: null, message: "this resource is not available" })
})

const port = process.env.PORT || 4000

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})
