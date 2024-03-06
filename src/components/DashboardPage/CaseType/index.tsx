import { useEffect, useState } from "react";
import styles from "./index.module.css";
import { Chart } from "react-google-charts";
import { getCaseTypesStatsAPI } from "@/services/caseTypesAPIs";
import TanStackTableComponent from "@/components/core/Table/caseTypesTable/TableComponent";
import formatMoney from "@/lib/Pipes/moneyFormat";

const CaseTypes = () => {

  const [loading, setLoading] = useState<boolean>(true)
  const [caseTypesStatsData, setCaseTypesStatsData] = useState<any>([])

  //get the caseTypes data
  const getCaseTypesStats = async () => {
    setLoading(true)
    try {
      const response = await getCaseTypesStatsAPI()
      if (response.status == 200 || response?.status == 201) {
        setCaseTypesStatsData(response?.data)
      }
    }
    catch (err) {
      console.error(err)
    }
    finally {
      setLoading(false)
    }
  }


  //options for the 2nd pie chart
  const PieChart2Options = {
    is3D: false,
    title: "",
    pieHole: 0.5,
    legend: "none"
  }

  //chagedData for pie chart
  const modifyData = (array: Array<any>) => {
    if (array && array.length) {
      let tempArray: any = [["case_type", "total_cases"]];
      array.map((item: any) => {
        tempArray.push([item["case_type"], item["total_cases"] ? +item["total_cases"] : 0]);
      });
      return tempArray
    } else return [];
  };

  const columns = [
    {
      accessorFn: (row: any) => row.case_type,
      id: "case_type",
      header: () => <span>Case Type</span>,
      cell: (info: any) => (
        <span style={{ padding: "40px 10px 40px 10px" }}>
          {info.getValue()}
        </span>
      ),
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
      header: () => <span>Requested By</span>,
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
      header: () => <span>Operation Title</span>,
      footer: (props: any) => props.column.id,
      width: "220px",
    },
  ]
  //call the api for get case types count
  useEffect(() => {
    getCaseTypesStats()
  }, [])

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
      <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", height: "330px", width: "100%" }}>
        {loading ? "" :
          <div style={{
            width: "30%", padding: "8px"
          }}>
            <Chart
              chartType="PieChart"
              data={modifyData(caseTypesStatsData)}
              options={PieChart2Options}
              width={"100%"}
              height={"330px"}
            />
          </div>}
        <div style={{ overflow: "auto", height: "330px", width: "70%" }}>
          <TanStackTableComponent data={caseTypesStatsData} columns={columns} />
        </div>
      </div>
    </div >
  );
};

export default CaseTypes;
