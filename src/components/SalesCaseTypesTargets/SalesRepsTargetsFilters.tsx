import SearchIcon from "@mui/icons-material/Search";
import { TextField } from "@mui/material";
import Grid from "@mui/material/Grid";
import InputAdornment from "@mui/material/InputAdornment";
import { useRouter, useSearchParams } from "next/navigation";
import { ChangeEvent, useEffect, useState } from "react";
import GlobalDateRangeFilter from "../core/GlobalDateRangeFilter";
import GlobalYearFilter from "../core/GlobalYearFilter";
const SalesRepsTargetsFilters = ({
  onUpdateData,
  queryPreparations,
  dateFilterDefaultValue,
  setDateFilterDefaultValue,
  searchParams,
}: any) => {
  const params = useSearchParams();
  const [status, setStatus] = useState("all");
  const [search, setSearch] = useState("");
  const router: any = useRouter();

  useEffect(() => {
    setSearch(params.get("search") ? (params.get("search") as string) : "");
  }, [params]);

  const onChangeData = (year: any) => {
    if (year) {
      queryPreparations({ month: year });
      setDateFilterDefaultValue({ month: year });
    } else {
      setDateFilterDefaultValue({ month: 2024 });
      queryPreparations({ month: "" });
    }
  };
  return (
    <div className="tableFiltersContainer">
      <Grid container alignItems="center">
        <Grid item xs={3}>
          <h4>Sales Representatives Targets</h4>
        </Grid>
        <Grid item xs={9}>
          <ul className="filterLists">
            <li className="eachFilterLists">
              <GlobalYearFilter
                onChangeData={onChangeData}
                defaultYearValue={dateFilterDefaultValue}
                setDefaultYearValue={setDateFilterDefaultValue}
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
          </ul>
        </Grid>
      </Grid>
    </div>
  );
};

export default SalesRepsTargetsFilters;
