import React, { Component } from 'react'

import { HomePage } from './components/HomePage'
import { DailySentimentChart } from './components/DailySentimentChart'

class App extends Component {
    render() {
        return (
            <div>
              <HomePage />
              <DailySentimentChart />
            </div>
        )
  }
}

export default App
