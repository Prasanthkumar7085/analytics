import styles from "./index.module.css";

const Stats = () => {
  return (
    <div className={styles.stats}>
      <div className={styles.header}>
        <div className={styles.headingcontainer}>
          <div className={styles.iconcontainer}>
            <img className={styles.icon} alt="" src="/navbar/icon.svg" />
          </div>
          <div className={styles.heading}>Stats</div>
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
      <div className={styles.cardscontainer}>
        <div className={styles.revenuecard}>
          <div className={styles.titlecontainer}>
            <h3 className={styles.title}>$ Revenue</h3>
            <button className={styles.detailsButton}>
              <p className={styles.details}>Details</p>
              <img
                className={styles.detailsButtonChild}
                alt=""
                src="/navbar/line-19.svg"
              />
            </button>
          </div>
          <div className={styles.row}>
            <div className={styles.billed}>
              <div className={styles.header}>
                <label className={styles.lable}>Billed</label>
                <div className={styles.growthindicator}>
                  <img
                    className={styles.indicatorIcon}
                    alt=""
                    src="/navbar/indicator.svg"
                  />
                  <p className={styles.value}>+13.4 %</p>
                </div>
              </div>
              <h2 className={styles.totalvalue}>$40,000</h2>
            </div>
            <img
              className={styles.dividerIcon}
              alt=""
              src="/navbar/divider.svg"
            />
            <div className={styles.billed}>
              <div className={styles.header}>
                <label className={styles.lable}>Collected</label>
                <div className={styles.growthindicator}>
                  <img
                    className={styles.indicatorIcon}
                    alt=""
                    src="/navbar/indicator.svg"
                  />
                  <p className={styles.value}>+13.4 %</p>
                </div>
              </div>
              <h2 className={styles.totalvalue}>$20,000</h2>
            </div>
            <img
              className={styles.dividerIcon}
              alt=""
              src="/navbar/line-21.svg"
            />
            <div className={styles.billed}>
              <div className={styles.header}>
                <p className={styles.value}>Pending</p>
                <div className={styles.growthindicator}>
                  <img
                    className={styles.indicatorIcon}
                    alt=""
                    src="/navbar/indicator.svg"
                  />
                  <p className={styles.value}>+13.4 %</p>
                </div>
              </div>
              <h2 className={styles.totalvalue}>$20,000</h2>
            </div>
          </div>
        </div>

        <div className={styles.card}>
          <div className={styles.titlecontainer}>
            <div className={styles.title1}>Volume</div>
            <button className={styles.detailsButton}>
              <p className={styles.details}>Details</p>
              <img
                className={styles.detailsButtonChild}
                alt=""
                src="/navbar/line-19.svg"
              />
            </button>
          </div>
          <div className={styles.row}>
            <div className={styles.billed}>
              <div className={styles.header}>
                <label className={styles.lable}>Total</label>
                <div className={styles.growthindicator}>
                  <img
                    className={styles.indicatorIcon}
                    alt=""
                    src="/navbar/indicator.svg"
                  />
                  <p className={styles.value}>+13.4 %</p>
                </div>
              </div>
              <h2 className={styles.totalvalue}>295</h2>
            </div>
            <img
              className={styles.dividerIcon}
              alt=""
              src="/navbar/divider.svg"
            />
            <div className={styles.billed}>
              <div className={styles.header}>
                <label className={styles.lable}>Collected</label>
                <div className={styles.growthindicator}>
                  <img
                    className={styles.indicatorIcon}
                    alt=""
                    src="/navbar/indicator.svg"
                  />
                  <p className={styles.value}>+13.4 %</p>
                </div>
              </div>
              <h2 className={styles.totalvalue}>200</h2>
            </div>
            <img
              className={styles.dividerIcon}
              alt=""
              src="/navbar/line-21.svg"
            />
            <div className={styles.billed}>
              <div className={styles.header}>
                <p className={styles.value}>Pending</p>
                <div className={styles.growthindicator}>
                  <img
                    className={styles.indicatorIcon}
                    alt=""
                    src="/navbar/indicator.svg"
                  />
                  <p className={styles.value}>+13.4 %</p>
                </div>
              </div>
              <h2 className={styles.totalvalue}>95</h2>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Stats;
