const dbConnection = require('../configs/dbConnection')
const q = require('q')
const config = require('../configs/config')


module.exports = {
    addBooksInfo: addBooksInfo,
    makeBookDone: makeBookDone,
    getBooksInfoByTimeandName: getBooksInfoByTimeandName
}

function addBooksInfo(data, callback) {
    let username = data.username
    let barber_name = data.barber_name
    let book_time = data.book_time
    data.status = "Ongoing"
    getBooksInfoByTimeandName(book_time, barber_name, (status, data) => {
        if ( status ) {
            callback(false, "Please choose the other time.")
        } else {
            dbConnection((db) => {
                db.collection("books")
                    .insertOne(data, (err, res) => {
                        if (res) {
                            callback(true, "You're already make an appointment. Thank you for using our service")
                        } else {
                            callback(false, "We got some errors. Please try it again later")
                        }
                    })
            })
        }
    })
}

function makeBookDone(time, name, callback) {
    getBooksInfoByTimeandName(time, name, (status, data) => {
        if ( !status ) {
            defers.resolve({
                status: false,
                message: "Are you fucking kidding me?. We didn't even fond that barber."
            })
        } else {
            data.status = "Done"
            dbConnection((db) => {
                db.collection("books")
                    .updateOne({name: time, name: name}, {$set: {status: "Done"}}, (err, res) => {
                        if ( res ) {
                            callback(true, "Thank you. Please come back again")
                        } else {
                            callback(false, "There's some errors. Please try it again later.")
                        }
                    })
            })
        }
    })
}

function getBooksInfoByTimeandName(time, name, callback) {
    dbConnection((db) => {
        db.collection("books")
            .findOne({time: time, name: name}, (err, res) => {
                if ( res ) {
                    if ( res.status === "Done" ) {
                        callback(false, res)
                    } else {
                        callback(true, res)
                    }
                } else {
                    callback(false, res)
                }
            })
    })
}