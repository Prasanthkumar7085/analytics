import { rearrangeDataWithCasetypesInFilters } from "@/lib/helpers/apiHelpers";
import { getAllCaseTypesListAPI } from "@/services/caseTypesAPIs";
import { Autocomplete, Paper, TextField } from "@mui/material";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { prepareURLEncodedParams } from "../utils/prepareUrlEncodedParams";

const SingleCaseTypesAutoCompleteFilter = ({
  selectedCaseValue,
  setSelectedCaseValue,
  queryParams,
  queryPreparations,
  caseTypeOptions,
}: {
  selectedCaseValue: any;
  setSelectedCaseValue: any;
  queryParams?: any;
  queryPreparations: any;
  caseTypeOptions: any;
}) => {
  const [loading, setLoading] = useState(true);

  const onChangeEvent = (id: any) => {
    let temp = {
      ...queryParams,
      case_id: id,
      fromDate: queryParams?.from_date,
      toDate: queryParams?.to_date,
      sales_rep: queryParams?.sales_rep,
    };
    queryPreparations(temp);
  };

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
          onChangeEvent(newValue?.id);
        }}
        sx={{
          zIndex: "99999 !important",
          "& .MuiFormControl-root": {
            width: "250px",
            background: "#fff",
            borderRadius: "5px",
          },
          "& .MuiInputBase-root": {
            padding: "5.0px !Important",
            fontSize: "clamp(12px, 0.72vw, 14px) !important",
            zIndex: "99999 !important",
            paddingBlock: "0",
            fontFamily: "'Poppins', Sans-serif",
          },
          "& .MuiInputBase-input": {
            paddingRight: "2rem !important",
          },
          "& .MuiSvgIcon-root": {
            display: "none !important",
          },
        }}
        renderInput={(params) => (
          <TextField {...params} placeholder="Select Case Type" size="small" />
        )}
      />
    </div>
  );
};
export default SingleCaseTypesAutoCompleteFilter;
