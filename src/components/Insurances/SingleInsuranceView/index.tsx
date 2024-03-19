"use client"
import Trends from "@/components/Trends";
import GlobalDateRangeFilter from "@/components/core/GlobalDateRangeFilter";
import { Avatar, Grid } from "@mui/material";
import { useParams, usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowBack } from "@mui/icons-material";
import SingleColumnTable from "@/components/core/Table/SingleColumn/SingleColumnTable";
import { getInsurancesCaseTypesAPI, getSingleInsurancesDetailsAPI } from "@/services/insurancesAPI";
import formatMoney from "@/lib/Pipes/moneyFormat";
import InsuranceCaseTypes from "./InsuranceCaseTypes";
import { prepareURLEncodedParams } from "@/lib/prepareUrlEncodedParams";

const InsuranceView = () => {
    const { id } = useParams();
    const router = useRouter();
    const pathName = usePathname();
    const [loading, setLoading] = useState<boolean>(true);
    const [singleInsuranceDetails, setSingleInsuranceDetails] = useState<any>()
    const params = useSearchParams();
    const [searchParams, setSearchParams] = useState(
        Object.fromEntries(new URLSearchParams(Array.from(params.entries())))
    );
    const [dateFilterDefaultValue, setDateFilterDefaultValue] = useState<any>()
    const [insuranceData, setInsuranceData] = useState([]);
    const [totalInsurancePayors, setTortalInsurancePayors] = useState<any[]>([]);


    //get single Insurance details
    const getSingleInsuranceDetails = async () => {
        setLoading(true);
        try {
            const response = await getSingleInsurancesDetailsAPI(id as string);
            if (response.status == 200 || response?.status == 201) {
                setSingleInsuranceDetails(response?.data);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };



    const getSingleInsuranceCaseTypesDetails = async (fromDate: any, toDate: any) => {
        setLoading(true)
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

            const response = await getInsurancesCaseTypesAPI(
                id as string, queryParams
            );
            if (response?.status == 200 || response?.status == 201) {
                setInsuranceData(response?.data);
                let totalVolume = 0;
                let completeVolume = 0;
                let expectedAmount = 0;
                let totalAmount = 0;
                let pendingVolume = 0;
                let totalPaid = 0;
                let totalPending = 0;


                response?.data?.forEach((entry: any) => {
                    totalVolume += entry.total_cases ? + entry.total_cases : 0;
                    completeVolume += entry.completed_cases ? +entry.completed_cases : 0;
                    totalAmount += entry.generated_amount ? +entry.generated_amount : 0;
                    expectedAmount += entry.expected_amount ? +entry.expected_amount : 0;
                    totalPaid += entry.paid_amount ? +entry.paid_amount : 0;
                    pendingVolume += entry.pending_cases ? +entry.pending_cases : 0;
                    totalPending += entry.pending_amount ? +entry.pending_amount : 0;
                });

                const result = [
                    { value: "Total", dolorSymbol: false },
                    { value: totalVolume, dolorSymbol: false },
                    { value: completeVolume, dolorSymbol: false },
                    { value: totalAmount, dolorSymbol: true },
                    { value: expectedAmount, dolorSymbol: true },
                    { value: totalPaid, dolorSymbol: true },
                    { value: pendingVolume, dolorSymbol: false },
                    { value: totalPending, dolorSymbol: true },
                    { value: null, dolorSymbol: false },
                    { value: null, dolorSymbol: false },
                ];

                setTortalInsurancePayors(result);
            }
        } catch (err) {
            console.error(err);
        }
        finally {
            setLoading(false)
        }
    };




    const onChangeData = (fromDate: any, toDate: any) => {
        if (fromDate) {
            setDateFilterDefaultValue([new Date(fromDate), new Date(toDate)])
            getSingleInsuranceCaseTypesDetails(fromDate, toDate);

        }
        else {
            setDateFilterDefaultValue([]);
            getSingleInsuranceCaseTypesDetails("", "");
        }
    };

    useEffect(() => {
        getSingleInsuranceDetails()
        getSingleInsuranceCaseTypesDetails(searchParams?.from_date, searchParams?.to_date);
    }, [searchParams]);

    useEffect(() => {
        setSearchParams(
            Object.fromEntries(new URLSearchParams(Array.from(params.entries())))
        );
        if (searchParams?.from_date) {
            setDateFilterDefaultValue([new Date(searchParams?.from_date), new Date(searchParams?.to_date)])
        }
    }, [params]);

    return (
        <div>
            <div className="salesPersonDataDetails">
                <div className="personDetails">
                    <div className="flex items-center w-[250px]">
                        <div>
                            <div
                                onClick={() => router.back()}
                                className="w-[30px] h-[30px] border border-[#BF1B39] flex items-center justify-center mr-5 rounded cursor-pointer hover:bg-#bf1b39"
                            >
                                <ArrowBack className="w-[20px] text-[#bf1b39]" />
                            </div>
                        </div>
                        <div style={{ width: "40%", display: "flex", flexDirection: "row" }}>
                            <div className="person flex items-center">
                                <Avatar sx={{ height: "30px", width: "30px" }} />
                                <div className="pl-3">
                                    <p>{singleInsuranceDetails?.[0]?.insurance_payor_name}</p>
                                </div>
                            </div>

                        </div>
                    </div>
                    <div style={{ display: "flex", flexDirection: "row", justifyContent: "flex-end", width: "100%" }}>
                        <GlobalDateRangeFilter onChangeData={onChangeData} dateFilterDefaultValue={dateFilterDefaultValue} />
                    </div>
                </div>
                <div className="personData">
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <InsuranceCaseTypes searchParams={searchParams} insuranceData={insuranceData} totalInsurancePayors={totalInsurancePayors} loading={loading} />
                        </Grid>

                        <Grid item xs={12}>
                            <Trends searchParams={searchParams} apiurl={"insurances"} />
                        </Grid>
                    </Grid>
                </div>
            </div>
        </div>
    )
}
export default InsuranceView;