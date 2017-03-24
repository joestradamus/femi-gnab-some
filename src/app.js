import React, { Component } from 'react'

import { LandingPage } from './components/LandingPage'
import { DailySentimentChart } from './components/DailySentimentChart'

class App extends Component {
    render() {
        return (
            <div>
              <LandingPage />
              <DailySentimentChart />
            </div>
        )
  }
}

export default App
