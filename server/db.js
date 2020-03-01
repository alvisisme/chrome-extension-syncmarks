const MongoClient = require('mongodb').MongoClient
const assert = require('assert')
const fs = require('fs')

const DATABASE_NAME = 'bookmarksdb'
const DATABASE_SERVER = '192.168.31.201'
const DATABASE_PORT = 27017
const USER = encodeURIComponent('root');
const PASSWORD = encodeURIComponent('root123');
const AUTHMECHANISM = 'SCRAM-SHA-1';
// const DATABASE_URL = `mongodb://${USER}:${PASSWORD}@${DATABASE_SERVER}:${DATABASE_PORT}/?authMechanism=${AUTHMECHANISM}&authSource=${DATABASE_NAME}`
const DATABASE_URL = `mongodb://${DATABASE_SERVER}:${DATABASE_PORT}/${DATABASE_NAME}`
const COLLECTION = 'bookmarks'

const inertData = (db, callback) => {
    const collection = db.collection('bookmarks')
    let data = [{
        id: '0',
        title: "根书签"
    }]
    collection.insertMany(data, (error, result) => {
        assert.equal(null, error)
        assert(1, result.result.n)
        assert(1, result.ops.length)
        callback(result)
    })
}

exports.connect = ( ) => {
    const client = new MongoClient(DATABASE_URL)

    client.connect((error) => {
        assert.equal(null, error)
        const db = client.db(DATABASE_NAME)
        console.log('connect ' + DATABASE_URL + ' successfully')
        inertData(db, result => {
            client.close()
        })
    })
}