"use client"
import type { NextPage } from "next";
import styles from "./salesRepresentative.module.css"
import Stats from "@/components/DashboardPage/Stats";
import CaseTypes from "@/components/DashboardPage/CaseType";
const SalesRepView = () => {
    return (
        <div className={styles.salesrepviewpage}>
            <div className={styles.container}>

                <div className={styles.detailscontainer}>
                    <section className={styles.container7}>
                        <Stats />

                        <CaseTypes />
                    </section>

                    <div className={styles.casetypecontainer}>
                        <div className={styles.casetypedetails}>
                            <div className={styles.headercontainer1}>
                                <div className={styles.header2}>
                                    <div className={styles.headingcontainer}>
                                        <div className={styles.iconcontainer}>
                                            <img className={styles.icon} alt="" src="/icon.svg" />
                                        </div>
                                        <h3 className={styles.heading}>Case Type</h3>
                                    </div>
                                    <div className={styles.datepicker}>
                                        <img
                                            className={styles.calendericon}
                                            alt=""
                                            src="/calendericon.svg"
                                        />
                                        <div className={styles.daterange}>
                                            <p className={styles.startDate}>Start Date</p>
                                            <p className={styles.p}>-</p>
                                            <p className={styles.startDate}>End Date</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className={styles.insurancetrendscontainer}>
                        <div className={styles.casetypedetails}>
                            <header className={styles.headercontainer}>
                                <div className={styles.header1}>
                                    <div className={styles.headingcontainer}>
                                        <div className={styles.iconcontainer}>
                                            <img className={styles.icon} alt="" src="/icon.svg" />
                                        </div>
                                        <h3 className={styles.heading}>Insurance Payors</h3>
                                    </div>
                                </div>
                            </header>
                        </div>
                        <div className={styles.revenuedetails}>
                            <header className={styles.headercontainer3}>
                                <div className={styles.header1}>
                                    <div className={styles.headingcontainer}>
                                        <div className={styles.iconcontainer}>
                                            <img className={styles.icon} alt="" src="/icon.svg" />
                                        </div>
                                        <h3 className={styles.heading}>Trends</h3>
                                    </div>
                                </div>
                            </header>
                        </div>
                    </div>
                    <div className={styles.facilitiescontainer}>
                        <div className={styles.facilitiesdetails}>
                            <header className={styles.headercontainer}>
                                <div className={styles.header1}>
                                    <div className={styles.headingcontainer}>
                                        <div className={styles.iconcontainer}>
                                            <img className={styles.icon} alt="" src="/icon.svg" />
                                        </div>
                                        <h3 className={styles.heading}>Facilities</h3>
                                    </div>
                                </div>
                            </header>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SalesRepView;
