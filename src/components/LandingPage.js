import * as React from 'react'
import Graph from 'react-icons/lib/go/graph'
import LightBulb from 'react-icons/lib/go/light-bulb'
import Broadcast from 'react-icons/lib/go/broadcast'

export const LandingPage = () => {
    return (
        <div className="App">
            <div className="App-Background">
                <div className="App-Banner">
                    <h1>
                        Femi-Gnab-Some
                    </h1>
                    <h2>
                        A Digital Account of Oppression
                    </h2>
                    <div className="App-Buttons">
                        <a href="#goons">
                            <LightBulb size={ 48 } />
                        </a>
                        <a href="#goons">
                            <Graph size={ 48 } />
                        </a>
                        <a href="#goons">
                            <Broadcast size={ 48 } />
                        </a>
                    </div>
                </div>
            </div>
        </div>
    )
}