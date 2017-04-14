import React, { Component } from 'react'
import { HomePage } from './HomePage'
import { Dashboard } from '../stateful/Dashboard'

const App = () => {
    return (
        <div>
            <HomePage />
            <Dashboard />
        </div>
    )
}

export default App
