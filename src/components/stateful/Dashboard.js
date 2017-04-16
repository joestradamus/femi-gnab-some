import React from 'react'
import { Button } from 'reactstrap'
import * as _ from 'lodash'
import moment from 'moment'

import * as util from '../../utilities'
import { DailySentimentChart } from '../stateless/charts/DailySentimentChart'
import { DailyScatterChart } from '../stateless/charts/DailyScatterChart'
import { DailyBreakdownChart } from '../stateless/charts/DailyBreakdownChart'
import { WordCountBarChart } from '../stateless/charts/WordCountBarChart'
import { DateModalButton } from './DateModalButton'
import loader from '../../../public/loader.svg'

async function getAllTweetsSince(day = moment().startOf('day')) {
    const startDate = day.toDate()
    const endDate = moment().endOf('day').toDate()
    const url = `/api/tweets/${startDate}/${endDate}`
    try {
        return await fetch(url, { method: 'get'}).then(response => { return response })
    } catch (e) {
        window.alert(`Sorry, couldn't fetch data from the server: ${e}`)
    }
}

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

    loadSinceDate = (date) => this.loadCharts(date)

    loadCharts = (date) => {
        this.setState({ loading: true, loaded: false, data: {} })
        getAllTweetsSince(date).then(response => response.json().then(tweets => 
            calculateAllSeriesWithTweets(tweets).then(series => this.load(series))))
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
                    <div> 
                        <img src={ loader } className="loading-icon" alt="loading icon" />
                    </div>
                )
            }
            else {
                return(
                    <div>
                        <div className="modal-area">
                            <DateModalButton dateButtons={[
                                <Button
                                    key={ 0 }
                                    className="date-modal-button"
                                    onClick={ this.loadSinceDate.bind(this, moment().subtract(1, 'days')) }
                                    color="info"
                                    block={ true }
                                    size="lg"
                                >
                                    Yesterday
                                </Button>,
                                <Button
                                    key={ 1 }
                                    className="date-modal-button"
                                    onClick={ this.loadSinceDate.bind(this, moment().subtract(7, 'days')) }
                                    color="info"
                                    block={ true }
                                    size="lg"
                                >
                                    Last 7 Days
                                </Button>,
                                <Button
                                    key={ 2 }
                                    className="date-modal-button"
                                    onClick={ this.loadSinceDate.bind(this, moment().subtract(30, 'days')) }
                                    color="info"
                                    block={ true }
                                    size="lg"
                                >
                                    Last 30 days
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

