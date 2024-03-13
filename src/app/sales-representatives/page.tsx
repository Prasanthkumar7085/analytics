import SalesRepresentatives from "@/components/SalesRepresentatives";
import { Suspense } from "react";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";

const SalesRepresentativesPage = () => {
  return (
    <Suspense>
      <section id="salesRepresentativesPage">
        <SalesRepresentatives />
      </section>
    </Suspense>
  );
};

export default SalesRepresentativesPage;
