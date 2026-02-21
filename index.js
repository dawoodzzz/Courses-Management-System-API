const express = require("express")

require("node:dns/promises").setServers(["1.1.1.1", "8.8.8.8"]);
const app = express()

const mongoose = require("mongoose")

const url = '' //mongodb url

mongoose.connect(url).then(() => {
    console.log("connected to mongodb")
}).catch((err) => {
    console.log(err)
})


app.use(express.json())

const control = require("./controllers/courses.controllers")

const port = 4000

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})

app.get('/api/courses', control.getCourses)

app.get('/api/courses/:courseId', control.getCourseById)

app.post('/api/courses', control.validateCourse, control.addCourse)

app.patch('/api/courses/:courseId', control.validateCourse, control.updateCourse)

app.delete('/api/courses/:courseId', control.deleteCourse)
