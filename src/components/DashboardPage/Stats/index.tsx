import GlobalDateRangeFilter from "@/components/core/GlobalDateRangeFilter";
import formatMoney from "@/lib/Pipes/moneyFormat";
import { Skeleton } from "@mui/material";
import Image from "next/image";
import styles from "./index.module.css";
import { usePathname } from "next/navigation";
import CountUp from "react-countup";
import dayjs from "dayjs";
import "dayjs/locale/en"; // Ensure English locale is loaded for formatting

const Stats = ({
  revenueStatsDetails,
  volumeStatsDetails,
  loading,
  onChange,
  getStatsCounts,
  statsSeletedDate,
}: any) => {
  const pathName = usePathname();
  const formatDate = (fromDatevalue: any, toDatevalue: any) => {
    const formattedFromDate = dayjs(fromDatevalue).format("MMM DD, YY");
    const formattedToDate = dayjs(toDatevalue).format("MMM DD, YY");

    const formattedDateRange = `${formattedFromDate} - ${formattedToDate}`;
    return formattedDateRange;
  };
  const onChangeData = (fromDate: any, toDate: any) => {
    getStatsCounts(fromDate, toDate);
  };

  const getBackgroundColor = (totalCases: any, targetVolume: any) => {
    if (targetVolume === 0) {
      if (totalCases === 0) {
        return "linear-gradient(110.31deg, #43c55d, #009264)";
      } else if (totalCases >= targetVolume) {
        return "linear-gradient(110.31deg, #43c55d, #009264)";
      } else {
        return "linear-gradient(110.31deg, #c54357, #920020)";
      }
    }

    const percentage = (totalCases / targetVolume) * 100;
    if (percentage >= 100) {
      return "linear-gradient(110.31deg, #43c55d, #009264)";
    } else if (percentage >= 50) {
      return "linear-gradient(110.31deg, #f0ad4e, #ff6700)";
    } else {
      return "linear-gradient(110.31deg, #c54357, #920020)";
    }
  };

  const averagePerDayTargets = () => {
    const totalDaysInMonth = dayjs().daysInMonth();
    const startOfMonth = dayjs().startOf('month');

    const currentDate = dayjs();
    const daysPassed = currentDate.diff(startOfMonth, 'day') + 1;
    const targetVolume = volumeStatsDetails?.[0]?.target_volume;
    if (targetVolume) {
      const averagePerDay = targetVolume / totalDaysInMonth;
      return averagePerDay * daysPassed;
    }
    else {
      return 0;
    }
  }

  return (
    <>
      <div className="eachDataCard" id="StatsData">
        <div className="cardHeader">
          <h3>
            <Image alt="" src="/tableDataIcon.svg" height={20} width={20} />
            Stats
          </h3>
          {pathName?.includes("dashboard") ? (
            <GlobalDateRangeFilter
              onChangeData={onChangeData}
              DatePickerplacement={"bottomStart"}
            />
          ) : (
            ""
          )}
        </div>
        <div className="cardBody">
          <div className={styles.cardscontainer}>
            {pathName?.includes("facilities") ? (
              <div
                className={styles.card}
                style={{
                  background: "linear-gradient(110.31deg, #4386c5, #004e92)",
                }}
              >
                <div className={styles.titlecontainer}>
                  <div className="statHeader">Volume</div>
                </div>
                <div className={styles.row}>
                  <div className={styles.billed}>
                    <div className={styles.header}>
                      <label className={styles.lable}>TOTAL</label>
                    </div>
                    <h2 className={styles.totalvalue}>
                      {loading ? (
                        <Skeleton width={100} height={50} />
                      ) : (
                        <CountUp
                          start={0}
                          decimal="."
                          end={volumeStatsDetails?.[0]?.total_cases}
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
                      <label className={styles.lable}>FINALIZED</label>
                    </div>
                    <h2 className={styles.totalvalue}>
                      {loading ? (
                        <Skeleton width={100} height={50} />
                      ) : (
                        <CountUp
                          start={0}
                          decimal="."
                          end={volumeStatsDetails?.[0]?.completed_cases}
                        />
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
                      <p className={styles.value}>PENDING</p>
                    </div>
                    <h2 className={styles.totalvalue}>
                      {loading ? (
                        <Skeleton width={100} height={50} />
                      ) : (
                        <CountUp
                          start={0}
                          decimal="."
                          end={volumeStatsDetails?.[0]?.pending_cases}
                        />
                      )}
                    </h2>
                  </div>
                </div>
              </div>
            ) : (
              <div
                className={styles.card}
                style={{
                  background: volumeStatsDetails?.length
                    ? getBackgroundColor(
                      volumeStatsDetails?.[0]?.total_cases,
                      averagePerDayTargets()
                    )
                    : "linear-gradient(110.31deg, #4386c5, #004e92)",
                }}
              >
                <div className={styles.titlecontainer}>
                  <div className="statHeader">Volume</div>
                  {statsSeletedDate?.[0] ? (
                    <p className="statHeader" style={{ fontSize: "12px" }}>
                      Date:
                      {formatDate(statsSeletedDate?.[0], statsSeletedDate?.[1])}
                    </p>
                  ) : (
                    ""
                  )}
                </div>


                <div className={styles.row}>
                  <div className={styles.billed}>
                    <div className={styles.header}>
                      <label className={styles.lable}>TOTAL</label>
                    </div>
                    <h2 className={styles.totalvalue}>
                      {loading ? (
                        <Skeleton width={100} height={50} />
                      ) : (
                        <CountUp
                          start={0}
                          decimal="."
                          end={volumeStatsDetails?.[0]?.total_cases}
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
                      <label className={styles.lable}>TARGET</label>
                    </div>
                    <h2 className={styles.totalvalue}>
                      {loading ? (
                        <Skeleton width={100} height={50} />
                      ) : (
                        <CountUp
                          start={0}
                          decimal="."
                          end={averagePerDayTargets()}
                        />
                      )}
                    </h2>
                  </div>


                  <div className={styles.billed}>
                    <div className={styles.header}>
                      <label className={styles.lable}>MONTH TARGET</label>
                    </div>
                    <h2 className={styles.totalvalue}>
                      {loading ? (
                        <Skeleton width={100} height={50} />
                      ) : (
                        <CountUp
                          start={0}
                          decimal="."
                          end={volumeStatsDetails?.[0]?.target_volume}
                        />
                      )}
                    </h2>
                  </div>

                </div>


              </div>
            )}

            <div className={styles.card11}>
              <Image
                alt=""
                src="/sales-rep-stats.svg"
                height={660}
                width={660}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Stats;
