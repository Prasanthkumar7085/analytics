import { graphColors } from "@/lib/constants";
import {
  rearrangeDataWithCasetypes,
  rearrangeDataWithCasetypesInFilters,
} from "@/lib/helpers/apiHelpers";
import { getAllCaseTypesListAPI } from "@/services/caseTypesAPIs";
import { Autocomplete, Box, Paper, TextField } from "@mui/material";
import { useEffect, useState } from "react";

const GlobalCaseTypesAutoComplete = ({
  selectedCaseValue,
  setSelectedCaseValue,
}: any) => {
  const [loading, setLoading] = useState(true);
  const [caseTypeOptions, setCaseTypeOptions] = useState<any>([]);

  //get all case types list details for autocomplete
  const getAllCaseTypes = async () => {
    setLoading(true);
    try {
      let response = await getAllCaseTypesListAPI();
      if (response.success) {
        let rearrangedData = rearrangeDataWithCasetypesInFilters(
          response?.data
        );
        setCaseTypeOptions(rearrangedData);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllCaseTypes();
  }, []);

  return (
    <div>
      <Autocomplete
        className="caseCreationAutoComplete"
        loading={loading}
        value={selectedCaseValue ? selectedCaseValue : null}
        disablePortal
        options={caseTypeOptions?.length ? caseTypeOptions : []}
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
          typeof option === "string" ? option : option.displayName
        }
        onChange={(_: any, newValue: any) => {
          setSelectedCaseValue(newValue);
        }}
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
          <TextField {...params} placeholder="Select Case Type" size="small" />
        )}
      />
    </div>
  );
};
export default GlobalCaseTypesAutoComplete;
