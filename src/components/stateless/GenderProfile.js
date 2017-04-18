import React from 'react'
import Avatar from 'material-ui/Avatar'
import Chip from 'material-ui/Chip'

export const GenderProfile = (props) => (
    <div>
        <h1> { props.name } Users </h1>
        <Chip>
          <Avatar size={ 32 }> A </Avatar>
          Text Avatar Chip
        </Chip>
    </div>
)