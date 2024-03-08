import RevenuVolumeCaseTypesDetails from "@/components/CaseTypes/RevenueVolumeCaseTypeDetails";
import styles from "./salesCaseTypes.module.css"
import { Tab, Tabs } from "@mui/material";
import { useState } from "react";
import Image from "next/image";
const SingleSalesRepCaseTypeDetails = () => {

    const [value, setValue] = useState('Volume');

    const handleChange = (event: React.SyntheticEvent, newValue: string) => {
        setValue(newValue);
    };

    return (
        <div className={styles.casetypedetails} >
            <div className={styles.headercontainer1}>
                <div className={styles.header2}>
                    <div className={styles.headingcontainer}>
                        <div className={styles.iconcontainer}>
                            <Image className={styles.icon} alt="" src="/icon.svg" height={20} width={20} />
                        </div>
                        <h3 className={styles.heading}>Case Type</h3>
                    </div>
                    <div className={styles.datepicker}>
                        <Image
                            className={styles.calendericon}
                            alt=""
                            src="/calendericon.svg"
                            height={20} width={20}
                        />
                        <div className={styles.daterange}>
                            <p className={styles.startDate}>Start Date</p>
                            <p className={styles.p}>-</p>
                            <p className={styles.startDate}>End Date</p>
                        </div>
                    </div>
                </div>

            </div>
            <div style={{ display: "flex", justifyContent: "center" }}>
                <Tabs
                    value={value}
                    onChange={handleChange}
                    textColor="secondary"
                    indicatorColor="secondary"
                    aria-label="secondary tabs example"
                >
                    <Tab value="Revenue" label="Revenue" />
                    <Tab value="Volume" label="Volume" />
                </Tabs>
            </div>
            <div >
                <RevenuVolumeCaseTypesDetails
                    tabValue={value}
                />
            </div>
        </div>
    )
}
export default SingleSalesRepCaseTypeDetails;