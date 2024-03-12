"use client";
import SalesRepsTable from "@/components/DashboardPage/SalesRep/SalesRepsTable";
import styles from "./index.module.css";
import { useEffect } from "react";
import { toast } from "sonner";
import Image from "next/image";

const SalesRep = () => {
  return (
    <section id="salesRepresentatives">
      <div className={styles.salesrepresentative}>
        <div className={styles.header}>
          <div className={styles.headingcontainer}>
            <div className={styles.iconcontainer}>
              <Image
                className={styles.icon}
                alt=""
                src="/navbar/icon.svg"
                height={20}
                width={20}
              />
            </div>
            <div className={styles.headinglable}>
              <div className={styles.heading}>Sales Representative</div>
            </div>
          </div>
          <div className={styles.datepicker}>
            <Image
              className={styles.calendericon}
              alt=""
              src="/navbar/calendericon.svg"
              height={20}
              width={20}
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
    </section>
  );
};

export default SalesRep;
