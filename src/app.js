import React, { Component } from 'react'
import injectTapEventPlugin from 'react-tap-event-plugin'
import getMuiTheme from 'material-ui/styles/getMuiTheme'
import baseTheme from 'material-ui/styles/baseThemes/lightBaseTheme'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'

import { Dashboard } from './components/stateful/Dashboard'

injectTapEventPlugin()
class App extends Component {
    render() {
        return (
            <div>
                <MuiThemeProvider muiTheme={ getMuiTheme(baseTheme) }>
                    <Dashboard />
                </MuiThemeProvider>
            </div>
        )
  }
}

export default App
