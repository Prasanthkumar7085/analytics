import GlobalDateRangeFilter from "@/components/core/GlobalDateRangeFilter";
import formatMoney from "@/lib/Pipes/moneyFormat";
import { Skeleton } from "@mui/material";
import Image from "next/image";
import styles from "./index.module.css";

const Stats = ({
  revenueStatsDetails,
  volumeStatsDetails,
  loading,
  onChange,
}: any) => {
  return (
    <>
      <div className="eachDataCard" id="StatsData">
        <div className="cardHeader">
          <h3>
            <Image alt="" src="/tableDataIcon.svg" height={20} width={20} />
            Stats
          </h3>
          <GlobalDateRangeFilter
            onChange={onChange}
            classNamee="global-date-range-filter"
          />
        </div>
        <div className="cardBody">
          <div className={styles.cardscontainer}>
            <div className={styles.revenuecard}>
              <div className={styles.titlecontainer}>
                <h3 className={styles.title}>$ Revenue</h3>
              </div>
              <div className={styles.row}>
                <div className={styles.billed}>
                  <div className={styles.header}>
                    <label className={styles.lable}>Billed</label>
                  </div>
                  <h2 className={styles.totalvalue}>
                    {loading ? (
                      <Skeleton width={120} height={50} />
                    ) : (
                      formatMoney(
                        revenueStatsDetails?.generated
                          ? revenueStatsDetails?.generated
                          : 0
                      )
                    )}
                  </h2>
                </div>
                <Image
                  className={styles.dividerIcon}
                  alt=""
                  src="/navbar/divider.svg"
                  height={20}
                  width={20}
                />
                <div className={styles.billed}>
                  <div className={styles.header}>
                    <label className={styles.lable}>Collected</label>
                  </div>
                  <h2 className={styles.totalvalue}>
                    {loading ? (
                      <Skeleton width={120} height={50} />
                    ) : (
                      formatMoney(
                        revenueStatsDetails?.collected
                          ? revenueStatsDetails?.collected
                          : 0
                      )
                    )}
                  </h2>
                </div>
                <Image
                  className={styles.dividerIcon}
                  alt=""
                  src="/navbar/line-21.svg"
                  height={20}
                  width={20}
                />
                <div className={styles.billed}>
                  <div className={styles.header}>
                    <p className={styles.value}>Pending</p>
                  </div>
                  <h2 className={styles.totalvalue}>
                    {loading ? (
                      <Skeleton width={120} height={50} />
                    ) : (
                      formatMoney(
                        revenueStatsDetails?.pending
                          ? revenueStatsDetails?.pending
                          : 0
                      )
                    )}
                  </h2>
                </div>
              </div>
            </div>

            <div className={styles.card}>
              <div className={styles.titlecontainer}>
                <div className={styles.title1}>Volume</div>
              </div>
              <div className={styles.row}>
                <div className={styles.billed}>
                  <div className={styles.header}>
                    <label className={styles.lable}>Total</label>
                  </div>
                  <h2 className={styles.totalvalue}>
                    {loading ? (
                      <Skeleton width={120} height={50} />
                    ) : (
                      formatMoney(
                        volumeStatsDetails?.total
                          ? volumeStatsDetails?.total
                          : 0
                      ).replace("$", "")
                    )}
                  </h2>
                </div>
                <Image
                  className={styles.dividerIcon}
                  alt=""
                  src="/navbar/divider.svg"
                  height={20}
                  width={20}
                />
                <div className={styles.billed}>
                  <div className={styles.header}>
                    <label className={styles.lable}>Collected</label>
                  </div>
                  <h2 className={styles.totalvalue}>
                    {loading ? (
                      <Skeleton width={120} height={50} />
                    ) : (
                      formatMoney(
                        volumeStatsDetails?.completed
                          ? volumeStatsDetails?.completed
                          : 0
                      ).replace("$", "")
                    )}
                  </h2>
                </div>
                <Image
                  className={styles.dividerIcon}
                  alt=""
                  src="/navbar/line-21.svg"
                  height={20}
                  width={20}
                />
                <div className={styles.billed}>
                  <div className={styles.header}>
                    <p className={styles.value}>Pending</p>
                  </div>
                  <h2 className={styles.totalvalue}>
                    {loading ? (
                      <Skeleton width={120} height={50} />
                    ) : (
                      formatMoney(
                        volumeStatsDetails?.pending
                          ? volumeStatsDetails.pending
                          : 0
                      ).replace("$", "")
                    )}
                  </h2>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Stats;
