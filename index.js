const express = require("express")

require("node:dns/promises").setServers(["1.1.1.1", "8.8.8.8"]);
const app = express()
const cors = require('cors')
require('dotenv').config()
const roles = require('./utils/Roles')
app.use(cors())

const multer = require('multer')

const diskStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        console.log("File", file)
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1000000)
        cb(null, uniqueSuffix + '-' + file.originalname)
    }
})

const fileFilter = (req, file, cd) => {
    const fileType = file.mimetype.split('/')[1]
    if (fileType === 'png' || fileType === 'jpg' || fileType === 'jpeg' || fileType === 'avif' || fileType === 'webp') {
        cd(null, true)
    } else {
        cd(new Error('Invalid file type'), false)
    }
}


const upload = multer({ storage: diskStorage, fileFilter, limits: { fileSize: 1000000 } })

const verifyrole = require('./middelwhare/allawed.to')

const mongoose = require("mongoose")
const url = process.env.MONGO_URL

const httpStatus = require('./utils/httpStatusText')

mongoose.connect(url).then(() => {
    console.log("connected to mongodb")
}).catch((err) => {
    console.log(err)
})


app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const control = require("./controllers/courses.controllers")
const userControl = require("./controllers/users.controllers")
const verifyToken = require('./middelwhare/verifyToken')
const path = require('path')

app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

app.get('/api/users', verifyToken, verifyrole(roles.ADMIN), userControl.getUsers)
app.post('/api/users/register', upload.single('avatar'), userControl.register)
app.post('/api/users/login', userControl.login)
app.delete('/api/users/delete', verifyToken, userControl.deleteUser)

app.get('/api/courses', verifyToken, control.getCourses)

app.get('/api/courses/:courseId', verifyToken, control.getCourseById)

app.post('/api/courses', verifyToken, verifyrole(roles.ADMIN, roles.MANGER), control.validateCourse, control.addCourse)

app.patch('/api/courses/:courseId', verifyToken, verifyrole(roles.ADMIN, roles.MANGER), control.validateCourse, control.updateCourse)

app.delete('/api/courses/:courseId', verifyToken, verifyrole(roles.ADMIN), control.deleteCourse)

app.all(/(.*)/, (req, res, next) => {
    res.status(404).json({ status: httpStatus.FAIL, data: null, message: "this resource is not available" })
})

const port = process.env.PORT || 4000

app.use((err, req, res, next) => {
    res.status(err.statusCode || 500).json({ status: err.statusText || httpStatus.ERROR, data: null, message: err.message })
})

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})
