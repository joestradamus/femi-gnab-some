import * as React from 'react'
import loader from '../../../public/loader.svg'

export const LoadingIcon = () => (
    <div> 
        <img src={ loader } className="loading-icon" alt="loading icon" />
    </div>
)