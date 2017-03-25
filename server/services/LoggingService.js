const winston = require('winston')
const moment = require('moment')

const fileName = `${ moment().month() }/${ moment().day() }/${ moment().year() }-log-details.txt`

const setupProductionLogger = () => {
    winston.level = 'production'
    winston.add(winston.transports.File, { filename: fileName })
    winston.remove(winston.transports.Console)
}

const setupDebugLogger = () => {
    winston.level = 'debug'
}



