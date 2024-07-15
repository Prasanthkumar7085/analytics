import { Skeleton } from "@mui/material";
import Image from "next/image";
import styles from "./index.module.css";
import CountUp from "react-countup";
import { BillingOverViewStatsCardTypes } from "@/interfaces/billingOverViewTypes";
import { FC, useState } from "react";
import formatMoney from "@/lib/Pipes/moneyFormat";
import { usePathname } from "next/navigation";

const BillingStatsCards: FC<BillingOverViewStatsCardTypes> = ({
  loading,
  billingCardsDetails,
  revenueCardsDetails,
  searchParams,
}: any) => {
  const pathName = usePathname();
  return (
    <>
      <div className="eachDataCard" id="StatsData">
        <div className="cardHeader">
          <h3>
            <Image alt="" src="/tableDataIcon.svg" height={20} width={20} />
            Stats
          </h3>
        </div>
        {searchParams?.tab == "billed" ||
        pathName?.includes("/billing/dashboard") ? (
          <div className="cardBody">
            <div className={styles.cardscontainer}>
              <div
                className={styles.card}
                style={{
                  background: "linear-gradient(110.31deg, #4386c5, #004e92)",
                }}
              >
                <div className={styles.titlecontainer}>
                  <div className="statHeader">Billed</div>
                </div>

                <div className={styles.row}>
                  <div className={styles.billed}>
                    <div className={styles.header}>
                      <label className={styles.lable}>Total Cases</label>
                    </div>
                    <h2 className={styles.totalvalue}>
                      {loading ? (
                        <Skeleton width={100} height={50} />
                      ) : (
                        <CountUp
                          start={0}
                          decimal="."
                          end={billingCardsDetails?.[0]?.["total_cases"]}
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
                      <label className={styles.lable}>Cases Billed</label>
                    </div>
                    <h2 className={styles.totalvalue}>
                      {loading ? (
                        <Skeleton width={100} height={50} />
                      ) : (
                        <CountUp
                          start={0}
                          decimal="."
                          end={billingCardsDetails?.[0]?.["cases_billed"]}
                        />
                      )}
                    </h2>
                  </div>

                  <div className={styles.billed}>
                    <div className={styles.header}>
                      <label className={styles.lable}>Cases Unbilled</label>
                    </div>
                    <h2 className={styles.totalvalue}>
                      {loading ? (
                        <Skeleton width={100} height={50} />
                      ) : (
                        <CountUp
                          start={0}
                          decimal="."
                          end={billingCardsDetails?.[0]?.["cases_unbilled"]}
                        />
                      )}
                    </h2>
                  </div>
                </div>
                <div className={styles.billed}>
                  <div className={styles.header}>
                    <label className={styles.lable}>Total Billed Amount</label>
                  </div>
                  <h2 className={styles.totalvalue}>
                    {loading ? (
                      <Skeleton width={100} height={50} />
                    ) : (
                      <CountUp
                        start={0}
                        decimal="."
                        prefix="$"
                        end={billingCardsDetails?.[0]?.["total_billed_amount"]}
                      />
                    )}
                  </h2>
                </div>
              </div>

              {/* <div className={styles.card11}>
              <Image
                alt=""
                src="/sales-rep-stats.svg"
                height={660}
                width={660}
              />
            </div> */}
            </div>
          </div>
        ) : (
          ""
        )}
        {searchParams?.tab == "revenue" ||
        pathName?.includes("/billing/dashboard") ? (
          <div className="cardBody">
            <div className={styles.cardscontainer}>
              <div
                className={styles.card}
                style={{
                  background: "linear-gradient(110.31deg, #4386c5, #004e92)",
                }}
              >
                <div className={styles.titlecontainer}>
                  <div className="statHeader">Revenue</div>
                </div>

                <div className={styles.row}>
                  <div className={styles.billed}>
                    <div className={styles.header}>
                      <label className={styles.lable}>Targeted Revenue</label>
                    </div>
                    <h2 className={styles.totalvalue}>
                      {loading ? (
                        <Skeleton width={100} height={50} />
                      ) : (
                        <CountUp
                          start={0}
                          decimal="."
                          prefix="$"
                          end={revenueCardsDetails?.[0]?.["targeted_revenue"]}
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
                      <label className={styles.lable}>Total Revenue</label>
                    </div>
                    <h2 className={styles.totalvalue}>
                      {loading ? (
                        <Skeleton width={100} height={50} />
                      ) : (
                        <CountUp
                          start={0}
                          decimal="."
                          prefix="$"
                          end={revenueCardsDetails?.[0]?.["total_revenue"]}
                        />
                      )}
                    </h2>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          ""
        )}

        <div className={styles.card11}>
          <Image alt="" src="/sales-rep-stats.svg" height={660} width={660} />
        </div>
      </div>
    </>
  );
};
export default BillingStatsCards;
