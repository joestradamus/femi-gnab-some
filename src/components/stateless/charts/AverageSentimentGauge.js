import React from 'react'
import ReactHighcharts from 'react-highcharts'

export const AverageSentimentGauge = (props) => {
    const chartConfig = {
        chart: {
            type: 'bar',
            zoomType: 'xy',
            backgroundColor: '#2a2a2b',
            style: {
                fontFamily: '\'Poiret One\', sans-serif'
            },
            plotBorderColor: '#606063',
            height: 600
        },
        xAxis: {
            categories: [''],
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
        title: {
            text: ''
        },
        yAxis: {
            min: 0,
            title: {
                text: 'Average Sentiment'
            }
        },
        legend: {
            enabled: true,
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
        plotOptions: {
            series: {
                borderWidth: 0,
                dataLabels: {
                    enabled: true,
                    color: '#B0B0B3',
                    format: '{point.y:,.1f}'
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

        tooltip: {
            headerFormat: '',
            pointFormat: '<br/><span style="color:{point.color}">{point.name}</span>: <b>{point.y:,.1f}</b>',
            height: '50px',
            backgroundColor: 'rgba(0, 0, 0, 0.85)',
            style: {
                color: '#F0F0F0'
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

        series: [{
            name: 'Average Sentiment When Mentioning Men',
            data: [{ name: 'Average Sentiment When Mentioning Men', y: props.maleAverage, color: 'rgb(0, 188, 212)'}]
        }, {
            name: 'Average Sentiment When Mentioning Women',
            data: [{ name: 'Average Sentiment When Mentioning Women', y: props.femaleAverage, color: 'rgb(255, 64, 129)' }]
        }],
        colors: ['rgb(0, 188, 212)', 'rgb(255, 64, 129)'],
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
        maskColor: 'rgba(255,255,255,0.3)',
    }

    return(
        <div className="average-sentiment-gauge">
            <ReactHighcharts config={ chartConfig } />
        </div>
    )
}