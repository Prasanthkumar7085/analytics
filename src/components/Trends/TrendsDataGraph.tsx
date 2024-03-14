import { } from "@/services/getRevenueAPIs";
import {
  getTrendsForRevenueBySalesRepIdAPI,
  getTrendsForVolumeBySalesRepIdAPI,
} from "@/services/salesRepsAPIs";
import { Backdrop, CircularProgress } from "@mui/material";
import Highcharts from "highcharts";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const TrendsDataGraph = ({ graphType }: { graphType: string }) => {
  const [trendsData, setTrendsData] = useState<any>([]);

  const { id } = useParams();
  const [loading, setLoading] = useState(false);

  const getSalesRepRevenue = async () => {
    setLoading(true);
    try {
      let response;
      if (graphType == "revenue") {
        response = await getTrendsForRevenueBySalesRepIdAPI({
          id: id as string,
        });
      } else if (graphType == "volume") {
        response = await getTrendsForVolumeBySalesRepIdAPI({
          id: id as string,
        });
      }

      setTrendsData(response?.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const chartRef = useRef(null);

  useEffect(() => {
    if (chartRef && chartRef.current) {
      // Custom entrance animation for the chart
      Highcharts.chart(chartRef.current, {
        chart: {
          type: "spline",
          animation: {
            duration: 1000, // Set the animation duration
            easing: "easeOutBounce", // Set the easing function for a smoother animation
          },
        },
        title: {
          text: graphType == "volume" ? "Total Volume" : "Total Revenue",
        },
        xAxis: {
          categories: trendsData.map((item: any) =>
            item?.month
          ),
        },
        yAxis: {
          title: {
            text: "Amount",
          },
        },
        series: [
          {
            name:
              graphType == "volume"
                ? "Total Volume Billed"
                : "Total Revenue Billed",
            data: graphType == "volume" ? trendsData.map((item: any) => +item.volume) : trendsData.map((item: any) => +item.revenue),
            animation: {
              opacity: 1, // Set opacity animation for smoother entrance
            },
          },
        ],
      } as any);
    }
  }, [trendsData]);

  useEffect(() => {
    // setTrendsData({});
    getSalesRepRevenue();
  }, [graphType]);

  return (
    <div style={{ position: "relative" }}>
      <div ref={chartRef}></div>
      {loading ? (
        <Backdrop
          open={true}
          style={{
            zIndex: 999,
            color: "red",
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            background: "rgba(256,256,256,0.8)",
          }}
        >
          {/* <CircularProgress color="inherit" /> */}
          <object
            type="image/svg+xml"
            data={"/core/loading.svg"}
            width={150}
            height={150}
          />
        </Backdrop>
      ) : (
        ""
      )}
    </div>
  );
};

export default TrendsDataGraph;
