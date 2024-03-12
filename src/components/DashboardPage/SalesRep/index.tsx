"use client";
import SalesRepsTable from "@/components/DashboardPage/SalesRep/SalesRepsTable";
import styles from "./index.module.css";
import { useEffect } from "react";
import { toast } from "sonner";
import Image from "next/image";
import GlobalDateRangeFilter from "@/components/core/GlobalDateRangeFilter";

const SalesRep = () => {
  return (
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
        <GlobalDateRangeFilter onChange={() => {}} />
      </div>
      <SalesRepsTable />
    </div>
  );
};

export default SalesRep;
