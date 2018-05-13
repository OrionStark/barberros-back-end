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