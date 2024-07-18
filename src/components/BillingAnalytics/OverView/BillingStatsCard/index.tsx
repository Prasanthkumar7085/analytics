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
      <div className="eachDataCard" id="BillingStatsData">
        <div className="cardHeader">
          <h3>
            <Image alt="" src="/tableDataIcon.svg" height={20} width={20} />
            Stats
          </h3>
        </div>
        {searchParams?.tab == "billed" ||
        pathName?.includes("/billing/dashboard") ? (
          <div className="cardBody no-pb">
            <div
              className="rounded-md p-3"
              style={{
                background: "linear-gradient(110.31deg, #EE0979, #CF8BF3)",
              }}
            >
              <h4 className="text-[17px] text-white font-normal mb-2">
                Billing
              </h4>
              <div className="flex justify-between">
                <div className="eachValue">
                  <h5 className="text-white text-[15px] mb-0 font-normal">
                    Total Cases
                  </h5>
                  <h2 className="text-white text-[22px] font-normal leading-7">
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
                <div className="eachValue">
                  <h5 className="text-white text-[15px] mb-0 font-normal">
                    Cases Billed
                  </h5>
                  <h2 className="text-white text-[22px] font-normal leading-7">
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
                <div className="eachValue">
                  <h5 className="text-white text-[15px] mb-0 font-normal">
                    Cases Unbilled
                  </h5>
                  <h2 className="text-white text-[22px] font-normal leading-7">
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
              <hr className="mt-2 mb-2" />
              <div>
                <div className="eachValue text-center">
                  <h5 className="text-white text-[15px] mb-0 font-normal">
                    Total Billed Amount
                  </h5>
                  <h2 className="text-white text-[22px] font-normal leading-7">
                    {loading ? (
                      <Skeleton width={100} height={50} />
                    ) : (
                      <CountUp
                        start={0}
                        decimal="."
                        prefix="$"
                        decimals={2}
                        end={billingCardsDetails?.[0]?.["total_billed_amount"]}
                      />
                    )}
                  </h2>
                </div>
              </div>
            </div>
          </div>
        ) : (
          ""
        )}
        {searchParams?.tab == "revenue" ||
        pathName?.includes("/billing/dashboard") ? (
          <div className="cardBody">
            <div
              className="revenue-count rounded-md p-3"
              style={{
                background: "linear-gradient(110.31deg, #4386c5, #004e92)",
              }}
            >
              <h4 className="text-[17px] text-white font-normal mb-2">
                Revenue
              </h4>
              <div className="eachValue text-center">
                <h5 className="text-white text-[15px] mb-0 font-normal">
                  Revenue Target
                </h5>
                <h2 className="text-white text-[22px] font-normal leading-7">
                  {loading ? (
                    <Skeleton width={100} height={50} />
                  ) : (
                    <CountUp
                      start={0}
                      decimal="."
                      prefix="$"
                      decimals={2}
                      end={revenueCardsDetails?.[0]?.["targeted_revenue"]}
                    />
                  )}
                </h2>
              </div>
              <hr className="mt-2 mb-2" />
              <div className="eachValue text-center">
                <h5 className="text-white text-[15px] mb-0 font-normal">
                  Revenue Received
                </h5>
                <h2 className="text-white text-[22px] font-normal leading-7">
                  {loading ? (
                    <Skeleton width={100} height={50} />
                  ) : (
                    <CountUp
                      start={0}
                      decimal="."
                      prefix="$"
                      decimals={2}
                      end={
                        revenueCardsDetails?.[0]?.["received_revenue"] ||
                        revenueCardsDetails?.[0]?.["total_revenue"]
                      }
                    />
                  )}
                </h2>
              </div>
            </div>
          </div>
        ) : (
          ""
        )}
        {pathName?.includes("billing/dashboard") ? (
          ""
        ) : (
          <div className={styles.card11}>
            <Image alt="" src="/sales-rep-stats.svg" height={660} width={660} />
          </div>
        )}
      </div>
    </>
  );
};
export default BillingStatsCards;
