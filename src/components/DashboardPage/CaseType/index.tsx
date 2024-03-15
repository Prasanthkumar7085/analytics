import { useEffect, useState } from "react";
import styles from "./index.module.css";
import { Chart } from "react-google-charts";
import { getCaseTypesStatsAPI } from "@/services/caseTypesAPIs";
import formatMoney from "@/lib/Pipes/moneyFormat";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { Backdrop, Badge, CircularProgress } from "@mui/material";
import TanStackTableComponent from "@/components/core/Table/SingleColumn/SingleColumnTable";
import Image from "next/image";
import GlobalDateRangeFilter from "@/components/core/GlobalDateRangeFilter";
import { usePathname } from "next/navigation";
const CaseTypes = ({
  caseTypesStatsData,
  loading,
  getCaseTypesStats,
  totalRevenueSum,
}: any) => {

  const pathName = usePathname();

  let colors = [
    "#ea1d22",
    "#00a752",
    "#fcf00b",
    "#f19213",
    "#00b0ea",
    "#f51059",
    "#dc79c8",
    "#92298f",
    "#2e3094",
    "#0071b9",
    "#82eedd",
    "	#eea782",
    "#000000",
    "#82a8cd",
    "#e1dbe4",
    "#f6dad3",
    "#87b5af",
    "	#185a59",
  ];


  function formatNumber(amount: any) {
    if (amount >= 10000000) {
      return (amount / 10000000).toFixed(2) + " Cr";
    } else if (amount >= 100000) {
      return (amount / 100000).toFixed(2) + " L";
    } else if (amount >= 1000) {
      return (amount / 1000).toFixed(2) + " K";
    } else {
      return amount.toFixed(2);
    }
  }


  //chagedData for pie chart
  const modifyData = (array: Array<any>) => {
    if (array && array.length) {
      let tempArray: any = [];
      array.map((item: any) => {
        tempArray.push({
          name: item["case_type_name"],
          y: item["volume"] ? +item["volume"] : 0,
        });
      });
      return tempArray;
    } else return [];
  };

  const columns = [
    {
      accessorFn: (row: any) => row.case_type_name,
      id: "case_type_name",
      header: () => <span className={styles.tableHeading}>Case Type</span>,
      cell: (info: any, index: number) => {
        return (
          <span className={styles.caseTypeRow}>
            <div
              className={styles.dot}
              style={{ backgroundColor: colors[info.row.index] }}
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
      accessorFn: (row: any) => row.volume,
      id: "volume",
      cell: (info: any) => (
        <span className={styles.totalCasesRow}>{info.getValue()}</span>
      ),
      header: () => <span className={styles.tableHeading}>Total Cases</span>,
      footer: (props: any) => props.column.id,
      width: "150px",
    },
    {
      accessorFn: (row: any) => row.revenue,
      id: "revenue",
      cell: (info: any) => (
        <span className={styles.revenueBlock}>
          {formatMoney(info.getValue())}
        </span>
      ),
      header: () => <span className={styles.tableHeading}>Revenue</span>,
      footer: (props: any) => props.column.id,
      width: "150px",
    },
  ];

  function getSubtitle() {
    const totalNumber = totalRevenueSum[1] ? totalRevenueSum[1] : 0;
    return `<span style="font-size: 10px,margin-left:"45px">Total value</span>
        <br>
        <span style="font-size: 20px;">
            <b> ${totalNumber}</b>
        </span>`;
  }

  // Options for the chart
  const options = {
    chart: {
      type: "pie",
    },
    colors: colors,
    subtitle: {
      useHTML: true,
      text: getSubtitle(),
      floating: true,
      verticalAlign: "middle",
      y: 10,
    },
    title: {
      text: "",
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
    getCaseTypesStats(fromDate, toDate);
  };

  return (
    <div style={{ position: "relative" }}>
      <div className="eachDataCard" id="CaseTypesGraphsData">
        <div className="cardHeader">
          <h3>
            <Image alt="" src="/tableDataIcon.svg" height={20} width={20} />
            Case Types Volumes
          </h3>
          {pathName?.includes("dashboard") ?
            <GlobalDateRangeFilter onChangeData={onChangeData} /> : ""}
        </div>
        <div className="cardBody">
          <div style={{ display: "flex", height: "37vh" }}>

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


            {caseTypesStatsData?.length ? (
              <TanStackTableComponent
                data={caseTypesStatsData}
                columns={columns}
                totalSumValues={totalRevenueSum}
                loading={false}
              />
            ) : (
              ""
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
                <CircularProgress color="inherit" />
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
