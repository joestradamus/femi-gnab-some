import React, { Component } from 'react'
import injectTapEventPlugin from 'react-tap-event-plugin'

import { Dashboard } from './components/stateful/Dashboard'

injectTapEventPlugin()
class App extends Component {
    render() {
        return (
            <div>
                <Dashboard />
            </div>
        )
  }
}

export default App
