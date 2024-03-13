import { useEffect, useState } from "react";
import styles from "./index.module.css";
import { Chart } from "react-google-charts";
import { getCaseTypesStatsAPI } from "@/services/caseTypesAPIs";
import formatMoney from "@/lib/Pipes/moneyFormat";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { Badge } from "@mui/material";
import TanStackTableComponent from "@/components/core/Table/SingleColumn/SingleColumnTable";
import Image from "next/image";
import GlobalDateRangeFilter from "@/components/core/GlobalDateRangeFilter";
const CaseTypes = ({
  caseTypesStatsData,
  loading,
  getCaseTypesStats,
  totalRevenueSum,
}: any) => {
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

  //chagedData for pie chart
  const modifyData = (array: Array<any>) => {
    if (array && array.length) {
      let tempArray: any = [];
      array.map((item: any) => {
        tempArray.push({
          name: item["case_type"],
          y: item["total_cases"] ? +item["total_cases"] : 0,
        });
      });
      return tempArray;
    } else return [];
  };

  const columns = [
    {
      accessorFn: (row: any) => row.case_name,
      id: "case_name",
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
      accessorFn: (row: any) => row.total_cases,
      id: "total_cases",
      cell: (info: any) => (
        <span className={styles.totalCasesRow}>{info.getValue()}</span>
      ),
      header: () => <span className={styles.tableHeading}>Total Cases</span>,
      footer: (props: any) => props.column.id,
      width: "150px",
    },
    {
      accessorFn: (row: any) => row.paid_revenue,
      id: "paid_revenue",
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
    const totalNumber = totalRevenueSum[1];
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

  return (
    <div>
      <div className="eachDataCard" id="CaseTypesData">
        <div className="cardHeader">
          <h3>
            <Image alt="" src="/tableDataIcon.svg" height={20} width={20} />
            Case Types / Graphs
          </h3>
          <GlobalDateRangeFilter onChange={() => {}} />
        </div>
        <div className="cardBody">
          <div style={{ display: "flex", height: "37vh" }}>
            {loading ? (
              ""
            ) : (
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
            )}

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
          </div>
        </div>
      </div>
    </div>
  );
};

export default CaseTypes;
