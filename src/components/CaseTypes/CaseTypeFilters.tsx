import SearchIcon from "@mui/icons-material/Search";
import { Button, TextField } from "@mui/material";
import Grid from "@mui/material/Grid";
import InputAdornment from "@mui/material/InputAdornment";
import { useRouter, useSearchParams } from "next/navigation";
import { ChangeEvent, useEffect, useState } from "react";
import GlobalDateRangeFilter from "../core/GlobalDateRangeFilter";
import { exportToExcelCaseTypesTable } from "@/lib/helpers/exportsHelpers";
import ExportButton from "../core/ExportButton/ExportButton";
import { changeDateToUTC } from "@/lib/helpers/apiHelpers";
const CaseTypeFilters = ({
  onUpdateData,
  queryPreparations,
  dateFilterDefaultValue,
  setDateFilterDefaultValue,
  totalSumValues,
  completeData,
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
          <h4>Case Types</h4>
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
                placeholder="Search Case Types"
                type="search"
                sx={{ cursor: "pointer" }}
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
                  exportToExcelCaseTypesTable(completeData, totalSumValues);
                }}
                disabled={completeData?.length === 0 ? true : false}
              />
            </li>
          </ul>
        </Grid>
      </Grid>
    </div>
  );
};

export default CaseTypeFilters;
