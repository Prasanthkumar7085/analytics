import { Autocomplete, TextField } from "@mui/material";

const GlobalYearFilter = ({ onChangeData, defaultYearValue, setDefaultYearValue }: any) => {
    let yearOptions = [
      { month: "04-2024" },
      { month: "03-2024" },
      { month: "02-2024" },
      { month: "01-2024" },
      { month: "12-2023" },
      { month: "11-2023" },
      { month: "10-2023" },
      { month: "09-2023" },
      { month: "08-2023" },
      { month: "07-2023" },
      { month: "06-2023" },
      { month: "05-2023" },
      { month: "04-2023" },
      { month: "03-2023" },
      { month: "02-2023" },
      { month: "01-2023" },
    ];
    return (
      <div>
        <Autocomplete
          value={defaultYearValue ? defaultYearValue : { month: "04-2024" }}
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
}
export default GlobalYearFilter;