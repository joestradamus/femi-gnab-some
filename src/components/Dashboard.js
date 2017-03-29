import React from 'react'

import { DailySentimentChart } from './charts/DailySentimentChart'
import { DailyScatterChart } from './charts/DailyScatterChart'
import { DailyBreakdownChart } from './charts/DailyBreakdownChart'

export const Dashboard = () => (
    <div className="chart-area">
        <h1 className="chart-area-title"> Dashboard </h1>
        <div className="main-chart">
            <DailyBreakdownChart />
        </div>
        <div className="side-charts">
            <DailySentimentChart />
            <DailyScatterChart />
        </div>
    </div>
)

