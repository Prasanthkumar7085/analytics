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
    router.push(`${pathname}${queryString}`);
  };

  useEffect(() => {
    setSearchParams(
      Object.fromEntries(new URLSearchParams(Array.from(params.entries())))
    );
  }, [params]);

  return (
    <div>
      <Tabs
        value={selectedTabValue == "billed" ? 0 : 1}
        onChange={handleChange}
        centered
      >
        <Tab label="billed" />
        <Tab label="revenue" />
      </Tabs>
    </div>
  );
};
export default BilledAndRevenueTabs;
