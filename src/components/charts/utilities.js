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
    _.range(24).forEach(number => hours.set(number, { totalSentiment: 0, totalTweets: 0 })) // Initialize map
    _.toArray(tweets).forEach((tweet) => {
        if (tweet.textSentiment) {
            const date = moment.parseZone(tweet.date).subtract(5, 'hours') // account for UTC to central time
            const dataPoint = {
                totalSentiment: hours.get(date.hour()).totalSentiment + tweet.textSentiment.score,
                totalTweets: hours.get(date.hour()).totalTweets + 1
            }
            hours.set(date.hour(), dataPoint)
        }
    })
    return _.range(24).map((hour) => (
        hours.get(hour).totalSentiment / hours.get(hour).totalTweets
    ))
}

/**
 *
 * @param tweets - an array of tweets
 * @returns {Array} of coordinate-arrays e.g. [ [0.2, 3], [2.1, 5], [8, -4] ], where x is time, y is sentiment
 */
export const createDailyScatterSeriesFor = (tweets) => {
    const series = []
    _.toArray(tweets).forEach((tweet) => {
        if (tweet.textSentiment) {
            const date = moment.parseZone(tweet.date).local()
            const timeAsReadableString = date.format('h:mm a')
            const dateAsReadableString = date.format('MM/DD')
            const dataPoint = {
                x: moment.parseZone(tweet.date).subtract(5, 'hours').toDate(), // Account for UTC to Central Time
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
    _.toArray(tweets).forEach((tweet) => {
        if (tweet.textSentiment) {
            const hour = moment.parseZone(tweet.date).subtract(5, 'hours').hour() // account for UTC to Central Time
            hours.set(hour, hours.get(hour) + 1)
        }
    })
    return _.range(24).map(hour => hours.get(hour))
}