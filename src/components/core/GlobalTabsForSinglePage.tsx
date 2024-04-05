import { Tab, Tabs } from "@mui/material";
import { useState } from "react";

const GlobalTabsForSinglePage = ({ setTabValue, tabValue }: any) => {

    const handleChange = (event: React.SyntheticEvent, newValue: string) => {
        setTabValue(newValue);
    };
    return (
        <Tabs
            value={tabValue}
            onChange={handleChange}
            textColor="secondary"
            indicatorColor="secondary"
            aria-label="secondary tabs example"
        >
            <Tab value="Volume" label="Volume" />
            <Tab value="Revenue" label="Revenue" />
        </Tabs>
    )
}
export default GlobalTabsForSinglePage;