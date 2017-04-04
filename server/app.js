const express = require('express')
const path = require('path')
const tweetAnalysisService = require('./services/TweetAnalysisService')
const initializeWith = require('./services/DatabaseService').initialize
const TABLES = require('./services/DatabaseService').TABLES
const DEPLOYMENT_MODE = {
    DEVELOPMENT: "development",
    PRODUCTION: "production"
}

const connectDbWith = (deploymentMode) => {
    let credentials, db
    if (deploymentMode === DEPLOYMENT_MODE.DEVELOPMENT) {
        credentials = require('./credentials.json')
        db = initializeWith(credentials)
        return db
    }
    else if (deploymentMode === DEPLOYMENT_MODE.PRODUCTION) {
        credentials = {
            consumer_key: process.env.CONSUMER_KEY,                  // With a runtime environment variable "CONSUMER_KEY"
            consumer_secret: process.env.CONSUMER_SECRET,            // With a runtime environment variable "CONSUMER_SECRET"
            access_token: process.env.ACCESS_TOKEN,                  // With a runtime environment variable "ACCESS_TOKEN"
            access_token_secret: process.env.ACCESS_TOKEN_SECRET,    // With a runtime environment variable "ACCESS_TOKEN_SECRET"
            mongo_url: process.env.MONGO_URL                         // With a runtime environment variable "MONGO_URL"
        }
        db = initializeWith(credentials)
        connectDbToLiveTweets(db, credentials)
    }
    else {
        throw `Unrecognized deployment mode: ${deploymentMode}. Recognized formats are of the form 
            ${JSON.stringify(DEPLOYMENT_MODE)}`
    }
    return db
}

const connectDbToLiveTweets = (db, credentials) => {
    const stream = tweetAnalysisService.createStreamForTweetsWith(credentials)
    stream.on('tweet', (tweet) => {                                                // on tweet
        const filteredTweet = tweetAnalysisService.extractDetailsFromRaw(tweet)    // get the data that's relevant
        tweetAnalysisService.containsGenderedDetails(filteredTweet)                // the tweet has some emotional sentiment, gender involved
            ? db.addTweetToDbTable(filteredTweet, TABLES.GENDERED_TWEETS)
            : db.addTweetToDbTable(filteredTweet, TABLES.UNGENDERED_TWEETS)

    })
}

const app = express()
const db = connectDbWith(DEPLOYMENT_MODE.DEVELOPMENT)

// Serve client-side code HTML, JS, and CSS
app.use(express.static(path.resolve(__dirname, '..', 'build')))
app.get('/', (req, res) => res.sendFile(path.resolve(__dirname, '..', 'build', 'index.html')))
// Set up API endpoints
app.get('/api/tweets', (req, res) => db.getAllTweets(res))
app.get('/api/tweets/:startDate/:endDate', (req, res) => db.getAllTweetsOnDate(req, res))
app.get('/api/female', (req, res) => db.getAllTweetsByGender('Female', res))
app.get('/api/male', (req, res) => db.getAllTweetsByGender('Male', res))

module.exports = app