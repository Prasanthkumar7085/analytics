import { adminAccess } from "@/lib/helpers/hasAccessOrNot";
import { Checkbox, FormControlLabel } from "@mui/material";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { prepareURLEncodedParams } from "../utils/prepareUrlEncodedParams";
import { setExcludeSalesRepValueInStore } from "@/Redux/Modules/marketers";

const CheckBoxForExcludeGenSales = ({ queryPreparations }: any) => {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch();
  const excludeSalesRepValueInStore = useSelector(
    (state: any) => state.users.excludeSalesRepValue
  );
  const userType = useSelector(
    (state: any) => state.auth.user?.user_details?.user_type
  );
  const [searchParams, setSearchParams] = useState(
    Object.fromEntries(new URLSearchParams(Array.from(params.entries())))
  );
  const [checked, setChecked] = useState(true);

  const handleChange = (event: any) => {
    setChecked(event.target.checked);
    let queryParams: any = {
      ...searchParams,
      general_sales_reps_exclude_count: event.target.checked,
    };
    dispatch(setExcludeSalesRepValueInStore(event.target.checked));
    let queryString = prepareURLEncodedParams("", queryParams);
    router.push(`${pathname}${queryString}`);
  };

  useEffect(() => {
    handleChange({ target: { excludeSalesRepValueInStore } });
  }, [pathname]);

  useEffect(() => {
    setSearchParams(
      Object.fromEntries(new URLSearchParams(Array.from(params.entries())))
    );
  }, [params]);

  return (
    <div>
      {adminAccess() ? (
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
