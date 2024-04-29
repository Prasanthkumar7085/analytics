import { getUniqueMonthsForAutoCompleted } from "@/lib/helpers/apiHelpers";
import { getSalesRepTargetsAPI } from "@/services/salesTargetsAPIs";
import { Autocomplete, TextField } from "@mui/material";
import dayjs from "dayjs";
import { useEffect, useState } from "react";

const GlobalYearFilter = ({
  onChangeData,
  defaultYearValue,
  setDefaultYearValue,
}: any) => {
  const [autocompleteLoading, setAutoCompleteLoading] =
    useState<boolean>(false);
  const [yearOptions, setYearOptions] = useState<any>([]);

  const getMonthsArrayForCaseTypesWiseTargets = async () => {
    setAutoCompleteLoading(true);
    try {
      const response = await getSalesRepTargetsAPI({});
      if (response.status == 200 || response.status == 201) {
        let uniqueMonths = getUniqueMonthsForAutoCompleted(response?.data);
        let monthyears = uniqueMonths.map((item) => {
          return { month: item };
        });
        setYearOptions(monthyears);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setAutoCompleteLoading(false);
    }
  };

  useEffect(() => {
    getMonthsArrayForCaseTypesWiseTargets();
  }, []);

  return (
    <div>
      <Autocomplete
        value={
          defaultYearValue
            ? defaultYearValue
            : { month: dayjs().format("MM-YYYY") }
        }
        loading={autocompleteLoading}
        disablePortal
        options={yearOptions?.length ? yearOptions : []}
        getOptionLabel={(option: any) =>
          typeof option === "string" ? option : option.month
        }
        onChange={(_: any, newValue: any) => {
          if (newValue?.month) {
            setDefaultYearValue(newValue);
            onChangeData(newValue.month);
          } else {
            setDefaultYearValue("");
            onChangeData("");
          }
        }}
        sx={{
          "& .MuiInputBase-root": {
            padding: "2.5px !Important",
            fontSize: "clamp(12px, 0.72vw, 14px) !important",
            width: "190px",
            height: "35px",
          },
          "& .MuiInputBase-input": {
            paddingRight: "2rem !important",
          },
        }}
        renderInput={(params) => (
          <TextField {...params} placeholder="Select Year" size="small" />
        )}
      />
    </div>
  );
};
export default GlobalYearFilter;
