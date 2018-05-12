const q = require('q')
const dbConnection = require('../configs/dbConnection')
const bcrypt = require('bcrypt')
const config = require('../configs/config')

function register(userData) {
    let defers = q.defer()
    function addFavorite(user) {
        user.favorites = {}
    }
    function addBooks(user) {
        user.books = {}
    }
    dbConnection((db) => {
        db.collection('users')
            .findOne({username: userData.username}, (err, result) => {
                if ( result ) {
                    defers.resolve({
                        code: 200,
                        status: false,
                        message: "Username already taken by someone"
                    })
                } else {
                    bcrypt.genSalt(config.saltRounds, (err, result) => {
                        bcrypt.hash(userData.password, result, (err, hash) => {
                            if ( err ) {
                                defers.reject("Internal Error")
                            } else {
                                userData.password = hash
                                addFavorite(userData)
                                addBooks(userData)
                                createUser(userData, (err, result) => {
                                    if ( err ) {
                                        defers.resolve({
                                            status: false,
                                            message: "Register Failed"
                                        })
                                    } else {
                                        defers.resolve(result)
                                    }
                                })
                            }
                        })
                    })
                }
            })
    })
}

function createUser(user, callback) {
    dbConnection((db) => {
        db.collection('users')
            .insertOne(user, (err, result) => {
                if ( err ) {
                    let error = {
                        status: false,
                        message: "Error on putting the data to the databse"
                    }
                    callback(error, null)
                } else {
                    callback(null, {
                        status: true,
                        message: "Register succeed"
                    })
                }
            })
    })
}