import { Autocomplete, Paper, TextField } from "@mui/material";

const AutoCompleteForSearch = ({
  placeholder,
  selectedValue,
  setSelectedValue,
  autocompleteOptions,
  label,
}: any) => {
  const handleOnChange = (_: any, newValue: any) => {
    setSelectedValue(newValue);
  };
  return (
    <div>
      <Autocomplete
        className="caseCreationAutoComplete"
        value={selectedValue ? selectedValue : null}
        disablePortal
        options={autocompleteOptions?.length ? autocompleteOptions : []}
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
        getOptionLabel={(option: any) =>
          typeof option === "string" ? option : option?.[label]
        }
        onChange={handleOnChange}
        sx={{
          zIndex: "99999 !important",
          "& .MuiFormControl-root": {
            width: "250px",
            background: "#fff",
            borderRadius: "5px",
          },
          "& .MuiInputBase-root": {
            padding: "2.5px !Important",
            fontSize: "clamp(12px, 0.72vw, 14px) !important",
            zIndex: "99999 !important",
            paddingBlock: "0",
            fontFamily: "'Poppins', Sans-serif",
          },
          "& .MuiInputBase-input": {
            paddingRight: "2rem !important",
          },
        }}
        renderInput={(params) => (
          <TextField {...params} placeholder={placeholder} size="small" />
        )}
      />
    </div>
  );
};
export default AutoCompleteForSearch;
