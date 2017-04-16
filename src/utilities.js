import moment from 'moment'
import * as _ from 'lodash'

/**
 *
 * Create an array of average sentiments (each index in output array corresponds to the hour of day)
 *
 * @param tweets - an array of tweets
 * @returns array of average sentiment
 */
export const createAverageHourlySeriesFor = (tweets) => {
    const hours = new Map()
    const hoursWithFollowersWeightedSet = new Map()
    _.range(24).forEach(number => {
            hours.set(number, { totalSentiment: 0, totalTweets: 0 })
            hoursWithFollowersWeightedSet.set(number, { totalSentiment: 0, totalTweets: 0 })
        }
    )
    // Initialize map
    tweets.forEach(tweet => {
        if (tweet.textSentiment) {
            const date = moment.parseZone(tweet.date) // account for UTC to central time
            hours.set(date.hour(), {
                totalSentiment: hours.get(date.hour()).totalSentiment + tweet.textSentiment.score,
                totalTweets: hours.get(date.hour()).totalTweets + 1
            })
            hoursWithFollowersWeightedSet.set(date.hour(), {
                totalSentiment: hours.get(date.hour()).totalSentiment + (tweet.textSentiment.score * tweet.user.followerCount),
                totalTweets: hours.get(date.hour()).totalTweets + 1
            })
        }
    })
    const hourly = _.range(24).map(hour => hours.get(hour).totalSentiment / hours.get(hour).totalTweets)
    const hourlyWeighted = _.range(24).map(hour =>
        hoursWithFollowersWeightedSet.get(hour).totalSentiment / hours.get(hour).totalTweets)
    return {
        hourly: hourly,
        hourlyWeighted: hourlyWeighted
    }
}

/**
 *
 * @param tweets - an array of tweets
 * @returns {Array} of coordinate-arrays e.g. [ [0.2, 3], [2.1, 5], [8, -4] ], where x is time, y is sentiment
 */
export const createDailyScatterSeriesFor = (tweets) => {
    const series = []
    tweets.forEach(tweet => {
        if (tweet.textSentiment) {
            const date = moment.parseZone(tweet.date)
            const timeAsReadableString = date.format('h:mm a')
            const dateAsReadableString = date.format('MM/DD')
            const dataPoint = {
                x: moment.parseZone(tweet.date).toDate(), // Account for UTC to Central Time
                y: tweet.textSentiment.score,
                tweet: tweet,
                timeString: timeAsReadableString,
                dateString: dateAsReadableString
            }
            series.push(dataPoint)
        }
    })
    return series
}

/**
 *
 * @param tweets - an array of tweets
 * @returns {Array} of coordinate-arrays e.g. [ [0.2, 3], [2.1, 5], [8, -4] ], where x is time, y is sentiment
 */
export const createHourlyTotalSeriesFor = (tweets) => {
    const hours = new Map()
    _.range(24).forEach(number => hours.set(number, 0)) // Initialize map
    tweets.forEach(tweet => {
        if (tweet.textSentiment) {
            const hour = moment.parseZone(tweet.date).hour() // account for UTC to Central Time
            hours.set(hour, hours.get(hour) + 1)
        }
    })
    return _.range(24).map(hour => hours.get(hour))
}

export const aggregateWordsUsedIn = (tweets) => {
    const wordCount = new Map()
    _.toArray(tweets).filter(tweet => tweet.textSentiment && tweet.textSentiment.words)
        .forEach(tweet => tweet.textSentiment.words // make sure the user said something sentimental
            .forEach(word => {
                if (word !== "") { // Ignore word if it's the empty string token
                    wordCount.has(word)
                        ? wordCount.set(word, wordCount.get(word) + 1) // increment count by one
                        : wordCount.set(word, 1) // set to one if not already in map
                }
            }))
    // turn map into array of objects
    const wordArray = _.toArray(wordCount).map(array => {
        const word = array[0]
        const count = array[1]
        return {
            name: word,
            y: count
        }
    })
    const sortedWords = _.sortBy(wordArray, ['y', 'word']) // sort in increasing order by count of word, then alphabetically
    const top100WordsSorted = _.takeRight(sortedWords, 100)
    return top100WordsSorted
}