import styles from "./index.module.css";

const Revenue = () => {
  return (
    <div className={styles.stats1}>
      <div className={styles.header}>
        <div className={styles.headingcontainer}>
          <div className={styles.iconcontainer}>
            <img className={styles.icon} alt="" src="/navbar/icon.svg" />
          </div>
          <div className={styles.heading}>Case Type</div>
        </div>
        <div className={styles.datepicker}>
          <img
            className={styles.calendericon}
            alt=""
            src="//navbarcalendericon.svg"
          />
          <div className={styles.daterange}>
            <div className={styles.startDate}>Start Date</div>
            <div className={styles.div}>-</div>
            <div className={styles.startDate}>End Date</div>
          </div>
        </div>
      </div>
      <div className={styles.averagedetails}>
        <label className={styles.lable5}>Avg per month</label>
        <div className={styles.valuecontainer}>
          <h3 className={styles.value6}>$38.99K</h3>
          <img
            className={styles.upanddownIcon}
            alt=""
            src="/navbar/upanddown.svg"
          />
        </div>
      </div>
    </div>
  );
};

export default Revenue;
