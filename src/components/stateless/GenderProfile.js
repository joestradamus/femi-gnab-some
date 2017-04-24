import React from 'react'

import { ProfileCard } from './ProfileCard'

export const GenderProfile = (props) => (
    <div>
        <ProfileCard 
            text={ `${props.name} users referring to male subject
                Average Sentiment: ${props.male.sentiment.value/props.male.sentiment.totalCount}`}
            allSeries={{
                positive: props.male.positive,
                negative: props.male.negative
            }}
        />
        <ProfileCard 
            text={ `${props.name} users referring to female subject
                Average Sentiment: ${props.female.sentiment.value/props.female.sentiment.totalCount}`}
            allSeries={{
                positive: props.female.positive,
                negative: props.female.negative
            }}
        />
    </div>
)