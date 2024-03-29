import * as React from 'react'
import ReactHighcharts from 'react-highcharts'
import * as _ from 'lodash'
import moment from 'moment'

export const DailySentimentChart = (props) => {

    const chartConfig = {
        chart: {
            height: 600,
            zoomType: 'xy',
            type: 'spline',
            backgroundColor: '#2a2a2b',
            style: {
                fontFamily: '\'Poiret One\', sans-serif'
            },
            plotBorderColor: '#606063'
        },
        title: {
            text: 'Average Daily Sentiment',
            style: {
                color: '#E0E0E3',
                fontSize: '30px'
            }
        },
        subtitle: {
            text: 'Average and Average (follower-adjusted) Series',
            style: {
                color: '#E0E0E3'
            }
        },
        xAxis: {
            categories: _.range(24).map(hour => moment().startOf('hour').hour(hour).format('h:mm a')),
            gridLineColor: '#707073',
            labels: {
                style: {
                    color: '#E0E0E3'
                }
            },
            lineColor: '#707073',
            minorGridLineColor: '#505053',
            tickColor: '#707073'
        },
        yAxis: {
            title: {
                text: 'Overall Sentiment',
                style: {
                    color: '#E0E0E3',
                    fontSize: '20px'
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
            split: true,
            backgroundColor: 'rgba(0, 0, 0, 0.85)',
            style: {
                color: '#F0F0F0'
            },
            pointFormat: '{series.name}-authored tweets had an overall sentiment of <b>{point.y:,.1f}</b><br/>'
        },
        plotOptions: {
            spline: {
                pointStart: 0,
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
        series: props.data,
        colors: ['rgb(0, 188, 212)', 'rgba(0, 170, 160, .4)', 'rgb(255, 64, 129)', 'rgba(255, 64, 129, .4)'],
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
                color: '#2a2a2b'
            }
        },
        labels: {
            style: {
                color: '#707073'
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
        <div className="daily-sentiment-chart">
            <ReactHighcharts config={ chartConfig } />
        </div>
    )
}
