import { getRevenueAPI } from "@/services/getRevenueAPIs";
import { useEffect, useState } from "react";
import { Chart } from "react-google-charts";
import { toast } from "sonner";

const RevenueDataGraph = () => {
  const [totalGraphData, setTotalGraphData] = useState<any>([]);

  const options = {
    chart: {
      title: "Revenue",
      subtitle: "Total Revenue",
    },
  };
  const updateTheResponseForGraph = (data: any) => {
    if (!data) {
      return;
    }
    let dataKeys = Object.keys(data);
    let groupedData = [["Year", "Billed", "Collected"]];

    for (let i = 0; i < dataKeys?.length + 1; i++) {
      console.log(dataKeys[i], "adfs");
      if (dataKeys[i]) {
        groupedData.push([
          dataKeys[i]?.split(" ")[0]?.slice(0, 3),
          data[dataKeys[i]]?.total_revenue_billed,
          data[dataKeys[i]]?.total_revenue_collected,
        ]);
      }
    }
    console.log(groupedData, "plpl");

    setTotalGraphData(groupedData);
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

  useEffect(() => {
    getRevenue();
  }, []);
  return (
    <Chart
      chartType="Bar"
      width="100%"
      height="400px"
      data={totalGraphData}
      options={options}
    />
  );
};

export default RevenueDataGraph;
