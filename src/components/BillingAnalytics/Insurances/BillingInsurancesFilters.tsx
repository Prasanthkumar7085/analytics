import BilledAndRevenueTabs from "@/components/core/BilledAndRevenueTabs";
import ExportButton from "@/components/core/ExportButton/ExportButton";
import GlobalDateRangeFilter from "@/components/core/GlobalDateRangeFilter";
import { changeDateToUTC } from "@/lib/helpers/apiHelpers";
import {
  exportToExcelBilledInsurancesData,
  exportToExcelRevenueInsurancesData,
} from "@/lib/helpers/billingExportHelpers";
import { exportToExcelFacilitiesTable } from "@/lib/helpers/exportsHelpers";
import SearchIcon from "@mui/icons-material/Search";
import { TextField } from "@mui/material";
import Grid from "@mui/material/Grid";
import InputAdornment from "@mui/material/InputAdornment";
import { useRouter, useSearchParams } from "next/navigation";
import { ChangeEvent, useEffect, useState } from "react";

const BillingInsurancesFilters = ({
  onUpdateData,
  queryPreparations,
  dateFilterDefaultValue,
  setDateFilterDefaultValue,
  insuranceData,
  totalSumValue,
  selectedTabValue,
  setSelectedTabValue,
}: any) => {
  const params = useSearchParams();
  const [status, setStatus] = useState("all");
  const [search, setSearch] = useState("");
  const router: any = useRouter();
  useEffect(() => {
    setSearch(params.get("search") ? (params.get("search") as string) : "");
    setStatus(params.get("status") ? (params.get("status") as string) : "all");
  }, [params]);

  const onChangeData = (fromDate: any, toDate: any) => {
    if (fromDate) {
      queryPreparations({ fromDate, toDate });
      setDateFilterDefaultValue(changeDateToUTC(fromDate, toDate));
    } else {
      setDateFilterDefaultValue("", "");
      queryPreparations({});
    }
  };
  return (
    <div className="tableFiltersContainer">
      <Grid container alignItems="center">
        <Grid item xs={3}>
          <h4>Insurances</h4>
        </Grid>
        <Grid item xs={9}>
          <ul className="filterLists">
            <li className="eachFilterLists">
              <BilledAndRevenueTabs
                selectedTabValue={selectedTabValue}
                setSelectedTabValue={setSelectedTabValue}
              />
            </li>
            <li className="eachFilterLists">
              <GlobalDateRangeFilter
                onChangeData={onChangeData}
                dateFilterDefaultValue={dateFilterDefaultValue}
              />
            </li>
            <li className="eachFilterLists">
              <TextField
                placeholder="Search Insurance name"
                type="search"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
                value={search}
                className="formItemInput"
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  setSearch(e.target.value);
                  onUpdateData({ search: e.target.value });
                }}
              />
            </li>
            <li className="eachFilterLists">
              <ExportButton
                onClick={() => {
                  if (params?.get("tab") == "billed") {
                    exportToExcelBilledInsurancesData(
                      insuranceData,
                      totalSumValue
                    );
                  } else {
                    exportToExcelRevenueInsurancesData(
                      insuranceData,
                      totalSumValue
                    );
                  }
                }}
                disabled={insuranceData?.length === 0 ? true : false}
              ></ExportButton>
            </li>
          </ul>
        </Grid>
      </Grid>
    </div>
  );
};

export default BillingInsurancesFilters;
