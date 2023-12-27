import React from "react";
import * as echarts from 'echarts/core';
// import the core library.
import ReactEChartsCore from 'echarts-for-react/lib/core';
// Import the echarts core module, which provides the necessary interfaces for using echarts.
// import * as echarts from 'echarts/core';
import {
    CalendarComponent,
    TooltipComponent,
    LegendComponent
} from 'echarts/components';
import { ScatterChart, PieChart } from 'echarts/charts';
import { UniversalTransition, LabelLayout } from 'echarts/features';
import { CanvasRenderer } from 'echarts/renderers';
echarts.use([
    CalendarComponent,
    TooltipComponent,
    LegendComponent,
    ScatterChart,
    PieChart,
    CanvasRenderer,
    UniversalTransition,
    LabelLayout
]);


const CalendarModule = () => {


var chartDom = document.getElementById('main');
var myChart = echarts.init(chartDom);
var option;

// This example requires ECharts v5.4.0 or later
const cellSize = [80, 80];
const pieRadius = 30;
function getVirtualData() {
    const date = +echarts.time.parse('2017-02-01');
    const end = +echarts.time.parse('2017-03-01');
    const dayTime = 3600 * 24 * 1000;
    const data = [];
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
            position: 'inside'
        },
        data: [
            { name: 'Work', value: Math.round(Math.random() * 24) },
            { name: 'Entertainment', value: Math.round(Math.random() * 24) },
            { name: 'Sleep', value: Math.round(Math.random() * 24) }
        ]
    };
});
option = {
    tooltip: {},
    legend: {
        data: ['Work', 'Entertainment', 'Sleep'],
        bottom: 20
    },
    calendar: {
        top: 'middle',
        left: 'center',
        orient: 'vertical',
        cellSize: cellSize,
        yearLabel: {
            show: false,
            fontSize: 30
        },
        dayLabel: {
            margin: 20,
            firstDay: 1,
            nameMap: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        },
        monthLabel: {
            show: false
        },
        range: ['2017-02']
    },
    series: [
        {
            id: 'label',
            type: 'scatter',
            coordinateSystem: 'calendar',
            symbolSize: 0,
            label: {
                show: true,
                formatter: function (params: { value: unknown[]; }) {
                    return echarts.time.format(params.value[0], '{dd}', false);
                },
                offset: [-cellSize[0] / 2 + 10, -cellSize[1] / 2 + 10],
                fontSize: 14
            },
            data: scatterData
        },
        ...pieSeries
    ]
};

// option && myChart.setOption(option);
return (<ReactEChartsCore
            echarts={echarts}
            option={option}
            notMerge={true}
            lazyUpdate={true}
            theme={"theme_name"}
            // onChartReady={this.onChartReadyCallback}
            // onEvents={EventsDict}
            // opts={}
        />)
};

export default CalendarModule ;
