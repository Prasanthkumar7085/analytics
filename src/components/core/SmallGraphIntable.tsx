import React from "react";
import { Chart } from "react-google-charts";



export function SmallGraphInTable({ color, graphData }: any) {

    const dataPoints = Object.entries(graphData)
        .filter(([key]) => key !== 'caseType')
        .map(([month, value]) => [month, value]);

    const data = [
        ["CaseType", "month"],
        ...dataPoints
    ];

    const options = {
        title: "",
        hAxis: { title: "Year", titleTextStyle: { color: "#333" }, ticks: [] }, // Set an empty array to hide x-axis labels
        vAxis: { minValue: 0, ticks: [] },
        chartArea: { width: "50%" },
        legend: 'none',
        areaOpacity: 0.5,
        series: {
            0: {
                color: color,
            },
        },
        toolbar: "none"
    };

    return (
        <Chart
            chartType="AreaChart"
            width="90%"
            height="25px"
            data={data}
            options={options}
        />
    );
}
