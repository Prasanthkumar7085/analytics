"use client";
import SalesRepsTable from "@/components/DashboardPage/SalesRep/SalesRepsTable";
import styles from "./index.module.css";
import { useEffect } from "react";
import { toast } from "sonner";

const SalesRep = () => {

  const getUsersData = async () => {
    try {
    } catch (err: any) {
      toast.error(err.message || "Something went wrong");
    }
  };
  useEffect(() => {
    getUsersData();
  }, []);
  return (
    <div className={styles.salesrepresentative}>
      <div className={styles.header}>
        <div className={styles.headingcontainer}>
          <div className={styles.iconcontainer}>
            <img className={styles.icon} alt="" src="/navbar/icon.svg" />
          </div>
          <div className={styles.headinglable}>
            <div className={styles.heading}>Sales Representative</div>
          </div>
        </div>
        <div className={styles.datepicker}>
          <img
            className={styles.calendericon}
            alt=""
            src="/navbar/calendericon.svg"
          />
          <div className={styles.daterange}>
            <div className={styles.startDate}>Start Date</div>
            <div className={styles.div}>-</div>
            <div className={styles.startDate}>End Date</div>
          </div>
        </div>
      </div>
      <SalesRepsTable />
    </div>
  );
};

export default SalesRep;
