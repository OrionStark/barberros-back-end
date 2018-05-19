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
    getBooksInfoByTimeandName(book_time, barber_name, (status, datas) => {
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
            callback(false, "Are you fucking kidding me?. We didn't even found that barber.")
        } else {
            data.status = "Done"
            dbConnection((db) => {
                db.collection("books")
                    .updateOne({book_time: time, barber_name: name, status: "Ongoing"}, {$set: {status: "Done"}}, (err, res) => {
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
            .findOne({book_time: time, barber_name: name, status: "Ongoing"}, (err, res) => {
                if ( res ) {
                    callback(true, res)
                } else {
                    callback(false, res)
                }
            })
    })
}

function getCompletedBooksByUsername(username, callback) {
    dbConnection((db) => {
        db.collection("books")
            .find({user: username, status: "Done"}, (err, res) => {
                if (res) {
                    callback(true, res)
                } else {
                    callback(false, res)
                }
            })
    })
}

function getOngoingBooksByUsername(username, callback) {
    dbConnection((db) => {
        db.collection("books")
            .find({user: username, status: "Ongoing"}, (err, res) => {
                if (res) {
                    callback(true, res)
                } else {
                    callback(false, res)
                }
            })
    })
}