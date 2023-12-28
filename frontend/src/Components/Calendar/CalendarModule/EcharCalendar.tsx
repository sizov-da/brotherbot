import React from 'react';
import ReactEcharts from '../../react-echart';
import * as echarts from 'echarts';


export default function EcharCalendar() {
type EChartsOption = echarts.EChartsOption;


    let option: EChartsOption;

// This example requires ECharts v5.4.0 or later

const cellSize = [50, 50];
const pieRadius = 20;

function getVirtualData() {
    const date = +echarts.time.parse('2023-12-01');
    const end = +echarts.time.parse('2024-01-01');
    const dayTime = 3600 * 24 * 1000;
    const data: [string, number][] = [];
    for (let time = date; time < end; time += dayTime) {
        data.push([
            echarts.time.format(time, '{yyyy}-{MM}-{dd}', false),
            Math.floor(Math.random() * 10000)
        ]);
    }
    return data;
}

const scatterData = getVirtualData();
const pieSeries = scatterData.map(function (item, index) {
    return {
        type: 'pie',
        id: 'pie-' + index,
        center: item[0],
        radius: pieRadius,
        coordinateSystem: 'calendar',
        label: {
            formatter: '{c}',
            position: 'inside',
            fontSize: 8,
            fontWeight: 100,
            color: '#000000'
        },
        data: [
            { name: 'Work', value: Math.round(Math.random() * 24) },
            { name: 'Entertainment', value: Math.round(Math.random() * 24) },
            { name: 'Sleep', value: Math.round(Math.random() * 24) },
            { name: 'Сон сон', value: Math.round(Math.random() * 24) }
        ]
    } as echarts.PieSeriesOption;
});

option = {
    tooltip: {},
    legend: {
        data: ['Work', 'Entertainment', 'Sleep', 'Сон сон'],
        bottom: 0
    },
    calendar: {
        top: 'middle',
        left: 'center',
        orient: 'vertical',
        cellSize: cellSize,
        yearLabel: {
            show: false,
            fontSize: 8,
            fontWeight: 100,
            color: '#000000'
        },
        dayLabel: {
            margin: 5,
            firstDay: 1,
            nameMap: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']
        },
        monthLabel: {
            show: false
        },
        range: ['2023-12']
    },
    series: [
        {
            id: 'label',
            type: 'scatter',
            coordinateSystem: 'calendar',
            symbolSize: 0,
            label: {
                show: true,
                formatter: function (params: any) {
                    return echarts.time.format(params.value[0], '{dd}', false);
                },
                offset: [-cellSize[0] / 2 + 10, -cellSize[1] / 2 + 10],
                fontSize: 8,
                fontWeight: 100,
                color: '#000000'
            },
            data: scatterData
        },
        ...pieSeries
    ]
};




    return (
        <div className="App" >
            <ReactEcharts option={option}
                          notMerge={true}
                          lazyUpdate={true}
                          onChartReady={() => console.log('Chart Ready')} />
        </div>
    );
}
