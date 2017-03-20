const express = require('express')
const path = require('path')
const nlp = require('compromise')
const sentiment = require('sentiment')
const Twit = require('twit')
const fs = require('fs')
const jsonFormat = require('json-format')

const credentials = require('../credentials.json')
const app = express()

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

const logTweetsWithParams = () => {
    const twitter = new Twit(credentials)
    const sanFrancisco = [ '-122.75', '36.8', '-121.75', '37.8' ]
    const marquetteCampus = [
        '-87.95', // longitude @ 25th/State St
        '43.04',  // latitude @ 25th/State St
        '-87.92', // longitude @ 8th/Michigan St.
        '43.04'   // latitude @ 8th/Michigan St.
    ]
    const stream = twitter.stream('statuses/filter', { locations: sanFrancisco })
    stream.on('tweet', (tweet) => {
        logTweet(tweet)
    })
}

const logTweet = (tweet) => {
    const details = extractDetailsFrom(tweet)
    const logMessage = jsonFormat(details, { type: 'space', size: 2} )
    if (details.textSentiment.score !== 0) {
        fs.writeFile(`server/output/san-francisco/TWEET-${tweet.id}.txt`, logMessage, (err) => {
            if (err) {
                return console.log(err)
            }
            console.log(`Logged a tweet: [${tweet.id}]`)
        })
    }
}

const extractDetailsFrom = (tweet) => {
    return {
        id: tweet.id,
        date: tweet.created_at,
        text: tweet.text,
        textSentiment: sentiment(tweet.text), // get sentiment of text, as well as all positive, negative words
        textTopics: nlp(tweet.text).people().data(), // get info on sentence's topics (people, places)
        user: {
            id: tweet.user.id,
            name: tweet.user.name,
            guessedGender: nlp(tweet.user.name).topics().data(),
            location: tweet.user.location,
            followerCount: tweet.user.followers_count,
            friendsCount: tweet.user.friends_count,
            favoritesCount: tweet.user.favourites_count,
            statusesCount: tweet.user.statuses_count,
            profileImage: tweet.user.profile_image_url
        },
        usersMentioned: tweet.user.user_mentions
    }
}
logTweetsWithParams()

module.exports = app