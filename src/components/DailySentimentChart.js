import * as React from 'react'
import ReactHighcharts from 'react-highcharts'
import moment from 'moment'
import * as _ from 'lodash'

import * as tweets from './tweets.json'
import * as men from './men.json'
import * as women from './women.json'

export const DailySentimentChart = () => {

    const createSeriesFor = (collection) => {
        const hours = new Map()
        _.range(24).forEach(number => hours.set(number, { totalSentiment: 0, totalTweets: 0 })) // Initialize map
        _.toArray(collection).forEach((tweet) => {
            if (tweet.textSentiment) {
                const hour = moment(tweet.date).hour()
                const dataPoint = {
                    totalSentiment: hours.get(hour).totalSentiment + tweet.textSentiment.score,
                    totalTweets: hours.get(hour).totalTweets + 1
                }
                hours.set(hour, dataPoint)
            }
        })
        console.log(hours)
        return _.range(24).map((hour) => (
            hours.get(hour).totalSentiment / hours.get(hour).totalTweets
        ))
    }

    const chartConfig = {
        chart: {
            type: 'area',
            backgroundColor: {
                linearGradient: { x1: 0, y1: 0, x2: 1, y2: 1 },
                stops: [
                    [0, '#2a2a2b'],
                    [1, '#3e3e40']
                ]
            },
            style: {
                fontFamily: '\'Unica One\', sans-serif'
            },
            plotBorderColor: '#606063'
        },
        title: {
            text: '',
            style: {
                color: '#E0E0E3',
                textTransform: 'uppercase',
                fontSize: '20px'
            }
        },
        subtitle: {
            text: '',
            style: {
                color: '#E0E0E3',
                textTransform: 'uppercase'
            }
        },
        xAxis: {
            allowDecimals: false,
            labels: {
                formatter: function () {
                    return this.value; // clean, unformatted number for year
                },
                style: {
                    color: '#E0E0E3'
                }
            },
            gridLineColor: '#707073',
            lineColor: '#707073',
            minorGridLineColor: '#505053',
            tickColor: '#707073',
            title: {
                style: {
                    color: '#A0A0A3'

                },
                text: "Hour of Day"
            }
        },
        yAxis: {
            title: {
                text: 'Overall Sentiment',
                style: {
                    color: '#A0A0A3'
                }
            },
            labels: {
                style: {
                    color: '#E0E0E3'
                }
            },
            gridLineColor: '#707073',
            lineColor: '#707073',
            minorGridLineColor: '#505053',
            tickColor: '#707073',
            tickWidth: 1,
        },
        tooltip: {
            backgroundColor: 'rgba(0, 0, 0, 0.85)',
            style: {
                color: '#F0F0F0'
            },
            pointFormat: 'At hour {point.x} of the day, {series.name} averaged a sentiment of <b>{point.y:,.2f}</b><br/> in their tweets'
        },
        plotOptions: {
            area: {
                pointStart: 0,                                                                           // TODO: X0 of plot
                marker: {
                    enabled: false,
                    symbol: 'circle',
                    radius: 2,
                    states: {
                        hover: {
                            enabled: true
                        }
                    }
                }
            },
            series: {
                dataLabels: {
                    color: '#FF7A5A'
                },
                marker: {
                    lineColor: '#333'
                }
            },
            boxplot: {
                fillColor: '#505053'
            },
            candlestick: {
                lineColor: 'white'
            },
            errorbar: {
                color: 'white'
            }
        },
        series: [{
            name: 'men',
            data: createSeriesFor(men)
        }, {
            name: 'women',
            data: createSeriesFor(women),
        }],
        colors: ['#FF7A5A', '#FFB85F'],
        legend: {
            itemStyle: {
                color: '#E0E0E3'
            },
            itemHoverStyle: {
                color: '#FFF'
            },
            itemHiddenStyle: {
                color: '#606063'
            }
        },
        credits: {
            style: {
                color: '#666'
            }
        },
        labels: {
            style: {
                color: '#707073'
            }
        },

        drilldown: {
            activeAxisLabelStyle: {
                color: '#F0F0F3'
            },
            activeDataLabelStyle: {
                color: '#F0F0F3'
            }
        },

        navigation: {
            buttonOptions: {
                symbolStroke: '#DDDDDD',
                theme: {
                    fill: '#505053'
                }
            }
        },

        // scroll charts
        rangeSelector: {
            buttonTheme: {
                fill: '#505053',
                stroke: '#000000',
                style: {
                    color: '#CCC'
                },
                states: {
                    hover: {
                        fill: '#707073',
                        stroke: '#000000',
                        style: {
                            color: 'white'
                        }
                    },
                    select: {
                        fill: '#000003',
                        stroke: '#000000',
                        style: {
                            color: 'white'
                        }
                    }
                }
            },
            inputBoxBorderColor: '#505053',
            inputStyle: {
                backgroundColor: '#333',
                color: 'silver'
            },
            labelStyle: {
                color: 'silver'
            }
        },

        navigator: {
            handles: {
                backgroundColor: '#666',
                borderColor: '#AAA'
            },
            outlineColor: '#CCC',
            maskFill: 'rgba(255,255,255,0.1)',
            series: {
                color: '#7798BF',
                lineColor: '#A6C7ED'
            },
            xAxis: {
                gridLineColor: '#505053'
            }
        },

        scrollbar: {
            barBackgroundColor: '#808083',
            barBorderColor: '#808083',
            buttonArrowColor: '#CCC',
            buttonBackgroundColor: '#606063',
            buttonBorderColor: '#606063',
            rifleColor: '#FFF',
            trackBackgroundColor: '#404043',
            trackBorderColor: '#404043'
        },

        legendBackgroundColor: 'rgba(0, 0, 0, 0.5)',
        background2: '#505053',
        dataLabelsColor: '#B0B0B3',
        textColor: '#C0C0C0',
        contrastTextColor: '#F0F0F3',
        maskColor: 'rgba(255,255,255,0.3)'
    }

    return (
        <div className="Chart">
            <ReactHighcharts config={ chartConfig } />
        </div>
    )
}
