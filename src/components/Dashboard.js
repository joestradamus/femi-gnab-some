import React from 'react'
import { Button } from 'reactstrap'
import moment from 'moment'
import * as _ from 'lodash'

import * as util from './charts/utilities'
import { DailySentimentChart } from './charts/DailySentimentChart'
import { DailyScatterChart } from './charts/DailyScatterChart'
import { DailyBreakdownChart } from './charts/DailyBreakdownChart'
import { DateModalButton } from './DateModalButton'

async function getAllTweetsForDay(day = moment().startOf('day')) {
    try {
        const url = `/api/tweets/${day.startOf('day')}/${day.endOf('day')}`
        return await fetch('/api/tweets', { method: 'get'}).then(response => response.json())
    } catch (e) {
        window.alert(`Sorry, couldn't fetch from server: ${e}`)
    }
}
// asynchronously load data, then return it formatted
async function calculateAllSeriesWithTweets(tweets) {
    const data = {
        dailyScatterSeries: [
            { name: 'Male', data: util.createDailyScatterSeriesFor(tweets.filter(tweet => tweet.user.guessedGender === "Male")) },
            { name: 'Female', data: util.createDailyScatterSeriesFor(tweets.filter(tweet => tweet.user.guessedGender === "Female")) }
        ],
        dailySentimentSeries: [
            { name: 'Male', data: util.createAverageHourlySeriesFor(tweets.filter(tweet => tweet.user.guessedGender === "Male")) },
            { name: 'Female', data: util.createAverageHourlySeriesFor(tweets.filter(tweet => tweet.user.guessedGender === "Female")) },
            { name: 'Average', data: util.createAverageHourlySeriesFor(tweets) }
        ],
        dailyBreakdownSeries: [
            { name: 'Male', data: util.createHourlyTotalSeriesFor(tweets.filter(tweet => tweet.user.guessedGender === "Male")) },
            { name: 'Female', data: util.createHourlyTotalSeriesFor(tweets.filter(tweet => tweet.user.guessedGender === "Female")) }
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
        this.setState({ loading: !this.state.loading, loaded: this.state.loaded, data: this.state.data })
        getAllTweetsForDay().then(tweets => calculateAllSeriesWithTweets(tweets))
            .then(series => this.load(series))
    }

    load = (data) => this.setState({ loading: !this.state.loading, loaded: !this.state.loaded, data: data })

    render() {
        const createCharts = () => {
            return (
                <div>
                    <div className="modal-area">
                        <Button
                            className="date-modal-back-button"
                            onClick={ this.resetState.bind(this) }
                            color="info"
                            outline={ true }
                        >
                            Select another date
                        </Button>
                    </div>
                    <DailyScatterChart allSeries={ this.state.data.dailyScatterSeries } />
                    <div className="auxiliary-charts">
                        <DailyBreakdownChart allSeries={ this.state.data.dailyBreakdownSeries } />
                        <DailySentimentChart allSeries={ this.state.data.dailySentimentSeries } />
                    </div>
                </div>
            )
        }

        const handleRender = () => {
            if (this.state.loaded) {
                return(
                   <div> { createCharts() } </div>
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
                                >
                                    Today
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

