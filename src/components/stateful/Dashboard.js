import React from 'react'
import { Button } from 'reactstrap'
import * as _ from 'lodash'

import * as tweets from '../../../tweets.json'
import * as util from '../../utilities'
import { DailySentimentChart } from '../stateless/charts/DailySentimentChart'
import { DailyScatterChart } from '../stateless/charts/DailyScatterChart'
import { DailyBreakdownChart } from '../stateless/charts/DailyBreakdownChart'
import { WordCountBarChart } from '../stateless/charts/WordCountBarChart'
import { DateModalButton } from './DateModalButton'

// async function getAllTweetsSince(day = moment().startOf('day')) {
//     const startDate = day.toDate()
//     const endDate = moment().endOf('day').toDate()
//     const url = `/api/tweets/${startDate}/${endDate}`
//     try {
//         return await fetch(url, { method: 'get'}).then(response => _.toArray(tweets))
//     } catch (e) {
//         window.alert(`Sorry, couldn't fetch from server: ${e}`)
//     }
// }

// asynchronously load data, then return it formatted
async function calculateAllSeriesWithTweets(tweets) {
    let filteredTweets = tweets.filter(tweet => tweet.user)
    const maleTweets = filteredTweets.filter(tweet => tweet.user.guessedGender === "Male")
    const femaleTweets = filteredTweets.filter(tweet => tweet.user.guessedGender === "Female")
    const data = {
        dailyScatterSeries: [
            { name: 'Male', data: util.createDailyScatterSeriesFor(maleTweets) },
            { name: 'Female', data: util.createDailyScatterSeriesFor(femaleTweets) }
        ],
        dailySentimentSeries: [
            { name: 'Male', data: util.createAverageHourlySeriesFor(maleTweets).hourly },
            { name: 'Male (Adjusted for follower count)', data: util.createAverageHourlySeriesFor(maleTweets).hourlyWeighted },
            { name: 'Female', data: util.createAverageHourlySeriesFor(femaleTweets).hourly },
            { name: 'Female (Adjusted for follower count)', data: util.createAverageHourlySeriesFor(femaleTweets).hourlyWeighted }
        ],
        dailyBreakdownSeries: [
            { name: 'Male', data: util.createHourlyTotalSeriesFor(maleTweets) },
            { name: 'Female', data: util.createHourlyTotalSeriesFor(femaleTweets) }
        ],
        wordChartSeries: [
            util.aggregateWordsUsedIn(maleTweets),
            util.aggregateWordsUsedIn(femaleTweets)
        ]
    }
    return await data
}


export class Dashboard extends React.Component {

    constructor() {
        super()
        this.state = this.getInitialState()
    }

    getInitialState = () => {
        return {
            loading: false,
            loaded: false,
            data: {}
        }
    }

    resetState = () => this.setState(this.getInitialState())

    handleClick = () => this.loadCharts()

    loadCharts = () => {
        this.setState({ loading: true, loaded: false, data: {} })
        calculateAllSeriesWithTweets(_.toArray(tweets)).then(series => this.load(series))
    }

    load = (data) => this.setState({ loading: false, loaded: true, data: data })

    render() {
        const createCharts = () => {
            return(
                <div>
                    <div className="modal-area">
                        <Button
                            className="date-modal-back-button"
                            onClick={ this.resetState.bind(this) }
                            color="info"
                            outline={ true }
                            size="lg"
                        >
                            Go back
                        </Button>
                    </div>
                    <div className="charts">
                        <DailyScatterChart data={ this.state.data.dailyScatterSeries } />
                        <DailyBreakdownChart data={ this.state.data.dailyBreakdownSeries } />
                        <DailySentimentChart data={ this.state.data.dailySentimentSeries } />
                        <WordCountBarChart
                            name="Male"
                            data={ this.state.data.wordChartSeries[0] }
                            color="rgb(0, 170, 160)"
                            colorLight="rgb(142, 210, 201)"
                        />
                        <WordCountBarChart
                            name="Female"
                            data={ this.state.data.wordChartSeries[1] }
                            color="rgb(255, 122, 90)"
                            colorLight="rgb(255, 184, 95)"
                        />
                    </div>
                </div>
            )
        }

        const handleRender = () => {
            if (this.state.loaded === true) {
                return(
                   <div> { createCharts() } </div>
                )
            }
            else if (this.state.loading === true) {
                return(
                    <div> <h1 className="home-banner"> Loading... </h1></div>
                )
            }
            else {
                return(
                    <div>
                        <div className="modal-area">
                            <DateModalButton dateButtons={[
                                <Button
                                    className="date-modal-button"
                                    onClick={ this.handleClick.bind(this) }
                                    color="info"
                                    size="lg"
                                >
                                    Load data
                                </Button>
                            ]}/>
                        </div>
                    </div>
                )
            }
        }

        return(
            <div className="chart-area">
                { handleRender() }
            </div>
        )
    }
}

