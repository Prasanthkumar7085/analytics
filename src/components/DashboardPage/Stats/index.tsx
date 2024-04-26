import GlobalDateRangeFilter from "@/components/core/GlobalDateRangeFilter";
import formatMoney from "@/lib/Pipes/moneyFormat";
import { Skeleton } from "@mui/material";
import Image from "next/image";
import styles from "./index.module.css";
import { usePathname } from "next/navigation";
import CountUp from "react-countup";
import { useState } from "react";

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
    const fromDate = new Date(fromDatevalue);
    const toDate = new Date(toDatevalue);

    const options: any = { month: "short", day: "2-digit", year: "2-digit" };

    const formattedFromDate = fromDate.toLocaleDateString("en-US", options);
    const formattedToDate = toDate.toLocaleDateString("en-US", options);

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
                        volumeStatsDetails?.[0]?.target_volume
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
                      <label className={styles.lable}>TARGETS</label>
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
