import GlobalDateRangeFilter from "@/components/core/GlobalDateRangeFilter";
import formatMoney from "@/lib/Pipes/moneyFormat";
import { Skeleton } from "@mui/material";
import Image from "next/image";
import styles from "./index.module.css";
import { usePathname } from "next/navigation";
import CountUp from 'react-countup';

const Stats = ({
  revenueStatsDetails,
  volumeStatsDetails,
  loading,
  onChange,
  getStatsCounts
}: any) => {

  const pathName = usePathname();

  const onChangeData = (fromDate: any, toDate: any) => {
    getStatsCounts(fromDate, toDate);
  };

  return (
    <>
      <div className="eachDataCard" id="StatsData">
        <div className="cardHeader">
          <h3>
            <Image alt="" src="/tableDataIcon.svg" height={20} width={20} />
            Stats
          </h3>
          {pathName?.includes("dashboard") ?
            <GlobalDateRangeFilter onChangeData={onChangeData} DatePickerplacement={"bottomStart"} /> : ""}
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
                      <CountUp start={0}
                        decimal="."
                        decimals={2}
                        prefix="$"
                        end={revenueStatsDetails?.[0]?.generated_amount}
                      />

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

                      <CountUp start={0}
                        decimal="."
                        decimals={2}
                        prefix="$"
                        end={revenueStatsDetails?.[0]?.paid_amount
                        }
                      />
                      // formatMoney(
                      //   revenueStatsDetails?.[0]?.paid_amount
                      //     ? revenueStatsDetails?.[0]?.paid_amount
                      //     : 0
                      // )
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
                      <CountUp start={0}
                        decimal="."
                        decimals={2}
                        prefix="$"
                        end={revenueStatsDetails?.[0]?.pending_amount
                        }
                      />
                      // formatMoney(
                      //   revenueStatsDetails?.[0]?.pending_amount
                      //     ? revenueStatsDetails?.[0]?.pending_amount
                      //     : 0
                      // )
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
                      <CountUp start={0}
                        decimal="."
                        end={volumeStatsDetails?.[0]?.total_cases
                        } />
                      // formatMoney(
                      //   volumeStatsDetails?.[0]?.total_cases
                      //     ? volumeStatsDetails?.[0]?.total_cases
                      //     : 0
                      // ).replace("$", "")
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
                    <label className={styles.lable}>Finalised</label>
                  </div>
                  <h2 className={styles.totalvalue}>
                    {loading ? (
                      <Skeleton width={120} height={50} />
                    ) : (
                      <CountUp start={0}
                        decimal="."
                        end={volumeStatsDetails?.[0]?.completed_cases
                        } />
                      // formatMoney(
                      //   volumeStatsDetails?.[0]?.completed_cases
                      //     ? volumeStatsDetails?.[0]?.completed_cases
                      //     : 0
                      // ).replace("$", "")
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
                      <CountUp start={0}
                        decimal="."
                        end={volumeStatsDetails?.[0]?.pending_cases
                        } />
                      // formatMoney(
                      //   volumeStatsDetails?.[0]?.pending_cases
                      //     ? volumeStatsDetails?.[0]?.pending_cases
                      //     : 0
                      // ).replace("$", "")
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
