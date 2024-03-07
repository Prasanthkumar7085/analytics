import {
  getTrendsForRevenueBySalesRepIdAPI,
  getTrendsForVolumeBySalesRepIdAPI,
} from "@/services/getRevenueAPIs";
import { Backdrop, CircularProgress } from "@mui/material";
import Highcharts from "highcharts";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const TrendsDataGraph = ({ graphType }: { graphType: string }) => {
  const [trendsData, setTrendsData] = useState({});

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
      console.log(response, "asdf");

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
          text: "Total Revenue",
        },
        xAxis: {
          categories: Object.keys(trendsData).map((item: string) =>
            item?.slice(0, 3)
          ),
        },
        yAxis: {
          title: {
            text: "Amount",
          },
        },
        series: [
          {
            name: "Total Revenue Billed",
            data: Object.values(trendsData).map((item: any) => item.revenue),
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
          <CircularProgress color="inherit" />
        </Backdrop>
      ) : (
        ""
      )}
    </div>
  );
};

export default TrendsDataGraph;
