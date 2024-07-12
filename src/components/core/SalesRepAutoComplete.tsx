import { getAllSalesRepsAPI } from "@/services/salesRepsAPIs";
import { Autocomplete, Paper, TextField } from "@mui/material";
import { useEffect, useState } from "react";

const SalesRepsAutoComplete = ({
  selectedSalesRepValue,
  setSelectedSalesRepValue,
  queryParams,
  queryPreparations,
}: any) => {
  const [loading, setLoading] = useState(false);
  const [salesRepOptions, setSalesRepOptions] = useState<any>([]);

  const salesRepOnChange = (_: any, newValue: any) => {
    let temp;
    if (newValue?.id) {
      temp = {
        ...queryParams,
        case_id: queryParams?.case_type_id,
        fromDate: queryParams?.from_date,
        toDate: queryParams?.to_date,
        sales_rep: newValue?.id,
      };
    } else {
      temp = {
        ...queryParams,
        case_id: queryParams?.case_type_id,
        fromDate: queryParams?.from_date,
        toDate: queryParams?.to_date,
        sales_rep: "",
      };
    }
    setSelectedSalesRepValue(newValue);
    queryPreparations(temp);
  };
  //get all sales reps list details for autocomplete
  const getAllSalesReps = async () => {
    setLoading(true);
    try {
      let response = await getAllSalesRepsAPI();
      if (response.success) {
        setSalesRepOptions(response?.data);
        if (queryParams?.sales_rep) {
          let temp = response?.data?.find(
            (item: any) => item?.id == queryParams?.sales_rep
          );
          setSelectedSalesRepValue(temp);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    getAllSalesReps();
  }, []);

  return (
    <div>
      <Autocomplete
        className="caseCreationAutoComplete"
        loading={loading}
        value={selectedSalesRepValue ? selectedSalesRepValue : null}
        disablePortal
        options={salesRepOptions?.length ? salesRepOptions : []}
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
          typeof option === "string" ? option : option.name
        }
        onChange={salesRepOnChange}
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
          <TextField {...params} placeholder="Select Marketer" size="small" />
        )}
      />
    </div>
  );
};
export default SalesRepsAutoComplete;
