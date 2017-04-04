const Twit = require('twit')
const nlp = require('compromise')
const sentiment = require('sentiment')
const moment = require('moment')

const createStreamForTweetsWith = (credentials, coords = marquetteCampus) => {
    const twitter = new Twit(credentials)                                  // Authenticate application
    return twitter.stream('statuses/filter', { locations: coords })        // listen for tweets bounded by coords (default MU)
}

const marquetteCampus = [ // Top right, bottom left coordinates
    '-87.942874',         // longitude @ 8th/State St.
    '43.037529',          // latitude @ 8th/State St.
    '-87.9210',           // longitude @ 23rd/Michigan St.
    '43.0427577'          // latitude @ 23rd/Michigan St.
]

const extractDetailsFromRaw = (tweet) => {
    return {
        id: tweet.id,
        date: moment(tweet.created_at).subtract(5, 'hours').toDate(), // Account for UTC to Central Time conversion
        text: tweet.text,
        textSentiment: sentiment(tweet.text),        // get sentiment of text, as well as all positive, negative words
        textTopics: nlp(tweet.text).topics().data(), // get info on sentence's topics (people, places)
        user: {
            id: tweet.user.id,
            name: tweet.user.name,
            guessedGender: nlp(tweet.user.name).topics().data().length === 0 ? null : nlp(tweet.user.name).topics().data()[0].genderGuess,
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

const containsGenderedDetails = (tweet) => {
    return (
        tweet.textSentiment
        && tweet.textSentiment.score !== 0          // has some sentiment
        && tweet.user                               // has a clear user
        && tweet.user.guessedGender                 // user's gender is "guessable"
        && (tweet.user.guessedGender === "Female" || tweet.user.guessedGender === "Male")
    )
}

module.exports = {
    createStreamForTweetsWith: createStreamForTweetsWith,
    containsGenderedDetails: containsGenderedDetails,
    extractDetailsFromRaw: extractDetailsFromRaw
}