import moment from 'moment'
import * as _ from 'lodash'


/**
 *
 * Create an array of average sentiments (each index in output array corresponds to the hour of day)
 *
 * @param tweets - an array of tweets
 * @returns array of average sentiment
 */
export const createAverageDailySeriesFor = (tweets) => {
    const hours = new Map()
    _.range(24).forEach(number => hours.set(number, { totalSentiment: 0, totalTweets: 0 })) // Initialize map
    _.toArray(tweets).forEach((tweet) => {
        if (tweet.textSentiment) {
            const hour = moment(tweet.date).hour()
            const dataPoint = {
                totalSentiment: hours.get(hour).totalSentiment + tweet.textSentiment.score,
                totalTweets: hours.get(hour).totalTweets + 1
            }
            hours.set(hour, dataPoint)
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
export const createDailySeriesFor = (tweets) => {
    const hours = []
    _.toArray(tweets).forEach((tweet) => {
        if (tweet.textSentiment) {
            const hour = moment(tweet.date).hour()
            const minute = moment(tweet.date).minute()
            const xValue = hour + (minute / 60)
            const dataPoint = [xValue, tweet.textSentiment.score]
            hours.push(dataPoint)
        }
    })
    return hours
}

/**
 *
 * @param tweets - an array of tweets
 * @returns {Array} of coordinate-arrays e.g. [ [0.2, 3], [2.1, 5], [8, -4] ], where x is time, y is sentiment
 */
export const createTotalHourlySeriesFor = (tweets) => {
    const hours = new Map()
    _.range(24).forEach(number => hours.set(number, 0)) // Initialize map
    _.toArray(tweets).forEach((tweet) => {
        if (tweet.textSentiment) {
            const hour = moment(tweet.date).hour()
            hours.set(hour, hours.get(hour) + 1)
        }
    })
    return _.range(24).map(hour => hours.get(hour))
}