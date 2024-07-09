import { formatMonthYear } from "@/lib/helpers/apiHelpers";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import Image from "next/image";
const VolumeDataGraph = ({
  labelsData,
  totalCasesData,
  completedCases,
  loading,
}: any) => {
  const options = {
    chart: {
      height: 375,
      type: "column",
    },
    title: {
      text: " ",
      align: "left",
    },

    xAxis: {
      categories: labelsData?.map((item: any) => formatMonthYear(item)),
      crosshair: true,
      accessibility: {
        description: "Months",
      },
    },
    subtitle: {
      useHTML: true,
      text: "",
      floating: true,
      verticalAlign: "middle",
      y: 10,
    },
    yAxis: {
      min: 0,
      title: {
        text: "",
      },
    },
    tooltip: {
      shared: true,
      useHTML: true,
      formatter: function (
        this: Highcharts.TooltipFormatterContextObject | any
      ): string {
        if (!this) return ""; // Return empty string if `this` is undefined
        let tooltipHTML = "<b>" + this.x + "</b><br/>";
        this.points.forEach(function (point: any) {
          tooltipHTML +=
            '<span style="color:' +
            point.color +
            '">\u25CF</span> ' +
            point.series.name +
            ": " +
            Highcharts.numberFormat(point.y, 0, ".", ",") +
            "<br/>";
        });
        return tooltipHTML;
      },
    },
    plotOptions: {
      column: {
        pointPadding: 0.2,
        borderWidth: 0,
      },
    },
    series: [
      {
        name: "Target",
        data: completedCases,
        color: "#46c8ff",
      },
      {
        name: "Received",
        data: totalCasesData,
        color: "#544fc5",
      },
    ],
  };

  return (
    <div style={{ overflowY: "hidden" }}>
      {Object.keys(totalCasesData)?.length ||
      Object.keys(completedCases)?.length ? (
        <HighchartsReact highcharts={Highcharts} options={options} />
      ) : !loading ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "40vh",
          }}
        >
          <Image
            src="/NoDataImageAnalytics.svg"
            alt=""
            height={150}
            width={250}
          />
        </div>
      ) : (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "40vh",
          }}
        ></div>
      )}
    </div>
  );
};

export default VolumeDataGraph;
