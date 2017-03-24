const MongoClient = require('mongodb').MongoClient
const dbConfig = require('../credentials.json').mongo_url

const TWEET_TABLE_NAME = 'tweets'

export const addTweetToDb = (tweet) => {
    MongoClient.connect(dbConfig, (err, db) => {
        if (!err) {
            console.log(`Successfully connected to Mongo instance!`)
            tryToSaveTweetToDb(tweet, db)
        } else {
            console.log(`ERROR connecting to database: ${err}`)
        }
    })
}


const tryToSaveTweetToDb = (tweet, db) => {
    db.collection(TWEET_TABLE_NAME).insertOne(tweet, (err, result) => {
        if (!err) {
            console.log(`Successfully saved tweet ${details.id} to database`)
        } else {
            console.log(`Could not save tweet to database!: ${err}`)
        }
    })
}

const getAllTweetsByWomen = (db) => {
    return db.collection(TWEET_TABLE_NAME).find(
        {
            user: {
                guessedGender: [{ genderGuess: "Female" }]
            }
        }
    )
}