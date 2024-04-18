import SearchIcon from "@mui/icons-material/Search";
import { Autocomplete, Paper, TextField } from "@mui/material";
import Grid from "@mui/material/Grid";
import InputAdornment from "@mui/material/InputAdornment";
import { useRouter, useSearchParams } from "next/navigation";
import { ChangeEvent, useEffect, useState } from "react";
import GlobalDateRangeFilter from "../core/GlobalDateRangeFilter";
const SalesRepsFilters = ({
  onUpdateData,
  queryPreparations,
  dateFilterDefaultValue,
  setDateFilterDefaultValue,
  searchParams,
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
      queryPreparations({ fromDate, toDate });
      setDateFilterDefaultValue([new Date(fromDate), new Date(toDate)]);
    } else {
      setDateFilterDefaultValue("", "");
      queryPreparations({});
    }
  };
  return (
    <div className="tableFiltersContainer">
      <Grid container alignItems="center">
        <Grid item xs={3}>
          <h4>Sales Representatives</h4>
        </Grid>
        <Grid item xs={9}>
          <ul className="filterLists">
            <li className="eachFilterLists">
              <Autocomplete
                PaperComponent={({ children }) => (
                  <Paper
                    style={{
                      fontSize: "12px",
                      fontFamily: "'Poppins', Sans-serif",
                      fontWeight: "500",
                    }}
                  >
                    {children}
                  </Paper>
                )}
                options={statusOptions}
                getOptionLabel={(e: { title: string; value: string }) =>
                  e.title
                }
                renderInput={(params: any) => (
                  <TextField
                    {...params}
                    sx={{ width: "150px" }}
                    placeholder="Select Status"
                  />
                )}
                value={status}
                onChange={onStatusFilterChange}
                sx={{
                  "& .MuiFormControl-root": {
                    width: "250px",
                    background: "#fff",
                    borderRadius: "5px",
                  },
                  "& .MuiInputBase-root": {
                    padding: "2.5px !Important",
                    fontSize: "clamp(12px, 0.72vw, 14px) !important",
                    paddingBlock: "0",
                    fontFamily: "'Poppins', Sans-serif",
                  },
                  "& .MuiInputBase-input": {
                    // paddingRight: "2rem !important",
                    padding: " 2.5px 2rem 2.5px 5px !important",
                    height: "20px",
                  },
                }}
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

export default SalesRepsFilters;
