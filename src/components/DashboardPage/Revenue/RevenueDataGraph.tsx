import { getRevenueAPI } from "@/services/getRevenueAPIs";
import { useEffect, useState } from "react";
import { Chart } from "react-google-charts";
import { toast } from "sonner";
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import Image from "next/image";
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
      {Object.keys(billedData)?.length || Object.keys(totalRevenueData)?.length ?
        <HighchartsReact highcharts={Highcharts} options={options} /> : <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "40vh",
          }}
        >
          <Image src="/NoDataImageAnalytics.svg" alt="" height={150} width={250} />
        </div>}
    </div>
  );
};

export default RevenueDataGraph;
