import { getRevenueAPI } from "@/services/getRevenueAPIs";
import { useEffect, useState } from "react";
import { Chart } from "react-google-charts";
import { toast } from "sonner";
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
const RevenueDataGraph = ({ labelsData, billedData, totalRevenueData }: any) => {

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
      categories: labelsData,
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
      valueSuffix: '',
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
        name: 'Collected',
        data: totalRevenueData
      }
    ]
  };




  return (
    <div style={{ overflowY: "hidden" }}>
      <HighchartsReact highcharts={Highcharts} options={options} />
    </div>
  );
};

export default RevenueDataGraph;
