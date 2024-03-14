"use client";
import type { NextPage } from "next";
import styles from "./salesRepresentative.module.css";
import Stats from "@/components/DashboardPage/Stats";
import CaseTypes from "@/components/DashboardPage/CaseType";
import { useEffect, useState } from "react";
import { getStatsDetailsAPI } from "@/services/statsAPIService";
import { useParams, useRouter } from "next/navigation";
import { getSingleRepCaseTypes } from "@/services/salesRepsAPIs";
import RevenuVolumeCaseTypesDetails from "@/components/CaseTypes/RevenueVolumeCaseTypeDetails";
import SingleSalesRepCaseTypeDetails from "./SingleSalesRepCaseTypeDetails";
import Facilities from "./Facilities";
import Trends from "@/components/Trends";
import InsurancePayors from "@/components/InsurancePayors";
import Image from "next/image";
import {
  mapCaseTypeTitleWithCaseType,
  mapSalesRepNameWithId,
  mapSalesRepWithId,
} from "@/lib/helpers/mapTitleWithIdFromLabsquire";
import { Avatar, Button, IconButton, Typography } from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import Grid from "@mui/material/Grid";
const SalesRepView = () => {
  const { id } = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(true);
  const [revenueStatsDetails, setRevenueStatsDetails] = useState<any>();
  const [volumeStatsDetails, setVolumeStatsDetails] = useState<any>();
  const [caseTypesStatsData, setCaseTypesStatsData] = useState<any>([]);
  const [totalRevenueSum, setTotalSumValues] = useState<any>([]);
  const [salesRepName, setSalesRepName] = useState("");

  //get the stats counts
  const getStatsCounts = async () => {
    setLoading(true);
    let urls = [
      `/sales-reps/${id}/stats-revenue`,
      `/sales-reps/${id}/stats-volume`,
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
      const response = await getSingleRepCaseTypes(id as string);
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
      setLoading(false);
    }
  };

  const getMangerDetails = () => {
    setSalesRepName(mapSalesRepNameWithId(id as string));
  };

  //api call to get stats count
  useEffect(() => {
    if (id) {
      getStatsCounts();
      getCaseTypesStats();
      getMangerDetails();
    } else {
      router.back();
    }
  }, []);

  return (
    <div>
      <div className="salesPersonDataDetails">
        <div className="personDetails">
          <div className="backButton" onClick={() => router.back()}>
            <ArrowBack />
            Back
          </div>
          <Avatar sx={{ height: "30px", width: "30px" }} />
          <Typography>{salesRepName}</Typography>
        </div>
        <Grid container spacing={2}>
          <Grid item xs={4}>
            <Stats
              revenueStatsDetails={revenueStatsDetails}
              volumeStatsDetails={volumeStatsDetails}
              loading={loading}
              onChange={() => { }}
            />
          </Grid>
          <Grid item xs={8}>
            <CaseTypes
              caseTypesStatsData={caseTypesStatsData}
              loading={loading}
              totalRevenueSum={totalRevenueSum}
            />
          </Grid>

          <Grid item xs={12}>
            <SingleSalesRepCaseTypeDetails apiUrl={"sales-reps"} />
          </Grid>
          <Grid item xs={7}>
            <div className="eachDataCard" id="InsurancePayorsData">
              <div className="cardHeader">
                <h3>
                  <Image
                    alt=""
                    src="/tableDataIcon.svg"
                    height={20}
                    width={20}
                  />
                  Insurance Payors
                </h3>
              </div>
              <div className="cardBody">
                <InsurancePayors />
              </div>
            </div>
          </Grid>
          <Grid item xs={5}>
            <div className="eachDataCard" id="TrendsData">
              <div className="cardHeader">
                <h3>
                  <Image
                    alt=""
                    src="/tableDataIcon.svg"
                    height={20}
                    width={20}
                  />
                  Trends
                </h3>
              </div>
              <div className="cardBody">
                <Trends />
              </div>
            </div>
          </Grid>
          <Grid item xs={8}>
            <div className="eachDataCard" id="FacilitiesData">
              <div className="cardHeader">
                <h3>
                  <Image
                    alt=""
                    src="/tableDataIcon.svg"
                    height={20}
                    width={20}
                  />
                  Facilities
                </h3>
              </div>
              <div className="cardBody">
                <Facilities />
              </div>
            </div>
          </Grid>
        </Grid>
      </div>
    </div>
  );
};

export default SalesRepView;
