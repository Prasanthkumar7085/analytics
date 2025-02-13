import { formatMonthYear } from "@/lib/helpers/apiHelpers";
import {} from "@/services/revenueAPIs";
import {
  getTrendsForRevenueBySalesRepIdAPI,
  getTrendsForVolumeBySalesRepIdAPI,
} from "@/services/salesRepsAPIs";
import { Backdrop, CircularProgress } from "@mui/material";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const TrendsDataGraph = ({
  graphType,
  searchParams,
  pageName,
}: {
  graphType: string;
  searchParams: any;
  pageName: string;
}) => {
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
          pageName,
          id: id as string,
          queryParams,
        });
        setTrendsData(response?.data);
      } else if (graphType == "volume") {
        response = await getTrendsForVolumeBySalesRepIdAPI({
          pageName,
          id: id as string,
          queryParams,
        });
        setTrendsData(response?.mergedData);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  let options = {
    chart: {
      type: "spline",
      animation: {
        duration: 1000, // Set the animation duration
        easing: "easeOutBounce", // Set the easing function for a smoother animation
      },
    },
    title: {
      text: graphType == "volume" ? "Volume" : "Revenue",
    },
    xAxis: {
      categories: trendsData?.map((item: any) => formatMonthYear(item?.month)),
    },
    yAxis: {
      title: {
        text: graphType == "volume" ? "Volume" : "Revenue",
      },
    },
    tooltip: {
      crosshairs: true,
      shared: true,
      tooltip: {
        crosshairs: true,
        shared: true,
        formatter: function (
          this: Highcharts.TooltipFormatterContextObject | any
        ): string {
          let month = this.point.category;
          let totalCases =
            this.series.chart.series[0].data[
              this.point.index
            ].y.toLocaleString();
          let totalTargets =
            this.series.chart.series[1].data[
              this.point.index
            ].y.toLocaleString();

          return (
            month +
            "<br>" +
            "Received: <b>" +
            totalCases +
            "</b><br>" +
            "Target: <b>" +
            totalTargets +
            "</b>"
          );
        },
      },
    },
    series: [
      {
        name: graphType == "volume" ? "Target" : "Total Revenue",
        data:
          graphType == "volume"
            ? trendsData?.length
              ? trendsData?.map((item: any) => +item.total_target)
              : []
            : trendsData?.length
            ? trendsData?.map((item: any) => +item.paid_amount)
            : [],
        animation: {
          opacity: 1, // Set opacity animation for smoother entrance
        },
        type: "line",
        color: "#46c8ff",
        zIndex: 9999,
      },
      {
        name: graphType == "volume" ? "Received" : "Total Revenue",
        data:
          graphType == "volume"
            ? trendsData?.length
              ? trendsData?.map((item: any) => +item.total_volume)
              : []
            : trendsData?.length
            ? trendsData?.map((item: any) => +item.paid_amount)
            : [],
        animation: {
          opacity: 1, // Set opacity animation for smoother entrance
        },
        type: "column",
        color: "#544fc5",
      },
    ],
  };

  useEffect(() => {
    // setTrendsData({});
    getSalesRepRevenue(searchParams?.from_date, searchParams?.to_date);
  }, [graphType, searchParams]);

  return (
    <div style={{ position: "relative" }}>
      {trendsData?.length ? (
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
