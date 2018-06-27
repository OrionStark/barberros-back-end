const router = require('express').Router()
const jwt = require('jsonwebtoken')
const config = require('../configs/config')
const user = require('../models/user')
const user_controller = require('../controllers/UserController')
const barber_controller = require('../controllers/BarberController')

router.all("/user/*", (req, res, next) => {
    console.log(req.headers)
    if ( req.path === '/user/login' || req.path === '/user/register' 
            || req.path === '/user/change-password' 
            || req.path === '/user/check-secondary-password' ) {
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
            if ( req.headers.authorization ) {
                console.log(req.params.username)
                jwt.verify(req.headers.authorization, config.secret_key, (err, decoded) => {
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
    }
})
router.post("/user/register", user_controller.register)
router.post("/user/login", user_controller.login)
router.post("/user/check-secondary-password", user_controller.checkSecondaryPass)
router.post("/user/change-password", user_controller.changePassword)
router.get("/barber/getbarbers", barber_controller.getBarbers)
router.post("/barber/addBarber", barber_controller.addBarber)
router.post("/user/barber/makeAppointment", user_controller.makeAppointment)
router.post("/barber/done", barber_controller.doneBarber)
router.get("/user/barber/ongoing/:username", user_controller.getOngoingAppointments)
router.post("/user/favorite/add", user_controller.addFavorite)
router.get("/user/:username/favorites", user_controller.getFavorites)
router.post("/user/book/cancel", user_controller.cancelBook)

module.exports = router