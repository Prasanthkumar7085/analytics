"use client"
import type { NextPage } from "next";
import styles from "./index.module.css"
import Stats from "@/components/DashboardPage/Stats";
import CaseTypes from "@/components/DashboardPage/CaseType";
import { useEffect, useState } from "react";
import { getStatsDetailsAPI } from "@/services/statsAPIService";
import { useParams, usePathname, useRouter, useSearchParams } from "next/navigation";
import { getSingleRepCaseTypes } from "@/services/salesRepsAPIs";
import RevenuVolumeCaseTypesDetails from "@/components/CaseTypes/RevenueVolumeCaseTypeDetails";
import Trends from "@/components/Trends";
import InsurancePayors from "@/components/InsurancePayors";
import SingleFacilitieCaseTypeDetails from "./SingleFacilitiesCaseTypeDetails";
import { mapCaseTypeTitleWithCaseType } from "@/lib/helpers/mapTitleWithIdFromLabsquire";
import { prepareURLEncodedParams } from "@/lib/prepareUrlEncodedParams";
import { getSingleFacilityCaseTypes } from "@/services/facilitiesAPIs";
import { ArrowBack } from "@mui/icons-material";
import GlobalDateRangeFilter from "@/components/core/GlobalDateRangeFilter";
import { Avatar } from "@mui/material";

const FacilitiesView = () => {
  const { id } = useParams();
  const router = useRouter();
  const pathName = usePathname();
  const [loading, setLoading] = useState<boolean>(true);
  const [revenueStatsDetails, setRevenueStatsDetails] = useState<any>();
  const [volumeStatsDetails, setVolumeStatsDetails] = useState<any>();
  const [caseTypesStatsData, setCaseTypesStatsData] = useState<any>([]);
  const [totalRevenueSum, setTotalSumValues] = useState<any>([]);
  const params = useSearchParams();
  const [searchParams, setSearchParams] = useState(
    Object.fromEntries(new URLSearchParams(Array.from(params.entries())))
  );
  const [dateFilterDefaultValue, setDateFilterDefaultValue] = useState<any>()
  const [caseTypeLoading, setCaseTypeLoading] = useState(true)
  //get the stats counts
  const getStatsCounts = async (fromDate: any, toDate: any) => {
    setLoading(true);
    let urls = [
      `/facilities/${id}/stats-revenue`,
      `/facilities/${id}/stats-volume`,
    ];
    try {
      let queryParams: any = {};

      if (fromDate) {
        queryParams["from_date"] = fromDate;
      }
      if (toDate) {
        queryParams["to_date"] = toDate;
      }

      let queryString = prepareURLEncodedParams("", queryParams);

      router.push(`${pathName}${queryString}`);

      let tempResult: any = [];

      const responses = await Promise.allSettled(
        urls.map(async (url) => {
          const response = await getStatsDetailsAPI(url, "");
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
  const getCaseTypesStats = async (fromDate: any, toDate: any) => {
    setCaseTypeLoading(true);
    try {
      let queryParams: any = {};

      if (fromDate) {
        queryParams["from_date"] = fromDate;
      }
      if (toDate) {
        queryParams["to_date"] = toDate;
      }
      const response = await getSingleFacilityCaseTypes(id as string, "");
      if (response.status == 200 || response?.status == 201) {

        setCaseTypesStatsData(response?.data);

        let paidRevenueSum = 0;
        let totalRevenueSum = 0;

        response?.data?.forEach((entry: any) => {
          paidRevenueSum += entry.revenue ? +entry.revenue : 0;
          totalRevenueSum += entry.volume ? +entry.volume : 0;
        });

        const result = ["Total", totalRevenueSum, paidRevenueSum];
        setTotalSumValues(result);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setCaseTypeLoading(false);
    }
  };

  useEffect(() => {
    setSearchParams(
      Object.fromEntries(new URLSearchParams(Array.from(params.entries())))
    );
  }, [params]);

  const onChangeData = (fromDate: any, toDate: any) => {
    if (fromDate) {
      getStatsCounts(fromDate, toDate);
      getCaseTypesStats(fromDate, toDate);
      setDateFilterDefaultValue([new Date(fromDate), new Date(toDate)])
    }
    else {
      setDateFilterDefaultValue("")
      getStatsCounts("", "");
      getCaseTypesStats("", "");
      router.push(`/facilities/${id}`)
    }
  };

  //api call to get stats count
  useEffect(() => {
    if (id) {
      getStatsCounts(searchParams?.from_date, searchParams?.to_date);
      getCaseTypesStats(searchParams?.from_date, searchParams?.to_date);
    }
    if (searchParams?.from_date) {
      setDateFilterDefaultValue([new Date(searchParams?.from_date), new Date(searchParams?.to_date)])
    }
  }, []);

  return (
    <div className={styles.salesrepviewpage}>

      <div className={styles.container}>
        <div className="personDetails" style={{ width: "100%" }}>
          <div
            onClick={() => router.back()}
            className="w-[30px] h-[30px] border border-[#BF1B39] flex items-center justify-center mr-5 rounded cursor-pointer hover:bg-#bf1b39"
          >
            <ArrowBack className="w-[20px] text-[#bf1b39]" />
          </div>
          <div className="person flex items-center">
            <Avatar sx={{ height: "30px", width: "30px" }} />
            <p className="pl-3">{"fd"}</p>
          </div>
          <div style={{ marginLeft: "70%" }}>
            <GlobalDateRangeFilter onChangeData={onChangeData} dateFilterDefaultValue={dateFilterDefaultValue} />
          </div>
        </div>
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
                loading={caseTypeLoading}
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
