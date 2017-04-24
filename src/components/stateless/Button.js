import * as React from 'react'

export const Button = (props) => (
    <div className={ props.buttonClass }>
        <a href={ props.link }>
            <div>
                <div className={ props.buttonIconClass}>
                    { props.buttonIcon }
                </div>
                <div className={ props.textClass }>
                    { props.text }
                </div>
            </div>
        </a>
    </div>
)