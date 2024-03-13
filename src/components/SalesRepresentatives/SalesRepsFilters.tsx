import { MenuItem, Select, TextField } from "@mui/material";
import GlobalDateRangeFilter from "../core/GlobalDateRangeFilter";
import styles from "./salesreps-filters.module.css";
import { ChangeEvent, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Grid from "@mui/material/Grid";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";
const SalesRepsFilters = ({
  onUpdateData,
}: {
  onUpdateData: ({
    status,
    search,
  }: Partial<{
    status: string;
    search: string;
  }>) => void;
}) => {
  const params = useSearchParams();
  const [status, setStatus] = useState("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    setSearch(params.get("search") ? (params.get("search") as string) : "");
    setStatus(params.get("status") ? (params.get("status") as string) : "all");
  }, [params]);
  return (
    <div className="tableFiltersContainer">
      <Grid container alignItems="center">
        <Grid item xs={3}>
          <h4>Sales Representatives</h4>
        </Grid>
        <Grid item xs={9}>
          <ul className="filterLists">
            <li className="eachFilterLists">
              <Select
                onChange={(e: any) => {
                  setStatus(e.target.value);
                  onUpdateData({ status: e.target.value });
                }}
                value={status}
                className="targetFilter"
                placeholder="Target Reached"
              >
                <MenuItem value={"all"}>All</MenuItem>
                <MenuItem value={"yes"}>Yes</MenuItem>
                <MenuItem value={"no"}>No</MenuItem>
              </Select>
            </li>
            <li className="eachFilterLists">
              <GlobalDateRangeFilter onChange={() => {}} />
            </li>
            <li className="eachFilterLists">
              <TextField
                placeholder="Search"
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

export default SalesRepsFilters;
