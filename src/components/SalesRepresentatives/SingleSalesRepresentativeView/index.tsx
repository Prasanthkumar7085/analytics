"use client"
import type { NextPage } from "next";
import styles from "./salesRepresentative.module.css"
import Stats from "@/components/DashboardPage/Stats";
import CaseTypes from "@/components/DashboardPage/CaseType";
import { useEffect, useState } from "react";
import { getStatsDetailsAPI } from "@/services/statsAPIService";
import { useParams } from "next/navigation";
import { getSingleRepCaseTypes } from "@/services/salesRepsAPIs";
import RevenuVolumeCaseTypesDetails from "@/components/CaseTypes/RevenueVolumeCaseTypeDetails";
import SingleSalesRepCaseTypeDetails from "./SingleSalesRepCaseTypeDetails";
import Facilities from "./Facilities";
const SalesRepView = () => {

    const { id } = useParams();
    const [loading, setLoading] = useState<boolean>(true)
    const [revenueStatsDetails, setRevenueStatsDetails] = useState<any>()
    const [volumeStatsDetails, setVolumeStatsDetails] = useState<any>()
    const [caseTypesStatsData, setCaseTypesStatsData] = useState<any>([])

    //get the stats counts
    const getStatsCounts = async () => {

        setLoading(true)
        let urls = [
            `/sales-reps/${id}/stats-revenue`,
            `/sales-reps/${id}/stats-volume`
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
            const response = await getSingleRepCaseTypes(id as string)
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
        if (id) {
            getStatsCounts()
            getCaseTypesStats()
        }
    }, [])

    return (
      <div className={styles.salesrepviewpage}>
        <div className={styles.container}>
          <div className={styles.detailscontainer}>
            <section className={styles.container7}>
              <Stats
                revenueStatsDetails={revenueStatsDetails}
                volumeStatsDetails={volumeStatsDetails}
                loading={loading}
              />

              <CaseTypes
                caseTypesStatsData={caseTypesStatsData}
                loading={loading}
              />
            </section>

            <div className={styles.casetypecontainer}>
              <SingleSalesRepCaseTypeDetails />
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
              </div>
            </div>
            <div className={styles.facilitiescontainer}>
              <div className={styles.facilitiesdetails}>
                <header className={styles.headercontainer}>
                  <div className={styles.header1}>
                    <div className={styles.headingcontainer}>
                      <div className={styles.iconcontainer}>
                        <img className={styles.icon} alt="" src="/icon.svg" />
                      </div>
                      <h3 className={styles.heading}>Facilities</h3>
                    </div>
                  </div>
                </header>
                <Facilities />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
};

export default SalesRepView;
