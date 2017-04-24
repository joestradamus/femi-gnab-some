import React, { Component } from 'react'
import * as _ from 'lodash'
import moment from 'moment'
import DatePicker from 'material-ui/DatePicker'
import { Tabs, Tab } from 'material-ui/Tabs'
import FaMars from 'react-icons/lib/fa/mars' // male
import FaVenus from 'react-icons/lib/fa/venus' // female
import FaCalendar from 'react-icons/lib/fa/calendar'
import FaAreaChart from 'react-icons/lib/fa/area-chart'

import * as util from '../../utilities'
import { ChartArea } from '../stateless/charts/ChartArea'
import { GenderProfile } from '../stateless/GenderProfile'
import { LoadingIcon } from '../stateless/LoadingIcon'
import { DateSelectorModal } from './DateSelectorModal'


const VIEWS = {
    SELECT_DATE: "SELECT_DATE",
    LOADING: "LOADING",
    OVERVIEW: "OVERVIEW",
    MALE_STATS: "MALE_STATS",
    FEMALE_STATS: "FEMALE_STATS",
}

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
    let maleTweets = []
    let femaleTweets = []
    filteredTweets.forEach(tweet => tweet.user.guessedGender === "Male" ? maleTweets.push(tweet) : femaleTweets.push(tweet))
    const data = {
        dailyScatterSeries: [
            { name: 'Male', data: util.createDailyScatterSeriesFor(maleTweets)},
            { name: 'Female', data: util.createDailyScatterSeriesFor(femaleTweets) }
        ],
        dailySentimentSeries: [
            { name: 'Male', data: util.createAverageHourlySeriesFor(maleTweets).hourly },
            { name: 'Male (multiplied by follower count)', data: util.createAverageHourlySeriesFor(maleTweets).hourlyWeighted },
            { name: 'Female', data: util.createAverageHourlySeriesFor(femaleTweets).hourly },
            { name: 'Female (multiplied by follower count)', data: util.createAverageHourlySeriesFor(femaleTweets).hourlyWeighted }
        ],
        dailyBreakdownSeries: [
            { name: 'Male-authored tweets', data: util.createHourlyTotalSeriesFor(maleTweets) },
            { name: 'Female-authored tweets', data: util.createHourlyTotalSeriesFor(femaleTweets) },
        ],
        wordChartSeries: [
            util.aggregateWordsUsedIn(maleTweets),
            util.aggregateWordsUsedIn(femaleTweets)
        ],
        genderProfiles: {
            male: util.analyzeSentimentOfGenderReferences(maleTweets),
            female: util.analyzeSentimentOfGenderReferences(femaleTweets)
        }
    }
    return await data
}


export class Dashboard extends Component {

    constructor() {
        super()
        this.state = this.getInitialState()
    }

    getInitialState = () => {
        return {
            view: VIEWS.SELECT_DATE,
            data: {},
            minDate: undefined,
            maxDate: undefined
        }
    }

    loadDateRange = (startDate, endDate = moment().endOf('day').toDate()) => this.loadCharts(startDate, endDate)

    loadCharts = (startDate, endDate) => {
        this.setState({ view: VIEWS.LOADING, data: {} })
        getAllTweetsSince(startDate, endDate).then(response => response.json().then(tweets => 
            calculateAllSeriesWithTweets(tweets).then(series => this.load(series))))
    }

    load = (data) => this.setState({ data: data, view: VIEWS.OVERVIEW })

    triggerOverview = () => this.setState({ view: VIEWS.OVERVIEW })

    triggerMaleStatsView = () => this.setState({ 
        view: VIEWS.MALE_STATS, 
        data: this.state.data 
    })

    triggerFemaleStatsView = () => this.setState({ 
        view: VIEWS.FEMALE_STATS,
        data: this.state.data 
    })

    triggerCalendarView = () => this.setState({ view: VIEWS.SELECT_DATE, minDate: undefined, maxDate: undefined })

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
            const dateUnavailableInDb = (date) => { return (date <= moment().subtract(1, 'month').toDate() || date > moment().toDate()) }
            
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
            switch (this.state.view) {
                case VIEWS.SELECT_DATE:
                    return (
                        <div className="modal-area">
                            <DateSelectorModal modalItems={[
                                <div key={ 0 }>
                                    { datePickers() }
                                </div>
                            ]}/>
                        </div>
                    )
                case VIEWS.LOADING:
                    return <LoadingIcon />
                case VIEWS.OVERVIEW:
                    return (
                        <div>
                            <ChartArea 
                                dailyScatterSeries={ this.state.data.dailyScatterSeries }
                                dailyBreakdownSeries={ this.state.data.dailyBreakdownSeries }
                                dailySentimentSeries={ this.state.data.dailySentimentSeries }
                                wordSeriesMale={ this.state.data.wordChartSeries[0] }
                                wordSeriesFemale={ this.state.data.wordChartSeries[1] }
                            />
                        </div>
                    )
                case VIEWS.MALE_STATS:
                    return (
                        <div>
                            <GenderProfile 
                                name="male"
                                male={{
                                    sentiment: this.state.data.genderProfiles.male.maleSentiment,
                                    positive: this.state.data.genderProfiles.male.malePositive,
                                    negative: this.state.data.genderProfiles.male.maleNegative,
                                }}
                                female={{
                                    sentiment: this.state.data.genderProfiles.male.femaleSentiment,
                                    positive: this.state.data.genderProfiles.male.femalePositive,
                                    negative: this.state.data.genderProfiles.male.femaleNegative,
                                }}
                            />
                        </div>
                    )
                case VIEWS.FEMALE_STATS:
                    return (
                        <div>
                            <GenderProfile 
                                name="female"
                                male={{
                                    sentiment: this.state.data.genderProfiles.female.maleSentiment,
                                    positive: this.state.data.genderProfiles.female.malePositive,
                                    negative: this.state.data.genderProfiles.female.maleNegative,
                                }}
                                female={{
                                    sentiment: this.state.data.genderProfiles.female.femaleSentiment,
                                    positive: this.state.data.genderProfiles.female.femalePositive,
                                    negative: this.state.data.genderProfiles.female.femaleNegative,
                                }}
                            />
                        </div>
                    )
                default:
                    return <div/>
            }
        }

        return (
            <div className="dashboard-area">
                <Tabs 
                    tabItemContainerStyle={{ 
                        paddingTop: '2vh',
                        paddingBottom: '2vh',
                        backgroundColor: '#2a2a2b',
                        boxShadow: '0 0 3px 0px black',
                    }}
                    inkBarStyle={{
                        marginBottom: '5vh'
                    }}
                >
                    <Tab
                        icon={ <FaCalendar size={ 40 }/> }
                        onClick={ this.triggerCalendarView.bind(this) }
                    />
                    <Tab
                        icon={ <FaAreaChart size={ 40 }/> }
                        onClick={ this.triggerOverview.bind(this) }
                    />
                    <Tab
                        icon={ <FaMars size={ 40 }/> }
                        onClick={ this.triggerMaleStatsView.bind(this) }
                    />
                    <Tab
                        icon={ <FaVenus size={ 40 }/> }
                        onClick={ this.triggerFemaleStatsView.bind(this) }
                    />
                </Tabs>
                { handleRender() }
            </div>
        )
    }
}

