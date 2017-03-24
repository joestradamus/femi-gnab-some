const express = require('express')
const path = require('path')
const nlp = require('compromise')
const sentiment = require('sentiment')
const Twit = require('twit')
const fs = require('fs')

const credentials = require('credentials.json')

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
    res.sendFile(path.resolve(__dirname, '..', 'static', '../public/index.html'))
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

const logTweet = (tweet) => {
    const details = extractDetailsFrom(tweet)
    if (containsRelevantDetails(details)) {
        console.log()
        MongoClient.connect(dbConfig, (err, db) => {
            if (!err) {
                console.log(`Successfully connected to Mongo instance!`)
                db.collection('tweets').insertOne(details, (err, result) => {
                    if (!err) {
                        console.log(`Successfully saved tweet ${details.id} to database`)
                    } else {
                        console.log(`Could not save tweet to database!: ${err}`)
                    }
                })
                db.close()
            } else {
                console.log(`ERROR connecting to database: ${err}`)
            }
        })
    }
}

listenForTweets()

module.exports = app