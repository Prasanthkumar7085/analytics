import { useEffect } from "react";
import { useRef } from "react";
import Highcharts from "highcharts";

const AreaGraph = ({ getValue }: any) => {
  const chartRef = useRef(null);
  const trendsData = {
    "January 2024": {
      revenue: 35,
    },
    "February 2024": {
      revenue: 26,
    },
    "March 2024": {
      revenue: 0,
    },
    "April 2024": {
      revenue: 0,
    },
    "May 2024": {
      revenue: 0,
    },
    "June 2024": {
      revenue: 0,
    },
    "July 2024": {
      revenue: 0,
    },
    "August 2024": {
      revenue: 0,
    },
    "September 2024": {
      revenue: 0,
    },
    "October 2024": {
      revenue: 0,
    },
    "November 2024": {
      revenue: 0,
    },
    "December 2024": {
      revenue: 0,
    },
  };
  function getRandomBrightColor() {
    const colors = [
      "#FF5733",
      "#33FF57",
      "#3344FF",
      "#FFA500",
      "#FFD700",
      "#800080",
      "#E6E6FA",
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  useEffect(() => {
    if (chartRef && chartRef.current) {
      Highcharts.chart(chartRef.current, {
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
          visible: false,
        },
        yAxis: {
          labels: {
            enabled: false,
          },
          title: {
            text: null,
          },
          visible: false,
        },
        legend: {
          enabled: false,
        },
        credits: {
          enabled: false,
        },
        plotOptions: {
          area: {
            color: getRandomBrightColor(),
          },

          series: {
            animation: false,
            marker: {
              enabled: false,
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
        },

        series: [
          {
            name: null,
            data: Object.values(trendsData).map((item: any) => item.revenue),
            animation: {
              opacity: 0.4,
            },
          },
        ],
      } as any);
    }
  }, [trendsData]);

  return <div ref={chartRef} className="remove-tooltip"></div>;
};
export default AreaGraph;
