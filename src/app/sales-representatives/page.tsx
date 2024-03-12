import SalesRepresentatives from "@/components/SalesRepresentatives";
import { Suspense } from "react";
import Grid from "@mui/material/Grid";
const SalesRepresentativesPage = () => {
  return (
    <Suspense>
      <section id="salesRepresentativesPage">
        <div className="salesRepFilters">
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={3}>
              <h4>Sales Representatives</h4>
            </Grid>
            <Grid item xs={9}>
              <ul>
                <li></li>
              </ul>
            </Grid>
          </Grid>
        </div>
        <SalesRepresentatives />
      </section>
    </Suspense>
  );
};

export default SalesRepresentativesPage;
