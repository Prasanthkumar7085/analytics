import Image from "next/image";
import RevenueDataGraph from "./RevenueDataGraph";
import styles from "./index.module.css";

const RevenueBlock = () => {
  return (
    <div className={styles.casetype}>
      <div className={styles.header}>
        <div className={styles.headingcontainer}>
          <div className={styles.iconcontainer}>
          <Image className={styles.icon} alt="" src="/navbar/icon.svg" height={20} width={20} />
          </div>
          <div className={styles.heading}>Revenue</div>
        </div>
        <div className={styles.datepicker}>
          <Image
            className={styles.calendericon}
            alt=""
            src="/navbar/calendericon.svg"
            height={20} width={20}
          />
          <div className={styles.daterange}>
            <div className={styles.startDate}>Start Date</div>
            <div className={styles.div}>-</div>
            <div className={styles.startDate}>End Date</div>
          </div>
        </div>
      </div>
      <div style={{ width: "98%" }}>
        <RevenueDataGraph />
      </div>
    </div>
  );
};

export default RevenueBlock;
