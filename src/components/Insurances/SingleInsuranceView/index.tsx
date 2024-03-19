"use client"
import Trends from "@/components/Trends";
import GlobalDateRangeFilter from "@/components/core/GlobalDateRangeFilter";
import { Avatar, Grid } from "@mui/material";
import { useParams, usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowBack } from "@mui/icons-material";
import SingleColumnTable from "@/components/core/Table/SingleColumn/SingleColumnTable";
import { getInsurancesCaseTypesAPI } from "@/services/insurancesAPI";
import formatMoney from "@/lib/Pipes/moneyFormat";
import InsuranceCaseTypes from "./InsuranceCaseTypes";

const InsuranceView = () => {
    const { id } = useParams();
    const router = useRouter();
    const pathName = usePathname();
    const [loading, setLoading] = useState<boolean>(true);
    const params = useSearchParams();
    const [searchParams, setSearchParams] = useState(
        Object.fromEntries(new URLSearchParams(Array.from(params.entries())))
    );

    useEffect(() => {
        setSearchParams(
            Object.fromEntries(new URLSearchParams(Array.from(params.entries())))
        );
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
                                    <p>{"poiuytr"}</p>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
                <div className="personData">
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <InsuranceCaseTypes searchParams={searchParams} />
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