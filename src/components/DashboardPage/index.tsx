"use client"
import Revenue from "./CaseType";
import CaseType from "./CaseType";
import SalesRep from "./SalesRep";
import Stats from "./Stats";
import styles from "./index.module.css";

const DashboardPage = () => {
  return (
    <main className={styles.overviewdetails}>
      <section className={styles.container7}>
        <Stats />
        <CaseType />
      </section>
      <section className={styles.container8}>
        <Revenue />
        <SalesRep />
      </section>
    </main>
  );
};
export default DashboardPage;
