import React from 'react'
import ReactDOM from 'react-dom'
import App from '../../src/components/stateless/app.tsx'

describe('App tests', () => {
  it('renders without crashing', () => {
    const div = document.createElement('div')
    ReactDOM.render(<App />, div);
  })
})

