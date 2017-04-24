import React from 'react'

import { ProfileCard } from './ProfileCard'
import { AverageSentimentGauge } from '../stateless/charts/AverageSentimentGauge'

export const GenderProfile = (props) => (
    <div>
        <AverageSentimentGauge
            title={ props.name }
            maleAverage={ props.male.sentiment.value/props.male.sentiment.totalCount }
            femaleAverage={ props.female.sentiment.value/props.female.sentiment.totalCount }
        />
        <ProfileCard 
            text={ `${props.name} users referring to male subject`}
            allSeries={{
                positive: props.male.positive,
                negative: props.male.negative
            }}
        />
        <ProfileCard 
            text={ `${props.name} users referring to female subject`}
            allSeries={{
                positive: props.female.positive,
                negative: props.female.negative
            }}
        />
    </div>
)