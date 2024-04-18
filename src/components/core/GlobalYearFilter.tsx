import { Autocomplete, TextField } from "@mui/material";

const GlobalYearFilter = ({ onChangeData, defaultYearValue, setDefaultYearValue }: any) => {
    let yearOptions = [
        { year: "2022" }, { year: "2023" }, { year: "2024" }
    ]
    return (
        <div>
            <Autocomplete
                value={
                    defaultYearValue
                        ? defaultYearValue
                        : { year: "2024" }
                }
                disablePortal
                options={yearOptions?.length ? yearOptions : []}
                getOptionLabel={(option: any) =>
                    typeof option === "string" ? option : option.year
                }
                onChange={(_: any, newValue: any) => {
                    if (newValue?.year) {
                        setDefaultYearValue(newValue)
                        onChangeData(newValue.year)
                    }
                    else {
                        setDefaultYearValue(2024)
                        onChangeData(2024)
                    }
                }}
                sx={{
                    "& .MuiInputBase-root": {
                        padding: "2.5px !Important",
                        fontSize: "clamp(12px, 0.72vw, 14px) !important",
                        width: "190px",
                        height: "35px"
                    },
                    "& .MuiInputBase-input": {
                        paddingRight: "2rem !important",
                    },

                }}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        placeholder="Select Year"
                        size="small"
                    />
                )}
            />
        </div>
    )
}
export default GlobalYearFilter;