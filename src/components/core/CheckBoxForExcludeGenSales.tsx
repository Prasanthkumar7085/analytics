import { Checkbox, FormControlLabel } from "@mui/material";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { useSelector } from "react-redux";

const CheckBoxForExcludeGenSales = ({ queryPreparations }: any) => {
  const params = useSearchParams();
  const userType = useSelector(
    (state: any) => state.auth.user?.user_details?.user_type
  );
  const [checked, setChecked] = useState(true);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
    queryPreparations({
      general_sales_reps_exclude_count: event.target.checked,
    });
  };

  return (
    <div>
      {userType == "LAB_ADMIN" || userType == "LAB_SUPER_ADMIN" ? (
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
      ) : (
        ""
      )}
    </div>
  );
};
export default CheckBoxForExcludeGenSales;
