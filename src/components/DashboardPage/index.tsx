"use client"
import { useEffect, useState } from "react";
import CaseType from "./CaseType";
import RevenueBlock from "./Revenue";
import SalesRep from "./SalesRep";
import Stats from "./Stats";
import styles from "./index.module.css";
import { getStatsDetailsAPI } from "@/services/statsAPIService";
import { getCaseTypesStatsAPI } from "@/services/caseTypesAPIs";

const DashboardPage = () => {

  const [loading, setLoading] = useState<boolean>(true)
  const [revenueStatsDetails, setRevenueStatsDetails] = useState<any>()
  const [volumeStatsDetails, setVolumeStatsDetails] = useState<any>()
  const [caseTypesStatsData, setCaseTypesStatsData] = useState<any>([])
  //get the stats counts
  const getStatsCounts = async () => {

    setLoading(true)
    let urls = [
      "/overview/stats-revenue",
      "/overview/stats-volume"
    ];
    try {
      let tempResult: any = [];

      const responses = await Promise.allSettled(
        urls.map(async (url) => {
          const response = await getStatsDetailsAPI(url);
          return response;
        })
      );
      responses.forEach((result, num) => {
        if (result.status === "fulfilled") {
          tempResult.push(result.value);
        }
        if (result.status === "rejected") {
        }
      });
      setRevenueStatsDetails(tempResult[0]?.data)
      setVolumeStatsDetails(tempResult[1]?.data)

    } catch (error) {
      console.error("Error fetching data:", error);
    }
    finally {
      setLoading(false)

    }
  }


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



  //api call to get stats count
  useEffect(() => {
    getStatsCounts()
    getCaseTypesStats()
  }, [])

  return (
    <main className={styles.overviewdetails}>
      <section className={styles.container7}>
        <div style={{ width: "40%" }}>
          <Stats
            revenueStatsDetails={revenueStatsDetails}
            volumeStatsDetails={volumeStatsDetails}
            loading={loading} />
        </div>
        <div style={{ width: "60%" }}>
          <CaseType caseTypesStatsData={caseTypesStatsData} loading={loading} />
        </div>
      </section>
      <section className={styles.container8}>
        <div style={{ width: "40%" }}>

          <RevenueBlock />
        </div>
        <div style={{ width: "60%" }}>
          <SalesRep />
        </div>
      </section>
    </main>
  );
};
export default DashboardPage;
