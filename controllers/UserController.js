const user = require('../models/user')
const config = require('../configs/config')
exports.register = (req, res) => {
    let data = req.body
    user.register(data)
        .then(result => {
            if ( result.status == false ) {
                if ( result.err_type == config.INVALID_PARAMS_ERR_TYPE ) {
                    res.status(401).json(result)
                } else {
                    res.status(501).json(result)
                }
            } else {
                res.json(result)
            }
        })
        .catch(err => {
            console.log(err)
            res.status(501).send("Unknown error. Please try it again later")
        })
}
exports.login = (req, res) => {
    let data = req.body
    user.login(data)
        .then(result => {
            if ( result.status == false ) {
                if ( result.err_type == config.INVALID_PARAMS_ERR_TYPE ) {
                    res.status(401).json(result)
                } else {
                    res.status(501).json(result)
                }
            } else {
                res.json(result)
            }
        })
        .catch(err => {
            res.status(501).send("Unknown error. Please try it again later")
        })
}
exports.checkSecondaryPass = (req, res) => {
    let sec_pass = req.body.sec_pass
    let username = req.body.username
    user.checkSecondaryPass(username, sec_pass)
        .then(result => {
            if ( result.status == false ) {
                if ( result.err_type == config.INVALID_PARAMS_ERR_TYPE ) {
                    res.status(401).json(result)
                } else {
                    res.status(501).json(result)
                }
            } else {
                res.json(result)
            }
        })
        .catch(err => {
            res.status(501).send("Unknown error. Please try it again later")
        })
}
exports.changePassword = (req, res) => {
    user.changePassword(req.body.username, req.body.new_password)
        .then(result => {
            if ( result.status == false ) {
                if ( result.err_type == config.INVALID_PARAMS_ERR_TYPE ) {
                    res.status(401).json(result)
                } else {
                    res.status(501).json(result)
                }
            } else {
                res.json(result)
            }
        })
        .catch(err => {
            res.status(501).send("Unknown error. Please try it again later")
        })
}
exports.makeAppointment = (req, res) => {
    let data = req.body
    console.log(data)
    user.makeAppointment(data)
        .then(result => {
            res.status(200).json(result)
        })
        .catch(err => {
            res.status(500).send("Internal Error")
        })
}
exports.getOngoingAppointments = (req, res) => {
    let username = req.params.username
    console.log(username)
    user.getMyOngoingAppointments(username)
        .then(result => {
            res.status(200).json(result)
        })
        .catch(err => {
            res.status(500).send("Internal Error")
        })
}

exports.addFavorite = (req, res) => {
    let username = req.body.username
    let barber_id = req.body.barber_id
    user.addFavorite(username, barber_id)
        .then(result => {
            res.status(200).json(result)
        })
        .catch(err => {
            res.status(500).send("Internal Error")
        })
}
exports.getFavorites = (req, res) => {
    let username = req.params.username
    user.getMyFavorites(username)
        .then(result => {
            res.status(200).json(result)
        })
        .catch(err => {
            res.status(500).send("Internal Error")
        })
}