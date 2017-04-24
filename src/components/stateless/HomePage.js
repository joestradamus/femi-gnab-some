import * as React from 'react'
import Graph from 'react-icons/lib/go/graph'
import LightBulb from 'react-icons/lib/go/light-bulb'
import Broadcast from 'react-icons/lib/go/broadcast'
import moment from 'moment'
import { Route, Link } from 'react-router'

import { Button } from './Button'

export const HomePage = () => (
    <div className="home">
        <div className="home-background">
            <div className="home-banner">
                <h1> Femi 'Gnab Some </h1>
                <h2> A Digital Account of Oppression </h2>
                <div className="home-buttons">
                <Button
                    buttonClass="home-button"
                    buttonIconClass="home-button-icon"
                    textClass="home-button-text"
                    link={`${JSON.stringify(moment())}`}
                    buttonIcon={ <LightBulb size={ 48 } /> }
                    text={ "Idea" }
                />
                <Button
                    buttonClass="home-button"
                    buttonIconClass="home-button-icon"
                    textClass="home-button-text"
                    link={`${JSON.stringify(moment())}`}
                    buttonIcon={ <Graph size={ 48 } /> }
                    text={ "Stats" }
                />
                <Button
                    buttonClass="home-button"
                    buttonIconClass="home-button-icon"
                    textClass="home-button-text"
                    link={`${JSON.stringify(moment())}`}
                    buttonIcon={ <Broadcast size={ 48 } /> }
                    text={ "Live Feed" }
                 />
                </div>
            </div>
        </div>
    </div>
)