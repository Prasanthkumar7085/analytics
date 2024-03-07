import { getRevenueAPI } from "@/services/getRevenueAPIs";
import { useEffect, useState } from "react";
import { Chart } from "react-google-charts";
import { toast } from "sonner";
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
const RevenueDataGraph = () => {
  const [totalGraphData, setTotalGraphData] = useState<any>([]);
  const [labelsData, setLablesData] = useState<any>([])
  const [billedData, setBilledData] = useState<any>([])
  const [totalRevenueData, setTotalRevenueData] = useState<any>([])

  const updateTheResponseForGraph = (data: any) => {
    if (!data) {
      return;
    }
    let dataKeys = Object.keys(data);
    let XLabelData = [];
    let billedData = [];
    let totalRevenue: any = [];

    for (let i = 0; i < dataKeys?.length + 1; i++) {
      if (dataKeys[i]) {
        XLabelData.push([
          dataKeys[i]?.split(" ")[0]?.slice(0, 3),
        ]);
        billedData.push([data[dataKeys[i]]?.total_revenue_billed])
        totalRevenue.push([data[dataKeys[i]]?.total_revenue_collected])
      }
    }
    setLablesData(XLabelData);
    setBilledData(billedData);
    setTotalRevenueData(totalRevenue);
  };
  const getRevenue = async () => {
    try {
      const response = await getRevenueAPI();

      if (response?.status == 200 || response?.status == 201) {
        updateTheResponseForGraph(response?.data);
      }
    } catch (err: any) {
      toast.error(err.message || "Something went wrong");
    }
  };

  const options = {
    chart: {
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
      valueSuffix: ''
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



  useEffect(() => {
    getRevenue();
  }, []);
  return (
    <HighchartsReact highcharts={Highcharts} options={options} />
  );
};

export default RevenueDataGraph;
