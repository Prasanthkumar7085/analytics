import BilledAndRevenueTabs from "@/components/core/BilledAndRevenueTabs";
import ExportButton from "@/components/core/ExportButton/ExportButton";
import GlobalDateRangeFilter from "@/components/core/GlobalDateRangeFilter";
import TanStackTableComponent from "@/components/core/Table/SingleColumn/SingleColumnTable";
import {
  BilledOverViewcolumns,
  RevenueOverViewcolumns,
} from "@/components/core/TableColumns/OverViewCaseTypesTableColumns";
import formatMoney from "@/lib/Pipes/moneyFormat";
import { graphColors } from "@/lib/constants";
import { changeDateToUTC } from "@/lib/helpers/apiHelpers";
import {
  exportToExcelBilledCaseTypesStatsData,
  exportToExcelRevenueCaseTypesStatsData,
} from "@/lib/helpers/billingExportHelpers";
import { Backdrop } from "@mui/material";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import Image from "next/image";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const BillingOverViewCaseTypes = ({
  caseTypesWiseStatsData,
  loading,
  totalRevenueSum,
  queryPreparations,
  dateFilterDefaultValue,
  setDateFilterDefaultValue,
  selectedTabValue,
  setSelectedTabValue,
}: any) => {
  const params = useSearchParams();
  const pathName = usePathname();
  const [selectedDates, setSelectedDates] = useState<any>([]);

  useEffect(() => {
    setSelectedDates([params.get("from_date"), params.get("to_date")]);
  }, [params]);

  //chagedData for pie chart
  const modifyData = (array: Array<any>) => {
    if (array && array.length) {
      let tempArray: any = [];
      array.map((item: any) => {
        tempArray.push({
          name: item["case_type_name"],
          y:
            params?.get("tab") == "revenue"
              ? item["received_amount"]
                ? +item["received_amount"]
                : 0
              : item["billed_amount"]
                ? +item["billed_amount"]
                : 0,
        });
      });
      return tempArray;
    } else return [];
  };

  function getSubtitle() {
    const totalNumber = totalRevenueSum?.[2]?.value;
    return `<span style="font-size: 6px,margin-left:"45px">${params?.get("tab") == "revenue" ? "Total Received" : "Total Billed"
      }</span>
        <br>
        <span style="font-size: 13px;">
            <b>
            ${formatMoney(totalNumber || 0)}</b>
        </span>`;
  }

  // Options for the chart
  const options = {
    chart: {
      type: "pie",
    },
    colors: caseTypesWiseStatsData?.map(
      (item: any) => graphColors[item?.case_type_name]
    ),
    subtitle: {
      useHTML: false,
      text: getSubtitle(),
      floating: true,
      verticalAlign: "middle",
      y: 10,
    },
    title: {
      text: "",
    },
    tooltip: {
      formatter: function (
        this: Highcharts.TooltipFormatterContextObject | any
      ): string {
        return (
          this.point.name +
          "<b>" +
          ": $" +
          Highcharts.numberFormat(this.point.y, 2, ".", ",") +
          "<b>"
        );
      },
    },
    plotOptions: {
      pie: {
        innerSize: "60%", // Make it a donut chart by setting innerSize
        allowPointSelect: true,
        cursor: "pointer",
        dataLabels: {
          enabled: false,
          format: "<b>{point.name}</b>: {point.percentage:.1f} %",
        },
      },
    },
    series: [
      {
        name:
          params?.get("tab") == "revenue" ? "Total Recevied" : "Total Billed",
        colorByPoint: true,
        data: modifyData(caseTypesWiseStatsData),
      },
    ],
  };

  const onChangeData = (fromDate: any, toDate: any) => {
    if (fromDate) {
      setSelectedDates([fromDate, toDate]);
      setDateFilterDefaultValue(changeDateToUTC(fromDate, toDate));
      queryPreparations(fromDate, toDate, params?.get("tab"));
    } else {
      setDateFilterDefaultValue("");
      queryPreparations("", "", params?.get("tab"));
    }
  };

  return (
    <div style={{ position: "relative" }}>
      <div className="eachDataCard" id="billedCaseTypesGraphsData">
        <div className="cardHeader">
          <h3 style={{ textTransform: "capitalize" }}>
            <Image alt="" src="/tableDataIcon.svg" height={20} width={20} />
            Case Types {params?.get("tab")?.toLowerCase()}
          </h3>
          {pathName?.includes("facilities") ? (
            ""
          ) : (
            <>
              <BilledAndRevenueTabs
                selectedTabValue={selectedTabValue}
                setSelectedTabValue={setSelectedTabValue}
              />
              <GlobalDateRangeFilter
                onChangeData={onChangeData}
                dateFilterDefaultValue={dateFilterDefaultValue}
              />

            </>
          )}
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "flex-end",
            }}
          >
            <ExportButton
              onClick={() => {
                if (params?.get("tab") == "billed") {
                  exportToExcelBilledCaseTypesStatsData(
                    caseTypesWiseStatsData,
                    totalRevenueSum
                  );
                } else {
                  exportToExcelRevenueCaseTypesStatsData(
                    caseTypesWiseStatsData,
                    totalRevenueSum
                  );
                }
              }}
              disabled={caseTypesWiseStatsData?.length == 0 ? true : false}
            />
          </div>
        </div>
        <div className="cardBody">
          <div style={{ display: "flex", height: "40vh" }}>
            <div style={{ width: "35%" }}>
              <HighchartsReact
                highcharts={Highcharts}
                options={options}
                containerProps={{
                  style: {
                    height: "280px",
                    width: "280px",
                    background: "none",
                  },
                }}
              />
            </div>
            <TanStackTableComponent
              data={caseTypesWiseStatsData}
              columns={
                params?.get("tab") == "billed"
                  ? BilledOverViewcolumns
                  : RevenueOverViewcolumns
              }
              totalSumValues={totalRevenueSum}
              loading={loading}
            />

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
                  borderRadius: "15px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  background: "rgba(256,256,256,0.8)",
                }}
              >
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
      </div>
    </div>
  );
};

export default BillingOverViewCaseTypes;
