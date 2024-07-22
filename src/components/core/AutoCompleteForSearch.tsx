import { Autocomplete, Paper, TextField } from "@mui/material";

const AutoCompleteForSearch = ({
  placeholder,
  selectedValue,
  setSelectedValue,
  autocompleteOptions,
  label,
  onUpdateData,
}: any) => {
  const handleOnChange = (_: any, newValue: any) => {
    setSelectedValue(newValue);
    if (newValue) {
      let param = newValue?.["paramValue"];
      onUpdateData({ [param]: newValue?.value });
    } else {
      let param = newValue?.["paramValue"];
      onUpdateData({ [autocompleteOptions?.[0]?.["paramValue"]]: "" });
    }
  };
  return (
    <div>
      <Autocomplete
        className="defaultAutoComplete"
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
          "& .MuiFormControl-root": {
            width: "170px",
            background: "#fff",
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
