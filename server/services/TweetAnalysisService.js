const Twit = require('twit')
const nlp = require('compromise')
const sentiment = require('sentiment')

const createStreamForTweetsWith = (credentials, coords = marquetteCampus) => {
    const twitter = new Twit(credentials)                                // Authenticate application
    return twitter.stream('statuses/filter', {locations: coords})        // listen for tweets bounded by coords (default MU)
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
        date: tweet.created_at,
        text: tweet.text,
        textSentiment: sentiment(tweet.text),        // get sentiment of text, as well as all positive, negative words
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

const containsRelevantDetails = (tweet) => {
    return (
        tweet.textSentiment
        && tweet.textSentiment.score !== 0          // has some sentiment
        && tweet.user                               // has a clear user
        && tweet.user.guessedGender.length !== 0    // user's gender is "guessable"
        && (tweet.user.guessedGender[0].genderGuess === "Female" || tweet.user.guessedGender[0].genderGuess === "Male")
    )
}

module.exports = {
    createStreamForTweetsWith: createStreamForTweetsWith,
    containsRelevantDetails: containsRelevantDetails,
    extractDetailsFromRaw: extractDetailsFromRaw
}