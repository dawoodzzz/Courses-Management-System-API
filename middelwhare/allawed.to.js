const httpStatus = require("../utils/httpStatusText");
const AppError = require("../utils/apperror");

module.exports = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.currentUser.role)) {
            return res.status(403).json({ status: httpStatus.FAIL, data: null, message: "You are not authorized to perform this action" })
        }
        next()
    }
}