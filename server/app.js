const express = require('express')
const path = require('path')
const nlp = require('compromise')
const sentiment = require('sentiment')
const Twit = require('twit')
const fs = require('fs')


let credentials

process.env.NODE_ENV === 'development'
    ? credentials = require('./credentials.json')
    : {
        consumer_key: process.env.CONSUMER_KEY,
        consumer_secret: process.env.CONSUMER_SECRET,
        access_token: process.env.ACCESS_TOKEN,
        access_token_secret: process.env.ACCESS_TOKEN_SECRET,
        mongo_url: process.env.MONGO_URL
    }

const app = express()

app.use(express.static(path.resolve(__dirname, '..', '../build')))


app.use(express.static(path.resolve(__dirname, '..', '../femi-gnab-some/build')))

app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '..', '../femi-gnab-some/build', 'index.html'))
})

const listenForTweets = () => {
    const twitter = new Twit(credentials)
    const sanFrancisco = [ '-122.75', '36.8', '-121.75', '37.8' ] // Top Right, Bottom Left coordinates
    const marquetteCampus = [
        '-87.942874',  // longitude @ 23rd/State St.
        '43.037529',   // latitude @ 23rd/State St.
        '-87.9210',    // longitude @ 8th/Michigan St.
        '43.0427577'   // latitude @ 8th/Michigan St.
    ]
    const stream = twitter.stream('statuses/filter', { locations: marquetteCampus })

}

module.exports = app