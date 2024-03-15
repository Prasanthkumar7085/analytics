"use client"
import type { NextPage } from "next";
import styles from "./index.module.css"
import Stats from "@/components/DashboardPage/Stats";
import CaseTypes from "@/components/DashboardPage/CaseType";
import { useEffect, useState } from "react";
import { getStatsDetailsAPI } from "@/services/statsAPIService";
import { useParams } from "next/navigation";
import { getSingleRepCaseTypes } from "@/services/salesRepsAPIs";
import RevenuVolumeCaseTypesDetails from "@/components/CaseTypes/RevenueVolumeCaseTypeDetails";
import Trends from "@/components/Trends";
import InsurancePayors from "@/components/InsurancePayors";
import SingleFacilitieCaseTypeDetails from "./SingleFacilitiesCaseTypeDetails";
import { mapCaseTypeTitleWithCaseType } from "@/lib/helpers/mapTitleWithIdFromLabsquire";
const FacilitiesView = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState<boolean>(true);
  const [revenueStatsDetails, setRevenueStatsDetails] = useState<any>();
  const [volumeStatsDetails, setVolumeStatsDetails] = useState<any>();
  const [caseTypesStatsData, setCaseTypesStatsData] = useState<any>([]);
  const [totalRevenueSum, setTotalSumValues] = useState<any>([]);

  //get the stats counts
  const getStatsCounts = async () => {
    setLoading(true);
    let urls = [
      `/facilities/${id}/stats-revenue`,
      `/facilities/${id}/stats-volume`,
    ];
    try {
      let tempResult: any = [];

      const responses = await Promise.allSettled(
        urls.map(async (url) => {
          const response = await getStatsDetailsAPI(url, '');
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
      setRevenueStatsDetails(tempResult[0]?.data);
      setVolumeStatsDetails(tempResult[1]?.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  //get the caseTypes data
  const getCaseTypesStats = async () => {
    setLoading(true);
    try {
      const response = await getSingleRepCaseTypes(id as string, '');
      if (response.status == 200 || response?.status == 201) {
        let mappedData = response?.data
          ?.map((item: any) => {
            return {
              ...item,
              case_name: mapCaseTypeTitleWithCaseType(item?.case_type),
            };
          })
          ?.filter((e: { total_cases: string }) => e.total_cases);
        setCaseTypesStatsData(mappedData);
        let paidRevenueSum = 0;
        let totalRevenueSum = 0;

        response?.data?.forEach((entry: any) => {
          paidRevenueSum += entry.paid_revenue;
          totalRevenueSum += entry.total_cases ? entry.total_cases : 0;
        });

        const result = ["Total", paidRevenueSum, totalRevenueSum];
        setTotalSumValues(result);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  //api call to get stats count
  useEffect(() => {
    if (id) {
      getStatsCounts();
      getCaseTypesStats();
    }
  }, []);

  return (
    <div className={styles.salesrepviewpage}>
      <div className={styles.container}>
        <div className={styles.detailscontainer}>
          <section className={styles.container7}>
            <div style={{ width: "40%" }}>
              <Stats
                revenueStatsDetails={revenueStatsDetails}
                volumeStatsDetails={volumeStatsDetails}
                loading={loading}
                onChange={() => { }}
              />
            </div>
            <div style={{ width: "60%" }}>
              <CaseTypes
                caseTypesStatsData={caseTypesStatsData}
                loading={loading}
                totalRevenueSum={totalRevenueSum}
              />
            </div>
          </section>

          <div className={styles.casetypecontainer}>
            <SingleFacilitieCaseTypeDetails apiUrl={"facilities"} />
          </div>

          <div className={styles.insurancetrendscontainer}>
            <div className={styles.casetypedetails}>
              <header className={styles.headercontainer}>
                <div className={styles.header1}>
                  <div className={styles.headingcontainer}>
                    <div className={styles.iconcontainer}>
                      <img className={styles.icon} alt="" src="/icon.svg" />
                    </div>
                    <h3 className={styles.heading}>Insurance Payors</h3>
                  </div>
                </div>
              </header>
              <InsurancePayors />
            </div>
            <div className={styles.revenuedetails}>
              <header className={styles.headercontainer3}>
                <div className={styles.header1}>
                  <div className={styles.headingcontainer}>
                    <div className={styles.iconcontainer}>
                      <img className={styles.icon} alt="" src="/icon.svg" />
                    </div>
                    <h3 className={styles.heading}>Trends</h3>
                  </div>
                </div>
              </header>
              <Trends />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FacilitiesView;
