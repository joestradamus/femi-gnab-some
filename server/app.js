const express = require('express')
const path = require('path')
const nlp = require('compromise')
const sentiment = require('sentiment')
const Twit = require('twit')
const fs = require('fs')

const credentials = require('../credentials.json')
const app = express()

const extractDetailsFrom = (tweet) => {
    const id = tweet.id
    const date = tweet.created_at
    const text = tweet.text
    const textSentiment = sentiment(tweet.text) // get sentiment of text, as well as all positive, negative words
    const textTopics = nlp(tweet.text).people().data() // get info on sentence's topics (people, places)
    const user = {
        id: tweet.user.id,
        name: tweet.user.name,
        location: tweet.user.location,
        followerCount: tweet.user.followers_count,
        friendsCount: tweet.user.friends_count,
        favoritesCount: tweet.user.favourites_count,
        statusesCount: tweet.user.statuses_count,
        profileImage: tweet.user.profile_image_url
    }
    const usersMentioned = tweet.user.user_mentions
    return {
        id,
        date,
        text,
        textSentiment,
        textTopics,
        user,
        usersMentioned
    }
}

const logTweet = (tweet) => {
    const details = extractDetailsFrom(tweet)
    const logMessage = `${JSON.stringify(details)}`
    if (details.textSentiment.score !== 0) {
        fs.writeFile(`server/output/san-francisco/TWEET-${tweet.id}.txt`, logMessage, (err) => {
            if (err) {
                return console.log(err)
            }
            console.log(`Logged a tweet: [${tweet.id}]`)
        })
    }
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
    const stream = twitter.stream('statuses/filter', { locations: sanFrancisco })
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