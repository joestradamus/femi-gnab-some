import * as React from 'react'

import { DailySentimentChart } from './DailySentimentChart'
import { DailyScatterChart } from './DailyScatterChart'
import { DailyBreakdownChart } from './DailyBreakdownChart'
import { WordCountBarChart } from './WordCountBarChart'

export const ChartArea = (props) => (
    <div className="charts">
        <DailyScatterChart data={ props.dailyScatterSeries } />
        <DailyBreakdownChart data={ props.dailyBreakdownSeries } />
        <DailySentimentChart data={ props.dailySentimentSeries } />
        <WordCountBarChart
            name="Male"
            data={ props.wordSeriesMale }
            color="rgb(0, 170, 160)"
            colorLight="rgba(0, 170, 160, .7)"
        />
        <WordCountBarChart
            name="Female"
            data={ props.wordSeriesFemale }
            color="rgb(255, 64, 129)"
            colorLight="rgba(255, 64, 129, .7)"
        />
    </div>
)