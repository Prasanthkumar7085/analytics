import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

const LineGraphForResults = ({
    graphValuesData,
    patientsData
}: any) => {

    const options = {
        chart: {
            height: 50,
            width: 100,
            type: "area",
            animation: {
                duration: 1000,
                easing: "easeOutBounce",
            },
        },

        title: {
            text: null,
        },
        xAxis: {
            labels: {
                enabled: false,
            },
            title: {
                text: null,
            },
            visible:
                graphValuesData?.length && graphValuesData?.length == 1
                    ? true
                    : false,
            // categories: formattedDates,
            // type: 'datetime',
        },
        yAxis: {
            labels: {
                enabled: false,
            },
            title: {
                text: null,
            },
            visible:
                graphValuesData?.length && graphValuesData?.length == 1
                    ? true
                    : false,
        },
        legend: {
            enabled: false,
        },
        credits: {
            enabled: false,
        },
        plotOptions: {
            series: {
                animation: true,
                marker: {
                    enabled:
                        graphValuesData?.length && graphValuesData?.length == 1
                            ? true
                            : false,
                },

                states: {
                    hover: {
                        enabled: false,
                    },
                },
            },
            marker: {
                enabled: false,
            },
        },

        series: [
            {
                name: null,
                data: graphValuesData?.length
                    ? graphValuesData?.map((item: any) => item)
                    : [],
                animation: {
                    opacity: 0.4,
                },
                type: "line",
            },
        ],
    };

    return (
        <div className="remove-tooltip">
            <HighchartsReact highcharts={Highcharts} options={options} />
        </div>
    );
};
export default LineGraphForResults;
