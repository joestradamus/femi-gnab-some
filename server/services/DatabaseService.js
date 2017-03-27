const MongoClient = require('mongodb').MongoClient

const dbConfig =  /* require('../credentials.json').mongo_url // */  process.env.MONGO_URL
const TWEET_TABLE_NAME = 'FILTERED_TWEETS'

const addTweetToDb = (tweet) => {
    try {
        tryToSaveTweetToDb(tweet)
    } catch (err) {
        console.log(err)
    }
}

const getAllTweetsByGender = (gender, res) => {
    try {
        MongoClient.connect(dbConfig, (err, db) => {
            if (!err) {
                db.collection(TWEET_TABLE_NAME).aggregate([
                    {
                        $match: { "user.guessedGender": gender }
                    }
                ]).toArray( (err, result) => {
                    res.send( result )
                })
            } else {
                throw `Could not read tweets from database: ${err}`
            }
        })
    } catch (err) {
        console.log(err)
    }
}

const getAllTweetsByScore = (score, res) => {
    try {
        MongoClient.connect(dbConfig, (err, db) => {
            if (!err) {
                db.collection(TWEET_TABLE_NAME).aggregate([{ $match: { "textSentiment.score": score }}])
                    .toArray( (err, result) => {
                        res.send( result )
                    })
            } else {
                throw `Could not read tweets from database: ${err}`
            }
        })
    } catch (err) {
        console.log(err)
    }
}

const getAllTweets = (res) => {
    try {
        MongoClient.connect(dbConfig, (err, db) => {
            if (!err) {
                db.collection(TWEET_TABLE_NAME).aggregate()
                    .toArray( (err, result) => {
                        res.send( result )
                    })
            } else {
                throw `Could not read tweets from database: ${err}`
            }
        })
    } catch (err) {
        console.log(err)
    }
}

const tryToSaveTweetToDb = (tweet) => {
    MongoClient.connect(dbConfig, (err, db) => {
        if (!err) {
            console.log(`Successfully connected to Mongo instance!`)
            db.collection(TWEET_TABLE_NAME).insertOne(tweet, (err, result) => {
                if (!err) {
                    console.log(`Successfully saved tweet ${tweet.id} to database`)
                } else {
                    throw `Could not save tweet to database: ${err}`
                }
            })
            db.close()
        } else {
            throw `ERROR connecting to database, unable to connect to mongo instance with credentials ${JSON.stringify(dbConfig)}`
        }
    })
}

const tryToCloseDb = (db) => {
    try {
        db.close()
    }
    catch (err) {
        throw `Could not close connection to db ${JSON.stringify(db)}`
    }
}

module.exports = {
    addTweetToDb: addTweetToDb,
    getAllTweets: getAllTweets,
    getAllTweetsByGender: getAllTweetsByGender,
    getAllTweetsByScore: getAllTweetsByScore
}
