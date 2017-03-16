import React, { Component } from 'react'
import Twit from 'twit'
import nlp from 'compromise'
import sentiment from 'sentiment'
import * as credentials from '../credentials.json'

class App extends Component {
  render() {
    // const analysisText = `Deborah is the best person I know. She's great at math. Bob Marley is ok. Jimi Hendrix is ok.
    //   Barbara Bush is my favorite Bush`
    // console.log(nlp(analysisText).people().data())
    // console.log(sentiment(analysisText))

    return (
      <div className="App">
      </div>
    )
  }
}

export default App
