import { useEffect, useState } from "react";
import styles from "./index.module.css";
import { Chart } from "react-google-charts";
import { getCaseTypesStatsAPI } from "@/services/caseTypesAPIs";
import TanStackTableComponent from "@/components/core/Table/caseTypesTable/TableComponent";
import formatMoney from "@/lib/Pipes/moneyFormat";
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { Badge } from "@mui/material";
const CaseTypes = ({ caseTypesStatsData, loading }: any) => {


  let colors = ['#ea1d22', '#00a752', '#fcf00b', '#f19213', '#00b0ea', '#f51059', '#dc79c8', '#92298f', '#2e3094', '#0071b9']


  //chagedData for pie chart
  const modifyData = (array: Array<any>) => {
    if (array && array.length) {
      let tempArray: any = [];
      array.map((item: any) => {
        tempArray.push({ name: item["case_type"], y: item["total_cases"] ? +item["total_cases"] : 0 });
      });
      return tempArray
    } else return [];
  };

  const columns = [
    {
      accessorFn: (row: any) => row.case_type,
      id: "case_type",
      header: () => <span>Case Type</span>,
      cell: (info: any, index: number) => {
        console.log(info, "we")
        return (
          <span style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: "0.5rem" }}>
            <div className={styles.dot} style={{ backgroundColor: colors[info.row.index] }}></div>
            {info.getValue()}
          </span>
        )
      },
      footer: (props: any) => props.column.id,
      width: "60px",
      minWidth: "60px",
      maxWidth: "60px",
    },
    {
      accessorFn: (row: any) => row.total_cases,
      id: "total_cases",
      cell: (info: any) => (
        <span style={{ padding: "40px 10px 40px 10px" }}>
          {info.getValue()}
        </span>
      ),
      header: () => <span>Total Cases</span>,
      footer: (props: any) => props.column.id,
      width: "150px",
    },
    {
      accessorFn: (row: any) => row.paid_revenue,
      id: "paid_revenue",
      cell: (info: any) => (
        <span style={{ padding: "40px 10px 40px 10px" }}>
          {formatMoney(info.getValue())}
        </span>
      ),
      header: () => <span>Revenue</span>,
      footer: (props: any) => props.column.id,
      width: "150px",
    },
  ]


  function getSubtitle() {
    const totalNumber = 43243;
    return `<span style="font-size: 10px">Total value</span>
        <br>
        <span style="font-size: 20px;">
            <b> ${totalNumber}</b> 
        </span>`;
  }

  // Options for the chart
  const options = {
    chart: {
      type: 'pie',
    },
    colors: colors,
    subtitle: {
      useHTML: true,
      text: getSubtitle(),
      floating: true,
      verticalAlign: 'middle',
      y: 10
    },
    title: {
      text: ''
    },
    plotOptions: {
      pie: {
        innerSize: '60%', // Make it a donut chart by setting innerSize
        allowPointSelect: true,
        cursor: 'pointer',
        dataLabels: {
          enabled: false,
          format: '<b>{point.name}</b>: {point.percentage:.1f} %'
        }
      }
    },
    series: [{
      name: 'Total cases',
      colorByPoint: true,
      data: modifyData(caseTypesStatsData)
    }],

  };



  return (
    <div className={styles.stats1}>
      <div className={styles.header}>
        <div className={styles.headingcontainer}>
          <div className={styles.iconcontainer}>
            <img className={styles.icon} alt="" src="/navbar/icon.svg" />
          </div>
          <div className={styles.heading}>Case Types</div>
        </div>
        <div className={styles.datepicker}>
          <img
            className={styles.calendericon}
            alt=""
            src="//navbarcalendericon.svg"
          />
          <div className={styles.daterange}>
            <div className={styles.startDate}>Start Date</div>
            <div className={styles.div}>-</div>
            <div className={styles.startDate}>End Date</div>
          </div>
        </div>
      </div>

      <div style={{ height: "335px", width: "100%", display: "flex" }}>
        {loading ? "" :
          <div style={{ flex: "1", marginRight: "10px" }}>
            <HighchartsReact
              highcharts={Highcharts}
              options={options}
              containerProps={{ style: { height: '100%', width: '100%' } }}
            />
          </div>
        }
        {caseTypesStatsData?.length ?
          <div style={{ flex: "1", overflow: "auto" }}>
            <TanStackTableComponent data={caseTypesStatsData} columns={columns} />
          </div> : ""}
      </div>

    </div >
  );
};

export default CaseTypes;
