const barber = require('../models/barbers')
const config = require('../configs/config')

exports.addBarber = (req, res) => {
    let data = req.body
    barber.addBarber(data)
        .then(
            result => {
                if ( result.status == false ) {
                    if ( result.err_type == config.INVALID_PARAMS_ERR_TYPE ) {
                        res.status(401).json(result)
                    } else {
                        res.status(200).json(result)
                    }
                } else {
                    res.status(200).json(result)
                }
            }
        )
        .catch(err => {
            res.status(500).send(err)
        })
}

exports.getBarbers = (req, res) => {
    barber.getBarbers()
        .then(result => {
            res.status(200).json(result)
        })
        .catch(err => {
            res.status(500).send(err)
        })
}

exports.doneBarber = (req, res) => {
    let data = req.body
    barber.doneBarber(data.time, data.name, data.id)
        .then(
            result => {
                if ( result.status == false ) {
                    if ( result.err_type == config.INVALID_PARAMS_ERR_TYPE ) {
                        res.status(401).json(result)
                    } else {
                        res.status(501).json(result)
                    }
                } else {
                    res.status(200).json(result)
                }
            }
        )
        .catch(err => {
            res.status(500).send(err)
        })
}