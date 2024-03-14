import Image from "next/image";
import RevenueDataGraph from "./RevenueDataGraph";
import styles from "./index.module.css";
import GlobalDateRangeFilter from "@/components/core/GlobalDateRangeFilter";

const RevenueBlock = () => {
  return (
    <div className={styles.casetype}>
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
          <div className={styles.heading}>Revenue</div>
        </div>
        <GlobalDateRangeFilter onChangeData={() => {}} />
      </div>
      <div style={{ width: "98%" }}>
        <RevenueDataGraph />
      </div>
    </div>
  );
};

export default RevenueBlock;
