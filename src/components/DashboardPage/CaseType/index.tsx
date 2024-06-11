import ExportButton from "@/components/core/ExportButton/ExportButton";
import GlobalDateRangeFilter from "@/components/core/GlobalDateRangeFilter";
import TanStackTableComponent from "@/components/core/Table/SingleColumn/SingleColumnTable";
import formatMoney from "@/lib/Pipes/moneyFormat";
import { graphColors } from "@/lib/constants";
import { changeDateToUTC, getDatesForStatsCards } from "@/lib/helpers/apiHelpers";
import { exportToExcelCaseTypesVolumes, exportToExcelCaseTypesVolumesForFacilites, exportToExcelCaseTypesVolumesWithoutDayWiseTargets } from "@/lib/helpers/exportsHelpers";
import { Backdrop, Tab, Tabs } from "@mui/material";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import Image from "next/image";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Revenuecolumns, VolumecolumnsForFacilities, VolumecolumnsTargets, VolumecolumnsWithDayWiseTargets } from "./CaseTypesTableColumns";
import { startOfMonth } from "rsuite/esm/internals/utils/date";

const CaseTypes = ({
  caseTypesStatsData,
  loading,
  totalRevenueSum,
  tabValue,
  setTabValue,
  queryPreparations,
  dateFilterDefaultValue,
  setDateFilterDefaultValue,
  dayWiseTargetsEnable
}: any) => {
  const params = useSearchParams();
  const pathName = usePathname();
  const [selectedDates, setSelectedDates] = useState<any>([]);
  const userType = useSelector(
    (state: any) => state.auth.user?.user_details?.user_type
  );

  useEffect(() => {
    setSelectedDates([params.get("from_date"), params.get("to_date")]);
  }, [params]);

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setTabValue(newValue);
    queryPreparations(selectedDates[0], selectedDates[1], newValue);
  };

  //chagedData for pie chart
  const modifyData = (array: Array<any>) => {
    if (array && array.length) {
      let tempArray: any = [];
      array.map((item: any) => {
        tempArray.push({
          name: item["case_type_name"],
          y:
            tabValue == "Revenue"
              ? item["generated_amount"]
                ? +item["generated_amount"]
                : 0
              : item["total_cases"]
                ? +item["total_cases"]
                : 0,
        });
      });
      return tempArray;
    } else return [];
  };



  function getSubtitle() {
    const totalNumber = dayWiseTargetsEnable
      ? totalRevenueSum[3]?.value
      : totalRevenueSum[2]?.value;
    return `<span style="font-size: 6px,margin-left:"45px">${tabValue == "Revenue" ? "Total Billed" : "Total Cases"
      }</span>
        <br>
        <span style="font-size: 13px;">
            <b>
            ${tabValue == "Revenue"
        ? formatMoney(totalNumber || 0)
        : pathName?.includes("facilities") ? totalRevenueSum[1]?.value?.toLocaleString() || 0 : totalNumber?.toLocaleString() || 0
      }</b>
        </span>`;
  }

  // Options for the chart
  const options = {
    chart: {
      type: "pie",
    },
    colors: caseTypesStatsData?.map(
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
        if (tabValue == "Revenue")
          return (
            this.point.name +
            "<b>" +
            ": $" +
            Highcharts.numberFormat(this.point.y, 2, ".", ",") +
            "<b>"
          );
        else
          return (
            this.point.name +
            ":" +
            "<b>" +
            Highcharts.numberFormat(this.point.y, 0, ".", ",") +
            "</b>"
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
        name: "Total cases",
        colorByPoint: true,
        data: modifyData(caseTypesStatsData),
      },
    ],
  };

  const renderTableColoumnsByConditions = () => {
    if (tabValue == "Revenue") {
      return Revenuecolumns;
    }
    else {
      if (pathName.includes("facilities")) {
        return VolumecolumnsForFacilities;
      }
      else {
        return dayWiseTargetsEnable ? VolumecolumnsWithDayWiseTargets : VolumecolumnsTargets;
      }
    }
  }

  const onChangeData = (fromDate: any, toDate: any) => {
    if (fromDate) {
      setSelectedDates([fromDate, toDate]);
      setDateFilterDefaultValue(changeDateToUTC(fromDate, toDate))
      queryPreparations(fromDate, toDate, tabValue);
    }
    else {
      setDateFilterDefaultValue("")
      queryPreparations("", "", tabValue);
    }
  };

  return (
    <div style={{ position: "relative" }}>
      <div className="eachDataCard" id="CaseTypesGraphsData">
        <div className="cardHeader">
          <h3>
            <Image alt="" src="/tableDataIcon.svg" height={20} width={20} />
            Case Types {tabValue}
          </h3>
          {pathName?.includes("dashboard") ? (
            <GlobalDateRangeFilter onChangeData={onChangeData} dateFilterDefaultValue={dateFilterDefaultValue} />
          ) : (
            ""
          )}
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "flex-end",
            }}
          >
            {pathName?.includes("facilities") ? (
              <ExportButton
                onClick={() => {
                  exportToExcelCaseTypesVolumesForFacilites(
                    caseTypesStatsData,
                    totalRevenueSum
                  );
                }}

                disabled={caseTypesStatsData?.length === 0 || tabValue == "Revenue" ? true : false}
              />
            ) : (
              <ExportButton
                onClick={() => {
                  if (dayWiseTargetsEnable) {
                    exportToExcelCaseTypesVolumes(
                      caseTypesStatsData,
                      totalRevenueSum
                    );
                  } else {
                    exportToExcelCaseTypesVolumesWithoutDayWiseTargets(caseTypesStatsData,
                      totalRevenueSum)
                  }

                }}
                disabled={caseTypesStatsData?.length === 0 || tabValue == "Revenue" ? true : false}
              />
            )}
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
              data={caseTypesStatsData}
              columns={renderTableColoumnsByConditions()}
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

export default CaseTypes;
