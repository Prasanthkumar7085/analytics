import { formatMonthYear } from "@/lib/helpers/apiHelpers";
import {
  getMonthWiseBilledTreadsDataAPI,
  getMonthWiseRevenueTreadsDataAPI,
} from "@/services/BillingAnalytics/overViewAPIs";
import { Backdrop } from "@mui/material";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import Image from "next/image";
import { useEffect, useState } from "react";

const MonthWiseTrendsGraph = ({ searchParams }: any) => {
  const [monthWiseBilledTrendsData, setMonthWiseBilledTrendsData] =
    useState<any>([]);
  const [monthWiseRevenueTrendsData, setMonthWiseRevenueTrendsData] =
    useState<any>([]);
  const [loading, setLoading] = useState<any>(false);

  //query preparation method
  const queryPreparations = async (
    fromDate: any,
    toDate: any,
    tabValue: string
  ) => {
    let queryParams: any = {};
    if (fromDate) {
      queryParams["from_date"] = fromDate;
    }
    if (toDate) {
      queryParams["to_date"] = toDate;
    }
    if (tabValue) {
      queryParams["tab"] = tabValue;
    }
    try {
      if (tabValue == "billed") {
        await getBilledTrendsData(queryParams);
      } else {
        await getRevenueTrendsData(queryParams);
      }
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getBilledTrendsData = async (queryParams: any) => {
    try {
      const response = await getMonthWiseBilledTreadsDataAPI(queryParams);
      if (response.status == 200 || response.status == 201) {
        setMonthWiseBilledTrendsData(response?.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getRevenueTrendsData = async (queryParams: any) => {
    try {
      const response = await getMonthWiseRevenueTreadsDataAPI(queryParams);
      if (response.status == 200 || response.status == 201) {
        setMonthWiseRevenueTrendsData(response?.data);
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
        duration: 1000,
        easing: "easeOutBounce",
      },
    },
    title: {
      text: searchParams?.tab == "revenue" ? "Total Revenue" : "Total Billed",
    },
    xAxis: {
      categories: monthWiseBilledTrendsData?.map((item: any) =>
        formatMonthYear(item?.month)
      ),
    },
    yAxis: {
      title: {
        text: searchParams?.tab == "revenue" ? "Revenue" : "Billed",
      },
    },
    tooltip: {
      formatter: function (
        this: Highcharts.TooltipFormatterContextObject | any
      ): string {
        return (
          this.point.category +
          " <b>" +
          ": $" +
          Highcharts.numberFormat(this.point.y, 2, ".", ",") +
          "</b>"
        );
      },
    },
    series: [
      {
        name:
          searchParams?.tab == "revenue" ? "Total Received" : "Total Revenue",
        data:
          searchParams?.tab == "billed" && monthWiseBilledTrendsData?.length
            ? monthWiseBilledTrendsData?.map((item: any) => +item.total_amount)
            : monthWiseRevenueTrendsData?.map(
                (item: any) => +item?.received_amount
              ),
        animation: {
          opacity: 1,
        },
      },
    ],
  };
  useEffect(() => {
    queryPreparations(
      searchParams?.from_date,
      searchParams?.to_date,
      searchParams?.tab
    );
  }, [searchParams]);
  return (
    <div id="TrendsData">
      <div style={{ position: "relative" }}>
        {monthWiseBilledTrendsData?.length > 0 ? (
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
    </div>
  );
};
export default MonthWiseTrendsGraph;
