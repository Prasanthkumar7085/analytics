import { useEffect, useState } from "react";
import styles from "./index.module.css";
import { Chart } from "react-google-charts";
import formatMoney from "@/lib/Pipes/moneyFormat";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { Backdrop, Badge, CircularProgress } from "@mui/material";
import TanStackTableComponent from "@/components/core/Table/SingleColumn/SingleColumnTable";
import Image from "next/image";
import GlobalDateRangeFilter from "@/components/core/GlobalDateRangeFilter";
import { usePathname, useSearchParams } from "next/navigation";
import CountUp from "react-countup";
import { Tab, Tabs } from "@mui/material";
import { graphColors } from "@/lib/constants";

const CaseTypes = ({
  caseTypesStatsData,
  loading,
  totalRevenueSum,
  tabValue,
  setTabValue,
  queryPreparations
}: any) => {

  const params = useSearchParams();
  const pathName = usePathname();
  const [selectedDates, setSelectedDates] = useState<any>([]);

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

  const Volumecolumns = [
    {
      accessorFn: (row: any) => row.case_type_name,
      id: "case_type_name",
      header: () => <span className={styles.tableHeading}>CASE TYPE</span>,
      cell: (info: any, index: number) => {
        return (
          <span className={styles.caseTypeRow}>
            <div
              className={styles.dot}
              style={{ backgroundColor: graphColors[info.getValue()] }}
            ></div>
            {info.getValue()}
          </span>
        );
      },
      footer: (props: any) => props.column.id,
      width: "200px",
      minWidth: "60px",
      maxWidth: "60px",
    },
    {
      accessorFn: (row: any) => row.total_cases,
      id: "total_cases",
      cell: (info: any) => (
        <span className={styles.totalCasesRow}>
          {info.getValue()?.toLocaleString()}
        </span>
      ),
      sortDescFirst: false,
      header: () => <span className={styles.tableHeading}>TOTAL</span>,
      footer: (props: any) => props.column.id,
      width: "150px",
    },
    {
      accessorFn: (row: any) => row.completed_cases,
      id: "completed_cases",
      sortDescFirst: false,
      cell: (info: any) => (
        <span className={styles.totalCasesRow}>
          {info.getValue()?.toLocaleString()}
        </span>
      ),
      header: () => <span className={styles.tableHeading}>FINALIZED</span>,
      footer: (props: any) => props.column.id,
      width: "150px",
    },
    {
      accessorFn: (row: any) => row.pending_cases,
      id: "pending_cases",
      sortDescFirst: false,
      cell: (info: any) => (
        <span className={styles.revenueBlock}>
          {info.getValue()?.toLocaleString()}
        </span>
      ),
      header: () => <span className={styles.tableHeading}>PENDING</span>,
      footer: (props: any) => props.column.id,
      width: "150px",
    },
  ];

  const Revenuecolumns = [
    {
      accessorFn: (row: any) => row.case_type_name,
      id: "case_type_name",
      header: () => <span className={styles.tableHeading}>CASE TYPE</span>,
      cell: (info: any, index: number) => {
        return (
          <span className={styles.caseTypeRow}>
            <div
              className={styles.dot}
              style={{ backgroundColor: graphColors[info.getValue()] }}
            ></div>
            {info.getValue()}
          </span>
        );
      },
      footer: (props: any) => props.column.id,
      width: "200px",
      minWidth: "60px",
      maxWidth: "60px",
    },
    {
      accessorFn: (row: any) => row.generated_amount,
      id: "generated_amount",
      sortDescFirst: false,
      cell: (info: any) => (
        <span className={styles.totalCasesRow}>
          {formatMoney(info.getValue())}
        </span>
      ),
      header: () => <span className={styles.tableHeading}>BILLED</span>,
      footer: (props: any) => props.column.id,
      width: "150px",
    },
    {
      accessorFn: (row: any) => row.paid_amount,
      sortDescFirst: false,
      id: "paid_amount",
      cell: (info: any) => (
        <span className={styles.totalCasesRow}>
          {formatMoney(info.getValue())}
        </span>
      ),
      header: () => <span className={styles.tableHeading}>RECEIVED</span>,
      footer: (props: any) => props.column.id,
      width: "150px",
    },
    {
      accessorFn: (row: any) => row.pending_amount,
      sortDescFirst: false,
      id: "pending_amount",
      cell: (info: any) => (
        <span className={styles.revenueBlock}>
          {formatMoney(info.getValue())}
        </span>
      ),
      header: () => <span className={styles.tableHeading}>ARREARS</span>,
      footer: (props: any) => props.column.id,
      width: "150px",
    },
  ];

  function getSubtitle() {
    const totalNumber = totalRevenueSum[1]?.value
      ? totalRevenueSum[1]?.value
      : 0;
    return `<span style="font-size: 6px,margin-left:"45px">${tabValue == "Revenue" ? "Total Billed" : "Total Cases"}</span>
        <br>
        <span style="font-size: 13px;">
            <b> 
            ${tabValue == "Revenue"
        ? formatMoney(totalNumber)
        : totalNumber?.toLocaleString()
      }</b>
        </span>`;
  }

  // Options for the chart
  const options = {
    chart: {
      type: "pie",
    },
    colors: caseTypesStatsData?.map((item: any) => graphColors[item?.case_type_name]),
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
            ": $" + Highcharts.numberFormat(this.point.y, 2, ".", ",") + "<b>"
          );
        else
          return (

            this.point.name + ":" +
            "<b>" + Highcharts.numberFormat(this.point.y, 0, ".", ",") +
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

  const onChangeData = (fromDate: any, toDate: any) => {
    setSelectedDates([fromDate, toDate]);
    queryPreparations(fromDate, toDate, tabValue);
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
            <GlobalDateRangeFilter onChangeData={onChangeData} />
          ) : (
            ""
          )}
          <div style={{ display: pathName?.includes("dashboard") ? "flex" : "none", justifyContent: "center" }}>
            <Tabs
              className="overViewTabs"
              value={tabValue}
              onChange={handleChange}
              textColor="secondary"
              indicatorColor="secondary"
              aria-label="secondary tabs example"
            >
              <Tab value="Volume" label="Volume" />
              <Tab value="Revenue" label="Revenue" />
            </Tabs>
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
              columns={tabValue == "Revenue" ? Revenuecolumns : Volumecolumns}
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
