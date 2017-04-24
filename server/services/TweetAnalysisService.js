const Twit = require('twit')
const nlp = require('compromise')
const sentiment = require('sentiment')
const moment = require('moment')

const createStreamForTweetsWith = (credentials, coords = marquetteCampus) => {
    const twitter = new Twit(credentials)                                  // Authenticate application
    return twitter.stream('statuses/filter', { locations: coords })        // listen for tweets bounded by coords (default MU)
}

const marquetteCampus = [ // bottom left -> top right coordinate system
    '-87.942874',         // longitude @ 24th/Michigan.
    '43.037529',          // latitude @ 24th/Michigan.
    '-87.9210',           // longitude @ 8th/State St.
    '43.0427577'          // latitude @ 8th/State St.
];

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
        coordinates: tweet.coordinates,
        inResponseTo: tweet.in_reply_to_screen_name,
        entities: tweet.entities
    }
}

const containsGenderAndSentiment = (tweet) => {
    return (
        tweet.textSentiment                         // has some sentiment
        && tweet.user                               // has a clear user
        && tweet.user.guessedGender                 // user's gender is "guessable"
        && (tweet.user.guessedGender === "Female" || tweet.user.guessedGender === "Male")
    )
}

module.exports = {
    createStreamForTweetsWith: createStreamForTweetsWith,
    containsGenderAndSentiment: containsGenderAndSentiment,
    extractDetailsFromRaw: extractDetailsFromRaw
}