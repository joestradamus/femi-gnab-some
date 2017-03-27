const express = require('express')
const path = require('path')

const tweetAnalysisService = require('./services/TweetAnalysisService')
const databaseService = require('./services/DatabaseService')

const initializeApp = () => {
    const credentials = // require('./credentials.json') // Use this for development mode
        {
            consumer_key: process.env.CONSUMER_KEY,                  // With a runtime environment variable "CONSUMER_KEY"
            consumer_secret: process.env.CONSUMER_SECRET,            // With a runtime environment variable "CONSUMER_SECRET"
            access_token: process.env.ACCESS_TOKEN,                  // With a runtime environment variable "ACCESS_TOKEN"
            access_token_secret: process.env.ACCESS_TOKEN_SECRET,    // With a runtime environment variable "ACCESS_TOKEN_SECRET"
            mongo_url: process.env.MONGO_URL                         // With a runtime environment variable "MONGO_URL"
        }
    const stream = tweetAnalysisService.createStreamForTweetsWith(credentials)
    stream.on('tweet', (tweet) => {                                                // on tweet
        const filteredTweet = tweetAnalysisService.extractDetailsFromRaw(tweet)    // get the data that's relevant
        if (tweetAnalysisService.containsRelevantDetails(filteredTweet)) {         // the tweet has some emotional sentiment, gender involved
            databaseService.addTweetToDb(tweet)
        }
    })
}


const app = express()

app.use(express.static(path.resolve(__dirname, '..', 'build')))

app.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, '..', 'build', 'index.html'))
})

app.get('/api/tweets', (req, res) => {
    console.log('GET request on /api/tweets')
    databaseService.getAllTweets(res)
})

app.get('/api/female', (req, res) => {
    console.log(`GET request on /api/female`)
    databaseService.getAllTweetsByGender('Female', res)
})

app.get('/api/male', (req, res) => {
    console.log(`GET request on /api/male`)
    databaseService.getAllTweetsByGender('Male', res)
})

app.get('/api/score/:score', (req, res) => {
    console.log(`Get request on /api/score`)
    databaseService.getAllTweetsByScore(req.params.score, res)
})

initializeApp()

module.exports = app