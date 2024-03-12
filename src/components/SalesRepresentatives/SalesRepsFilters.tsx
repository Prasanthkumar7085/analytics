import { MenuItem, Select } from "@mui/material";

const SalesRepsFilters = () => {
  return (
    <div>
      <Select>
        <MenuItem value={"all"}>All</MenuItem>
        <MenuItem value={"yes"}>Yes</MenuItem>
        <MenuItem value={"no"}>No</MenuItem>
      </Select>
    </div>
  );
};

export default SalesRepsFilters;
