const express = require('express')
const path = require('path')
const nlp = require('compromise')
const sentiment = require('sentiment')
const Twit = require('twit')
const fs = require('fs')

const credentials = require('../credentials.json')

const app = express()

const analyzeTweet = (tweet) => {

}
const logTweet = (tweet) => {
    const logMessage = `Received tweet: ${JSON.stringify(tweet)}\n\n`
    fs.writeFile(`server/output/tweetResult${tweet.id}.txt`, logMessage, (err) => {
        if (err) {
            return console.log(err)
        }
        console.log(`Logged a tweet: [${tweet.id}]`)
    })
}

const logTweetsWithParams = () => {
    const twitter = new Twit(credentials)
    const sanFrancisco = [ '-122.75', '36.8', '-121.75', '37.8' ]
    const marquetteCampus = [
        '-87.94504165649414', // longitude @ 25th/State St
        '43.04336267974874',  // latitude @ 25th/State St
        '-87.92195320129395', // longitude @ 8th/Michigan St.
        '43.03737183727952'   // latitude @ 8th/Michigan St.
    ]
    const stream = twitter.stream('statuses/filter', { locations: marquetteCampus })
    stream.on('tweet', (tweet) => {
        logTweet(tweet)
    })
}

app.use( (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE')
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type')
    res.setHeader('Access-Control-Allow-Credentials', true)
})

// Serve static assets
app.use(express.static(path.resolve(__dirname, '..', 'static')))

app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '..', 'static', 'public/index.html'))
})

logTweetsWithParams()

module.exports = app