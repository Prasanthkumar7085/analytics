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
import { usePathname, useSearchParams } from "next/navigation";
import CountUp from "react-countup";
import { Tab, Tabs } from "@mui/material";

const CaseTypes = ({
  caseTypesStatsData,
  loading,
  getCaseTypesVolumeStats,
  getCaseTypesRevenueStats,
  totalRevenueSum,
  tabValue,
  setTabValue,
}: any) => {
  const params = useSearchParams();
  const pathName = usePathname();
  const [selectedDates, setSelectedDates] = useState<any>([]);

  useEffect(() => {
    setSelectedDates([params.get("from_date"), params.get("to_date")]);
  }, [params]);

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setTabValue(newValue);
    if (newValue == "Revenue") {
      getCaseTypesRevenueStats(selectedDates[0], selectedDates[1]);
    } else {
      getCaseTypesVolumeStats(selectedDates[0], selectedDates[1]);
    }
  };
  let colors: any = {
    CARDIAC: "#ea1d22",
    "CGX PANEL": "#00a752",
    "CLINICAL CHEMISTRY": "#fcf00b",
    COVID: "#f19213",
    "COVID FLU": "#00b0ea",
    DIABETES: "#f51059",
    GASTRO: "#dc79c8",
    "GTI STI": "#92298f",
    "GTI WOMENS HEALTH": "#2e3094",
    NAIL: "#0071b9",
    "PAD ALZHEIMERS": "#82eedd",
    "PGX TEST": "#eea782",
    "PULMONARY PANEL": "#000000",
    "RESPIRATORY PATHOGEN PANEL": "#82a8cd",
    TOXICOLOGY: "#e1dbe4",
    URINANLYSIS: "#f6dad3",
    UTI: "#87b5af",
    WOUND: "#185a59",
  };

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
      header: () => <span className={styles.tableHeading}>Case Type</span>,
      cell: (info: any, index: number) => {
        return (
          <span className={styles.caseTypeRow}>
            <div
              className={styles.dot}
              style={{ backgroundColor: colors[info.getValue()] }}
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
        <span className={styles.totalCasesRow}>{info.getValue()?.toLocaleString()}</span>
      ),
      header: () => <span className={styles.tableHeading}>Total</span>,
      footer: (props: any) => props.column.id,
      width: "150px",
    },
    {
      accessorFn: (row: any) => row.completed_cases,
      id: "completed_cases",
      cell: (info: any) => (
        <span className={styles.totalCasesRow}>{info.getValue()?.toLocaleString()}</span>
      ),
      header: () => <span className={styles.tableHeading}>Finalised</span>,
      footer: (props: any) => props.column.id,
      width: "150px",
    },
    {
      accessorFn: (row: any) => row.pending_cases,
      id: "pending_cases",
      cell: (info: any) => (
        <span className={styles.revenueBlock}>{info.getValue()?.toLocaleString()}</span>
      ),
      header: () => <span className={styles.tableHeading}>Pending</span>,
      footer: (props: any) => props.column.id,
      width: "150px",
    },
  ];

  const Revenuecolumns = [
    {
      accessorFn: (row: any) => row.case_type_name,
      id: "case_type_name",
      header: () => <span className={styles.tableHeading}>Case Type</span>,
      cell: (info: any, index: number) => {
        return (
          <span className={styles.caseTypeRow}>
            <div
              className={styles.dot}
              style={{ backgroundColor: colors[info.getValue()] }}
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
      cell: (info: any) => (
        <span className={styles.totalCasesRow}>
          {formatMoney(info.getValue())}
        </span>
      ),
      header: () => <span className={styles.tableHeading}>Billed</span>,
      footer: (props: any) => props.column.id,
      width: "150px",
    },
    {
      accessorFn: (row: any) => row.paid_amount,
      id: "paid_amount",
      cell: (info: any) => (
        <span className={styles.totalCasesRow}>
          {formatMoney(info.getValue())}
        </span>
      ),
      header: () => <span className={styles.tableHeading}>Collected</span>,
      footer: (props: any) => props.column.id,
      width: "150px",
    },
    {
      accessorFn: (row: any) => row.pending_amount,
      id: "pending_amount",
      cell: (info: any) => (
        <span className={styles.revenueBlock}>
          {formatMoney(info.getValue())}
        </span>
      ),
      header: () => <span className={styles.tableHeading}>Pending</span>,
      footer: (props: any) => props.column.id,
      width: "150px",
    },
  ];

  function getSubtitle() {
    const totalNumber = totalRevenueSum[1]?.value ?
      totalRevenueSum[1]?.value : 0;
    return `<span style="font-size: 6px,margin-left:"45px">Total value</span>
        <br>
        <span style="font-size: 13px;">
            <b> 
            ${tabValue == "Revenue" ? formatMoney(totalNumber) : totalNumber?.toLocaleString()}</b>
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
    setSelectedDates([fromDate, toDate]);
    if (tabValue == "Revenue") {
      getCaseTypesRevenueStats(fromDate, toDate);
    } else {
      getCaseTypesVolumeStats(fromDate, toDate);
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
            <GlobalDateRangeFilter onChangeData={onChangeData} />
          ) : (
            ""
          )}
          <div style={{ display: "flex", justifyContent: "center" }}>
            <Tabs
              value={tabValue}
              onChange={handleChange}
              textColor="secondary"
              indicatorColor="secondary"
              aria-label="secondary tabs example"
            >
              <Tab value="Revenue" label="Revenue" />
              <Tab value="Volume" label="Volume" />
            </Tabs>
          </div>
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
            <TanStackTableComponent
              data={caseTypesStatsData}
              columns={tabValue == "Revenue" ? Revenuecolumns : Volumecolumns}
              totalSumValues={totalRevenueSum}
              loading={false}
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
