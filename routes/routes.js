const router = require('express').Router()
const jwt = require('jsonwebtoken')
const config = require('../configs/config')
const user = require('../models/user')
const user_controller = require('../controllers/UserController')

router.all("/user/*", (req, res, next) => {
    console.log(req.headers)
    if ( req.path === '/user/login' || req.path === '/user/register' ) {
        next()
    } else {
        if ( req.body.token ) {
            jwt.verify(req.body.token, config.secret_key, (err, decoded) => {
                if (err) {
                    res.status(500).json({message: "Internal error. Pleaset try it again later"})
                } else {
                    user.checkUserbyToken(decoded.username, (status) => {
                        if ( status ) {
                            next()
                        } else {
                            res.status(401).json({
                                status: false,
                                message: "You're not allowed to do this"
                            })
                        }
                    })
                }
            })
        } else {
            res.status(401).json({
                status: false,
                message: "You're not allowed to do this"
            })
        }
    }
})
router.post("/user/register", user_controller.register)
router.post("/user/login", user_controller.login)
router.post("/user/check-secondary-password", user_controller.checkSecondaryPass)
router.post("/user/change-password", user_controller.changePassword)

module.exports = router