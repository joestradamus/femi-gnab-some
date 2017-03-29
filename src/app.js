import React, { Component } from 'react'

import { HomePage } from './components/HomePage'
import { Dashboard } from './components/Dashboard'

class App extends Component {
    render() {
        return (
            <div>
                <HomePage />
                <Dashboard />
            </div>
        )
  }
}

export default App
