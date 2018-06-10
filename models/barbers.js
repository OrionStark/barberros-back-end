const q = require('q')
const dbConnection = require('../configs/dbConnection')
const config = require('../configs/config')
const order = require('./books')

module.exports = {
    addBarber: addBarber,
    doneBarber: doneBarber,
    bookBarber: bookBarber,
    getBarberByName: getBarberByName,
    getBarbers: getBarbers
}

function addBarber(data) {
    let defers = q.defer()
    getBarberByName(data.barber_name, (status) => {
        if ( status ) {
            defers.resolve({
                status: false,
                message: "Barber has already registered."
            })
        } else {
            dbConnection((db) => {
                db.collection("barbers")
                    .insertOne(data, (err, result) => {
                        if ( err ) {
                            defers.resolve({
                                status: false,
                                err_type: config.DB_ERR_TYPE,
                                message: "We got some errors on our database system. Please try it again later"
                            })
                        } else {
                            if (result) {
                                defers.resolve({
                                    status: true,
                                    message: "Barber has been added"
                                })
                            } else {
                                defers.resolve({
                                    status: false,
                                    err_type: config.DB_ERR_TYPE,
                                    message: "Unknown error. Please try it again later"
                                })
                            }
                        }
                    })
            })
        }
    })

    return defers.promise
}

function doneBarber(time, name) {
    let defers = q.defer()
    order.makeBookDone(time, name, (status, message) => {
        defers.resolve({
            status: status,
            message: message
        })
    })
    return defers.promise
}

function bookBarber(username, barber_name, time, services, callback) {
    let data = {
        user: username,
        barber_name: barber_name,
        services: services,
        book_time: time
    }
    order.addBooksInfo(data, (status, message) => {
        callback(status, message)
    })
}

function getBarberByName(barber_name, callback) {
    dbConnection((db) => {
        db.collection("barbers")
            .findOne({barber_name: barber_name}, (err, result) => {
                if ( err && !result ) {
                    callback(false, result)
                }
                if ( result ) {
                    callback(true, result)
                } else if ( !result ) {
                    callback(false, result)
                }
            })
    })
}

function getBarbers() {
    let defers = q.defer()
    dbConnection((db) => {
        db.collection("barbers")
            .find({}).toArray((err, result) => {
                if ( result ) {
                    defers.resolve({
                        status: true,
                        data: result
                    })
                } else {
                    defers.resolve({
                        status: false,
                        data: null
                    })
                }
            })
    })

    return defers.promise
}