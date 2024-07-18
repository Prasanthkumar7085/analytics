import { graphColors } from "@/lib/constants";
import {
  rearrangeDataWithCasetypes,
  rearrangeDataWithCasetypesInFilters,
} from "@/lib/helpers/apiHelpers";
import { getAllCaseTypesListAPI } from "@/services/caseTypesAPIs";
import { Autocomplete, Box, Paper, Tab, Tabs, TextField } from "@mui/material";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { prepareURLEncodedParams } from "../utils/prepareUrlEncodedParams";
import "../core/BilledAndRevenueTabs.scss";
import Image from "next/image";
const BilledAndRevenueTabs = ({
  selectedTabValue,
  setSelectedTabValue,
}: any) => {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [searchParams, setSearchParams] = useState(
    Object.fromEntries(new URLSearchParams(Array.from(params.entries())))
  );
  const [value, setValue] = useState(0);

  const handleChange = (event: any, newValue: number) => {
    setValue(newValue);
    setSelectedTabValue(event.target.textContent);
    let queryParams: any = {
      ...searchParams,
      tab: newValue == 0 ? "billed" : "revenue",
    };
    let queryString = prepareURLEncodedParams("", queryParams);
    router.replace(`${pathname}${queryString}`);
  };

  useEffect(() => {
    setSearchParams(
      Object.fromEntries(new URLSearchParams(Array.from(params.entries())))
    );
  }, [params]);

  return (
    <div>
      <Tabs
        value={value}
        onChange={handleChange}
        centered
        className="billing-revenue-tabs"
      >
        <Tab
          label={
            <div
              style={{ display: "flex", alignItems: "center" }}
              className="gap-2"
            >
              {params?.get("tab") == "billed" ? (
                <Image
                  src="/billing-active.svg"
                  alt="billed-active"
                  width={15}
                  height={15}
                />
              ) : (
                <Image src="/billing.svg" alt="billed" width={15} height={15} />
              )}
              Billed
            </div>
          }
        />
        <Tab
          label={
            <div
              style={{ display: "flex", alignItems: "center" }}
              className="gap-2"
            >
              {params?.get("tab") == "revenue" ? (
                <Image
                  src="/revenue-active.svg"
                  alt="revenue-active"
                  width={15}
                  height={15}
                />
              ) : (
                <Image
                  src="/revenue.svg"
                  alt="revenue"
                  width={15}
                  height={15}
                />
              )}
              Revenue
            </div>
          }
        />
      </Tabs>
    </div>
  );
};
export default BilledAndRevenueTabs;
