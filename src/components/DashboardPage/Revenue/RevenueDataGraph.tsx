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
    console.log(data, "data")
    if (!data) {
      return;
    }

    let totalRevenue: any = [];

    const months = data.map((item: any) => item.month);
    const generatedAmounts = data.map((item: any) => +item.generated_amount);
    const paidAmounts = data.map((item: any) => +item.paid_amount);
    setLablesData(months);
    setBilledData(generatedAmounts);
    setTotalRevenueData(paidAmounts);
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
    <div style={{ overflowY: "hidden" }}>
      <HighchartsReact highcharts={Highcharts} options={options} />
    </div>
  );
};

export default RevenueDataGraph;
