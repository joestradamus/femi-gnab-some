import React from 'react'

import { ProfileCard } from './ProfileCard'

/**
 *  series.positive/negative = [
 *      {
 *          count: number,
 *          text: string
 *      }] 
 */
export const GenderProfile = (props) => (
    <div>
        <ProfileCard 
            text={ `words used by ${props.name} users when referencing male users` }
            series={{
                positive: props.male.positive,
                negative: props.male.negative
            }}
        />
        <ProfileCard 
            text={ `words used by ${props.name} users when referencing female users` }
            series={{
                positive: props.female.positive,
                negative: props.female.negative
            }}
        />
    </div>
)