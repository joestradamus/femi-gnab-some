import React, { Component } from 'react'
import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'
import RaisedButton from 'material-ui/RaisedButton'

export class DateSelectorModal extends Component {

    constructor(props) {
        super(props)
        this.state = {
            open: false
        }
    }

    toggle = () => this.setState({ open: !this.state.open })

    render = () => (
        <div>
            <RaisedButton
                className="date-modal-button"
                secondary={ true }
                onClick={ this.toggle.bind(this) }
            >
                Select a timeframe
            </RaisedButton>
            <Dialog
                title="Select a timeframe"
                actions={[
                    <FlatButton
                        label="Cancel"
                        primary={ true }
                        onTouchTap={ this.toggle.bind(this) }
                    />
                ]}
                modal={ true }
                open={ this.state.open }
                onRequestClose={ () => this.setState({ open: false })}
            >
                { this.props.modalItems }
            </Dialog>
        </div>
    )
}