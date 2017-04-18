import React from 'react'
import * as _ from 'lodash'
import moment from 'moment'
import DatePicker from 'material-ui/DatePicker'
import RaisedButton from 'material-ui/RaisedButton'
import getMuiTheme from 'material-ui/styles/getMuiTheme'
import baseTheme from 'material-ui/styles/baseThemes/lightBaseTheme'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'

import * as util from '../../utilities'
import { ChartArea } from '../stateless/charts/ChartArea'
import { LoadingIcon } from '../stateless/LoadingIcon'
import { DateSelectorModal } from './DateSelectorModal'

async function getAllTweetsSince(startDate, endDate) {
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
            { name: 'Male (multiplied by follower count)', data: util.createAverageHourlySeriesFor(maleTweets).hourlyWeighted },
            { name: 'Female', data: util.createAverageHourlySeriesFor(femaleTweets).hourly },
            { name: 'Female (multiplied by follower count)', data: util.createAverageHourlySeriesFor(femaleTweets).hourlyWeighted }
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
            data: {},
            minDate: undefined,
            maxDate: undefined
        }
    }

    resetState = () => this.setState(this.getInitialState())

    loadDateRange = (startDate, endDate = moment().endOf('day').toDate()) => this.loadCharts(startDate, endDate)

    loadCharts = (startDate, endDate) => {
        this.setState({ loading: true, loaded: false, data: {} })
        getAllTweetsSince(startDate, endDate).then(response => response.json().then(tweets => 
            calculateAllSeriesWithTweets(tweets).then(series => this.load(series))))
    }

    load = (data) => this.setState({ data: data, loading: false, loaded: true })

    updateMaxDate = (event, date) => {
        this.setState({ maxDate: moment(date).endOf('day').toDate() })
        if (this.state.minDate !== undefined && this.state.minDate < this.state.maxDate)
            this.loadDateRange(this.state.minDate, this.state.maxDate)
    }

    updateMinDate = (event, date) => {
        this.setState({ minDate: moment(date).startOf('day').toDate() })
        if (this.state.maxDate !== undefined && this.state.minDate < this.state.maxDate)
            this.loadDateRange(this.state.minDate, this.state.maxDate)
    }

    render() {
        const handleRender = () => {
            const dateUnavailableInDb = (date) => {
                return (date <= moment().subtract(1, 'month').toDate() || date > moment().toDate())
            }
            const datePickers = () => (
                <div>
                    <DatePicker
                        onChange={ this.updateMinDate } 
                        floatingLabelText="Pick a start date" 
                        shouldDisableDate={ dateUnavailableInDb } 
                        className="date-picker" 
                        autoOk={ true } 
                    />
                    <DatePicker 
                        onChange={ this.updateMaxDate }
                        floatingLabelText="Pick an end date" 
                        shouldDisableDate={ dateUnavailableInDb } 
                        className="date-picker"
                        autoOk={ true }
                    />
                </div>
            )
            if (this.state.loading === true) return <LoadingIcon />
            else if (this.state.loaded === true) {
                return(
                    <div>
                        <MuiThemeProvider muiTheme={ getMuiTheme(baseTheme) }>
                            <div>
                                <RaisedButton 
                                    className='dashboard-button'
                                    onClick={ this.resetState.bind(this) } 
                                    label="Choose another date range"
                                />
                                <RaisedButton 
                                    className='dashboard-button'
                                    primary={ true } 
                                    onClick={ this.resetState.bind(this) } 
                                    label="See Male Stats"
                                />
                                <RaisedButton 
                                    className='dashboard-button'
                                    secondary={ true } 
                                    onClick={ this.resetState.bind(this) } 
                                    label="See Female Stats"
                                />
                            </div>
                        </MuiThemeProvider>
                        <ChartArea 
                            dailyScatterSeries={ this.state.data.dailyScatterSeries }
                            dailyBreakdownSeries={ this.state.data.dailyBreakdownSeries }
                            dailySentimentSeries={ this.state.data.dailySentimentSeries }
                            wordSeriesMale={ this.state.data.wordChartSeries[0] }
                            wordSeriesFemale={ this.state.data.wordChartSeries[1] }
                        />
                    </div>
                    
                )
            }
            else {
                return(
                    <div>
                        <div className="modal-area">
                            <DateSelectorModal modalItems={[
                                <div key={ 0 }>
                                    <MuiThemeProvider muiTheme={ getMuiTheme(baseTheme) }>
                                        { datePickers() }
                                    </MuiThemeProvider>
                                </div>
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

