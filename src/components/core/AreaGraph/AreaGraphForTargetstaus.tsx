import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

const AreaGraphForTargetStatus = ({ data, graphColor }: any) => {
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
      visible:
        Object?.values(data)?.length && Object?.values(data)?.length == 1
          ? true
          : false,
    },
    yAxis: {
      labels: {
        enabled: false,
      },
      title: {
        text: null,
      },
      visible:
        Object?.values(data)?.length && Object?.values(data)?.length == 1
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
            Object?.values(data)?.length && Object?.values(data)?.length == 1
              ? true
              : false,
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
        data: Object?.values(data)?.length
          ? Object?.values(data).map((item: any) => (item[1] ? +item[1] : 0))
          : [],
        animation: {
          opacity: 0.4,
        },
        type: "line",
      },
      {
        name: null,
        data: Object?.values(data)?.length
          ? Object?.values(data).map((item: any) => (item[0] ? +item[0] : 0))
          : [],
        type: "column",
        color: graphColor,
      },
    ],
  };

  return (
    <div className="remove-tooltip">
      <HighchartsReact highcharts={Highcharts} options={options} />
    </div>
  );
};
export default AreaGraphForTargetStatus;
