import { Button, MenuItem, Select, TextField } from "@mui/material";
import GlobalDateRangeFilter from "../core/GlobalDateRangeFilter";
import styles from "./facilities-filters.module.css";
import { ChangeEvent, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Grid from "@mui/material/Grid";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";
import { exportToExcelInsurancesTable } from "@/lib/helpers/exportsHelpers";
import ExportButton from "../core/ExportButton/ExportButton";
import { changeDateToUTC } from "@/lib/helpers/apiHelpers";
const InsurancesFilters = ({
  totalSumValues,
  completeData,
  onUpdateData,
  queryPreparations,
  dateFilterDefaultValue,
  setDateFilterDefaultValue,
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
              <GlobalDateRangeFilter
                onChangeData={onChangeData}
                dateFilterDefaultValue={dateFilterDefaultValue}
              />
            </li>
            <li className="eachFilterLists">
              <TextField
                placeholder="Search Insurance Name"
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
                  exportToExcelInsurancesTable(completeData, totalSumValues);
                }}
              />
            </li>
          </ul>
        </Grid>
      </Grid>
    </div>
  );
};

export default InsurancesFilters;
