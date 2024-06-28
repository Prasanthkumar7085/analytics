import { Checkbox, FormControlLabel } from "@mui/material";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

const CheckBoxForExcludeGenSales = ({ queryPreparations }: any) => {
  const params = useSearchParams();
  const [checked, setChecked] = useState(true);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
    queryPreparations({
      general_sales_reps_exclude_count: event.target.checked,
    });
  };

  return (
    <div>
      <FormControlLabel
        label="Exclude General sales"
        control={
          <Checkbox
            checked={
              params?.get("general_sales_reps_exclude_count") ? true : false
            }
            onChange={handleChange}
            inputProps={{ "aria-label": "controlled" }}
          />
        }
      />
    </div>
  );
};
export default CheckBoxForExcludeGenSales;
