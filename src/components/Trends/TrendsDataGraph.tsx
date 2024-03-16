import { } from "@/services/getRevenueAPIs";
import {
  getTrendsForRevenueBySalesRepIdAPI,
  getTrendsForVolumeBySalesRepIdAPI,
} from "@/services/salesRepsAPIs";
import { Backdrop, CircularProgress } from "@mui/material";
import Highcharts from "highcharts";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const TrendsDataGraph = ({ graphType, searchParams }: { graphType: string, searchParams: any }) => {
  const [trendsData, setTrendsData] = useState<any>([]);

  const { id } = useParams();
  const [loading, setLoading] = useState(false);

  const getSalesRepRevenue = async (fromDate: any, toDate: any) => {
    setLoading(true);
    try {

      let queryParams: any = {};

      if (fromDate) {
        queryParams["from_date"] = fromDate;
      }
      if (toDate) {
        queryParams["to_date"] = toDate;
      }

      let response;
      if (graphType == "revenue") {
        response = await getTrendsForRevenueBySalesRepIdAPI({
          id: id as string, queryParams
        });
      } else if (graphType == "volume") {
        response = await getTrendsForVolumeBySalesRepIdAPI({
          id: id as string, queryParams
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

  function formatMonthYear(monthYear: string) {
    let month = monthYear.substring(0, 3); // Extract the first 3 characters (abbreviation of month)
    let year = monthYear.substring(monthYear.length - 4); // Extract the last 4 characters (year)
    return month + year; // Concatenate month abbreviation and year
  }


  useEffect(() => {
    if (chartRef && chartRef.current && trendsData?.length) {
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
          categories: trendsData?.map((item: any) => formatMonthYear(item?.month)),
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
                ? "Total Volume"
                : "Total Revenue",
            data:
              graphType == "volume"
                ? trendsData?.map((item: any) => +item.volume)
                : trendsData?.map((item: any) => +item.revenue),
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
    getSalesRepRevenue(searchParams?.from_date, searchParams?.to_date);
  }, [graphType, searchParams]);

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
