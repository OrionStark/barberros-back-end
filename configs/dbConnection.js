const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;

/**
 * Use this to get connected into database
 * @param {Function} closure [description]
 */
const connection = (closure) => {
    return MongoClient.connect('mongodb://localhost:27017', (err, client) => {
        if ( err ) { throw err };
        const db = client.db('baberros');
        closure(db);
    });
};

module.exports = connection;