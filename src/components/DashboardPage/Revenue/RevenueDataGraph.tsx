import { formatMonthYear } from "@/lib/helpers/apiHelpers";
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import Image from "next/image";
const RevenueDataGraph = ({ labelsData, billedData, totalRevenueData, loading }: any) => {

  const options = {
    chart: {
      height: 375,
      type: 'column'
    },
    title: {
      text: ' ',
      align: 'left'
    },

    xAxis: {
      categories: labelsData?.map((item: any) => formatMonthYear(item)),
      crosshair: true,
      accessibility: {
        description: 'Months'
      }
    },
    subtitle: {
      useHTML: true,
      text: "",
      floating: true,
      verticalAlign: 'middle',
      y: 10
    },
    yAxis: {
      min: 0,
      title: {
        text: ''
      }
    },
    tooltip: {
      shared: true,
      useHTML: true,
      formatter: function (this: Highcharts.TooltipFormatterContextObject | any): string {
        if (!this) return ''; // Return empty string if `this` is undefined
        let tooltipHTML = '<b>' + this.x + '</b><br/>';
        this.points.forEach(function (point: any) {
          tooltipHTML += '<span style="color:' + point.color + '">\u25CF</span> ' + point.series.name + ': $' + Highcharts.numberFormat(point.y, 2, '.', ',') + '<br/>';
        });
        return tooltipHTML;
      }
    },
    plotOptions: {
      column: {
        pointPadding: 0.2,
        borderWidth: 0
      }
    },
    series: [
      {
        name: 'Billed',
        data: billedData
      },
      {
        name: 'Received',
        data: totalRevenueData
      }
    ]
  };




  return (
    <div style={{ overflowY: "hidden" }}>
      {Object.keys(billedData)?.length || Object.keys(totalRevenueData)?.length ?
        <HighchartsReact highcharts={Highcharts} options={options} /> :
        !loading ? <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "40vh",
          }}
        >
          <Image src="/NoDataImageAnalytics.svg" alt="" height={150} width={250} />
        </div> : <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "40vh",
          }}
        ></div>}
    </div>
  );
};

export default RevenueDataGraph;
