const MongoClient = require('mongodb').MongoClient
const moment = require('moment')
const tweets = require('../../tweets.json')
const TABLES = {
    GENDERED_TWEETS: 'GENDERED_TWEETS',
    UNGENDERED_TWEETS: 'UNGENDERED_TWEETS'
}

const initialize = (credentials) => {

    const addTweetToDbTable = (tweet, table) => {
        try {
            tryToSaveTweetToDbTable(tweet, table)
        } catch (err) {
            console.log(err)
        }
    }

    const tryToSaveTweetToDbTable = (tweet, table) => {
        MongoClient.connect(credentials.mongo_url, (err, db) => {
            if (!err) {
                console.log(`Successfully connected to Mongo instance!`)
                db.collection(table).insertOne(tweet, (err, result) => {
                    if (!err) {
                        console.log(`Successfully saved tweet ${tweet.id} to database`)
                    } else {
                        throw `Could not save tweet to database: ${err}`
                    }
                })
                db.close()
            } else {
                throw `ERROR connecting to database, unable to connect to mongo instance with credentials ${JSON.stringify(credentials)}`
            }
        })
    }

    const getAllTweetsByGender = (gender, res) => {
        try {
            MongoClient.connect(credentials.mongo_url, (err, db) => {
                if (!err) {
                    db.collection(TABLES.GENDERED_TWEETS).aggregate([
                        {
                            $match: { "user.guessedGender": gender }
                        }
                    ]).toArray( (err, result) => {
                        res.send( JSON.stringify(result) )
                    })
                    db.close()
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
            // MongoClient.connect(credentials.mongo_url, (err, db) => {
            //     if (!err) {
            //         db.collection(TABLES.GENDERED_TWEETS).aggregate()
            //             .toArray( (err, result) => {
            //                 res.send( 200, result )
            //             })
            //         db.close()
            //     } else {
            //         throw `Could not read tweets from database: ${err}`
            //     }
            // })
            res.send( tweets )
        } catch (err) {
            console.log(err)
        }
    }

    const getAllTweetsOnDate = (req, res) => {
        const dateStart = moment(req.startDate).startOf('day').toDate().toISOString()
        const dateEnd = moment(req.endDate).endOf('day').toDate().toISOString()
        try {
            MongoClient.connect(credentials.mongo_url, (err, db) => {
                if (!err) {
                    db.collection(TABLES.GENDERED_TWEETS).aggregate([
                        {
                            $match: {
                                "date":
                                    {
                                        $lt: dateEnd,
                                        $gte: dateStart
                                    }
                            }
                        }
                    ]).toArray( (err, result) => {
                        res.send( 200, result )
                    })
                    db.close()
                } else {
                    throw `Could not read tweets from database: ${err}`
                }
                db.close()
            })
        } catch (err) {
            console.log(err)
        }
    }

    const migrateToTableWithTweets = () => {
        try {
            MongoClient.connect(credentials.mongo_url, (err, db) => {
                if (!err) {
                    db.collection('FILTERED_TWEETS').aggregate()
                        .toArray( (err, results) => {
                            results.forEach((tweet) => tweet.date = moment(tweet.date).subtract(5, 'hours').toDate())
                            db.collection(TABLES.GENDERED_TWEETS).insertMany(results, (err, result) => {
                                if (!err) {
                                    console.log(`Successfully saved tweets to database`)
                                } else {
                                    throw `Could not save tweets to new database: ${err}`
                                }
                            })
                        })
                } else {
                    throw `Could not migrate tweets from database: ${err}`
                }
            })
        } catch (err) {
            console.log(err)
        }
    }

    return {
        addTweetToDbTable: addTweetToDbTable,
        getAllTweetsByGender: getAllTweetsByGender,
        getAllTweets: getAllTweets,
        getAllTweetsOnDate: getAllTweetsOnDate,
        migrateToTableWithTweets: migrateToTableWithTweets
    }
}



module.exports = {
    initialize: initialize,
    TABLES: TABLES
}
