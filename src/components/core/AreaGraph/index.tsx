import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

const AreaGraph = ({ data, graphColor }: any) => {
  let options = {
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
      visible: data?.length && data?.length == 1 ? true : false,
    },
    yAxis: {
      labels: {
        enabled: false,
      },
      title: {
        text: null,
      },
      visible: data?.length && data?.length == 1 ? true : false,
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
          enabled: data?.length && data?.length == 1 ? true : false,
        },
        tooltip: {
          enabled: false,
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
      tooltip: {
        enabled: false,
      },
      area: {
        color: graphColor,
        fillColor: {
          linearGradient: {
            x1: 0,
            y1: 0,
            x2: 0,
            y2: 1,
          },
          stops: [
            [0, graphColor ? graphColor : ""],
            [1, Highcharts.color("white").setOpacity(0).get("rgba")],
          ],
        },
        marker: {
          radius: 2,
        },
        lineWidth: 1,
        states: {
          hover: {
            lineWidth: 1,
          },
        },
        threshold: null,
      },
    },

    series: [
      {
        name: null,
        data: data?.length
          ? data.map((item: any) =>
              item.target_cases ? +item.target_cases : 0
            )
          : [],
        animation: {
          opacity: 0.4,
        },
      },
      {
        name: null,
        data: data?.length
          ? data.map((item: any) => (item.total_cases ? +item.total_cases : 0))
          : [],
        type: "line",
        color: "#000000",
      },
    ],
  };

  return (
    <div className="remove-tooltip">
      <HighchartsReact highcharts={Highcharts} options={options} />
    </div>
  );
};
export default AreaGraph;
