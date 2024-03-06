"use client"
import CaseType from "./CaseType";
import RevenueBlock from "./Revenue";
import SalesRep from "./SalesRep";
import Stats from "./Stats";
import styles from "./index.module.css";

const DashboardPage = () => {
  return (
    <main className={styles.overviewdetails}>
      <section className={styles.container7}>
        <div style={{ width: "40%" }}>
          <Stats />
        </div>
        <div style={{ width: "60%" }}>
          <CaseType />
        </div>
      </section>
      <section className={styles.container8}>
        <RevenueBlock />
        <SalesRep />
      </section>
    </main>
  );
};
export default DashboardPage;
