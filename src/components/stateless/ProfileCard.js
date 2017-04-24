import * as React from 'react'
import Avatar from 'material-ui/Avatar'
import Paper from 'material-ui/Paper'

export const ProfileCard = (props) => (
    <div className="profile-card">
        <h1> { props.text } </h1>
        <div>
            <h2>
                Positive Words Used (number = total count)
            </h2>
            { props.allSeries.positive.map(word => (
                <Paper className="word-card" zDepth={ 3 } key={ word.text }>
                    <div className="positive-word-card">
                        <Avatar size={ 32 } className="word-count"> { word.count } </Avatar>
                        <div className="word-text"> { word.text } </div>
                    </div>
                </Paper>
            ))}
        </div>
        <div>
            <h2>
                Negative Words Used (number = total count)
            </h2>
            { props.allSeries.negative.map(word => (
                <Paper className="word-card" zDepth={ 3 } key={ word.text }>
                    <div className="negative-word-card">
                        <Avatar size={ 32 } className="word-count"> { word.count } </Avatar>
                        <div className="word-text"> { word.text } </div>
                    </div>
                </Paper>
            ))}
        </div>
    </div>
)