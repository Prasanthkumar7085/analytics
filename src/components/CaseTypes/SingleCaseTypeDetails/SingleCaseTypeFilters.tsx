import ExportButton from "@/components/core/ExportButton/ExportButton";
import GlobalDateRangeFilter from "@/components/core/GlobalDateRangeFilter";
import SalesRepsAutoComplete from "@/components/core/SalesRepAutoComplete";
import SingleCaseTypesAutoCompleteFilter from "@/components/core/SingleCaseTypesAutoCompleteFilter";
import { changeDateToUTC } from "@/lib/helpers/apiHelpers";
import {
  exportToExcelFacilitiesTable,
  exportToExcelSingleCaseTypeFacilitiesTable,
} from "@/lib/helpers/exportsHelpers";
import SearchIcon from "@mui/icons-material/Search";
import { TextField } from "@mui/material";
import Grid from "@mui/material/Grid";
import InputAdornment from "@mui/material/InputAdornment";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { ChangeEvent, useEffect, useState } from "react";

const SingleCaseTypeFilters = ({
  onUpdateData,
  queryPreparations,
  dateFilterDefaultValue,
  setDateFilterDefaultValue,
  caseTypeFacilityDetails,
  totalSumValue,
  selectedCaseType,
  setSelectedCaseType,
  searchParams,
  caseTypeOptions,
  headerMonths,
  selectedSalesRepValue,
  setSelectedSalesRepValue,
}: any) => {
  console.log(totalSumValue, "Fdsaoiriew");
  const params = useSearchParams();
  const [status, setStatus] = useState("all");
  const [search, setSearch] = useState("");
  const router: any = useRouter();
  const { id } = useParams();
  useEffect(() => {
    setSearch(params.get("search") ? (params.get("search") as string) : "");
    setStatus(params.get("status") ? (params.get("status") as string) : "all");
  }, [params]);

  const onChangeData = (fromDate: any, toDate: any) => {
    if (fromDate) {
      setDateFilterDefaultValue(changeDateToUTC(fromDate, toDate));
      queryPreparations({
        fromDate: fromDate,
        toDate: toDate,
      });
    } else {
      setDateFilterDefaultValue([]);
      queryPreparations({
        fromDate: "",
        toDate: "",
      });
    }
  };
  return (
    <div className="tableFiltersContainer">
      <Grid container alignItems="center">
        <Grid item xs={10}>
          <ul className="filterLists">
            <li className="eachFilterLists">
              <SingleCaseTypesAutoCompleteFilter
                selectedCaseValue={selectedCaseType}
                setSelectedCaseValue={setSelectedCaseType}
                queryParams={searchParams}
                queryPreparations={queryPreparations}
                caseTypeOptions={caseTypeOptions}
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
                placeholder="Search Facility"
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
              <SalesRepsAutoComplete
                selectedSalesRepValue={selectedSalesRepValue}
                setSelectedSalesRepValue={setSelectedSalesRepValue}
                queryParams={searchParams}
                queryPreparations={queryPreparations}
              />
            </li>
            <li className="eachFilterLists">
              <ExportButton
                onClick={() => {
                  exportToExcelSingleCaseTypeFacilitiesTable(
                    caseTypeFacilityDetails,
                    headerMonths,
                    totalSumValue,
                    searchParams
                  );
                }}
                disabled={caseTypeFacilityDetails?.length === 0 ? true : false}
              ></ExportButton>
            </li>
          </ul>
        </Grid>
      </Grid>
    </div>
  );
};

export default SingleCaseTypeFilters;
