import { Autocomplete, Box, Paper, TextField } from "@mui/material";

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
        renderOption={(props, option) => {
          const { key, ...optionProps } = props;
          return (
            <Box
              key={key}
              component="li"
              sx={{ "& > img": { mr: 2, flexShrink: 0 } }}
              {...optionProps}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  gap: "0.6rem",
                }}
              >
                <div
                  style={{
                    width: "10px",
                    height: "10px",
                    background: option?.color,
                    borderRadius: "50%",
                  }}
                ></div>
                {option.label}
              </div>
            </Box>
          );
        }}
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
