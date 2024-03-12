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
        <div className="salesRepFilters">
          <Grid container spacing={2} className="subNav">
            <Grid item xs={5}>
              <div className="leftSide">
                <h4 className="tableHeader">Sales Representatives</h4>
              </div>
            </Grid>
            <Grid item xs={7}>
              <div className="rightSide">
                <ul className="filterLists">
                  <li className="eachFilterLists">
                    <FormControl
                      sx={{ m: 1, width: 300 }}
                      className="selectInput"
                    >
                      <InputLabel id="demo-simple-select-label">
                        Target Reached
                      </InputLabel>
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        label="Target Reached"
                        className="customSelect"
                      >
                        <MenuItem>Target One</MenuItem>
                        <MenuItem>Target One</MenuItem>
                        <MenuItem>Target One</MenuItem>
                        <MenuItem>Target One</MenuItem>
                      </Select>
                    </FormControl>
                  </li>
                  <li className="eachFilterLists">
                    <TextField
                      placeholder="Search"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <SearchIcon />
                          </InputAdornment>
                        ),
                      }}
                      className="searchInput"
                    />
                  </li>
                </ul>
              </div>
            </Grid>
          </Grid>
        </div>
        <SalesRepresentatives />
      </section>
    </Suspense>
  );
};

export default SalesRepresentativesPage;
