const q = require('q')
const dbConnection = require('../configs/dbConnection')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const config = require('../configs/config')

/**
 * 
 * @param {Object} userData 
 * @returns {Promise} Promise for the results
 */
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
                                            err
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

    return defers.promise
}

function getMyFavorites(username) {
    let defers = q.defer()
    dbConnection((db) => {
        db.collection('user')
            .findOne({username: username}, (err, result) => {
                if ( err ) {

                }
            })
    })
}

/**
 * 
 * @param {Object} user {username, password} 
 * @returns {Promise} The user succeed login data
 */
function login(user) {
    let defers = q.defer()
    dbConnection((db) => {
        db.collection('users')
            .findOne({username: user.username}, (err, resonse) => {
                if (err) {
                    defers.resolve({
                        status: false,
                        message: "There's an internal error. Please try it again later"
                    })
                }
                if ( response ) {
                    bcrypt.compare(user.password, response.password, (err, result) => {
                        if ( err ) {
                            defers.resolve({
                                status: false,
                                message: "There's an internal error. Please try it again later"
                            })
                        }
                        if ( result ) {
                            defers.resolve({
                                status: true,
                                message: "Welcome to barberros, " + response.full_name,
                                username: response.username,
                                full_name: response.full_name
                            })
                        }
                    })
                } else {
                    defers.resolve({
                        status: false,
                        message: "Your username is invalid. Please check it back"
                    })
                }
            })
    })
    return defers.promise
}



/**
 * 
 * @param {Object} user User data 
 * @param {any} callback function callback 
 */
function createUser(user, callback) {
    dbConnection((db) => {
        db.collection('users')
            .insertOne(user, (err, result) => {
                if ( err ) {
                    let error = {
                        status: false,
                        err_type: config.DB_ERR_TYPE,
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