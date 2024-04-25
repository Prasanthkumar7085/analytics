import SearchIcon from "@mui/icons-material/Search";
import { Autocomplete, Button, Paper, TextField } from "@mui/material";
import Grid from "@mui/material/Grid";
import InputAdornment from "@mui/material/InputAdornment";
import { useRouter, useSearchParams } from "next/navigation";
import { ChangeEvent, useEffect, useState } from "react";
import GlobalDateRangeFilter from "../core/GlobalDateRangeFilter";
import {
  exportToExcelMonthWiseTargetsVolume,
  exportToExcelSalesRepTable,
} from "@/lib/helpers/exportsHelpers";
const TargetStausFilters = ({
  onUpdateData,
  queryPreparations,
  dateFilterDefaultValue,
  setDateFilterDefaultValue,
  searchParams,
  targetData,
  totalSumValues,
  headerMonths,
}: any) => {
  const params = useSearchParams();
  const [status, setStatus] = useState<any>(null);
  const [search, setSearch] = useState("");
  const [statusOptions] = useState([
    { title: "Target Reached - Yes", value: "true" },
    { title: "Target Reached - No", value: "false" },
  ]);

  useEffect(() => {
    setSearch(params.get("search") ? (params.get("search") as string) : "");

    if (params.get("status")) {
      let obj = statusOptions.find(
        (item) => item.value == params.get("status")
      );
      setStatus(obj ? obj : null);
    }
  }, [params]);
  const onStatusFilterChange = (_: any, newValue: any) => {
    setStatus(newValue);
    if (newValue) {
      onUpdateData({ status: newValue?.value });
    } else {
      onUpdateData({ status: "" });
    }
  };
  const onChangeData = (fromDate: any, toDate: any) => {
    if (fromDate) {
      queryPreparations(fromDate, toDate);
      setDateFilterDefaultValue([new Date(fromDate), new Date(toDate)]);
    } else {
      setDateFilterDefaultValue("", "");
      queryPreparations("", "");
    }
  };
  return (
    <div className="tableFiltersContainer">
      <Grid container alignItems="center">
        <Grid item xs={3}>
          <h4>Sales Representatives Achievements</h4>
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
                placeholder="Search Marketer Name"
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
              <Button
                variant="outlined"
                onClick={() => {
                  exportToExcelMonthWiseTargetsVolume(
                    targetData,
                    headerMonths,
                    totalSumValues
                  );
                }}
              >
                Export
              </Button>
            </li>
          </ul>
        </Grid>
      </Grid>
    </div>
  );
};

export default TargetStausFilters;
