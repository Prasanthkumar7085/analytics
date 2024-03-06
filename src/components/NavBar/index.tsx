import React, { FC, ReactNode } from "react";
import styles from "./index.module.css";

interface pageProps {
  children: ReactNode;
}
const NavBar: FC<pageProps> = ({ children }) => {
  return (
    <div className={styles.overviewpage}>
      <div className={styles.background} />
      <div className={styles.container}>
        <header className={styles.navbar}>
          <div className={styles.logocontaier}>
            <img
              className={styles.labsquirelogoIcon}
              alt=""
              src="/navbar/labsquirelogo@2x.png"
            />
          </div>
          <ul className={styles.navlinkscontainer}>
            <li className={styles.container1}>
              <a className={styles.pagename}>Overview</a>
            </li>
            <li className={styles.container1}>
              <a className={styles.pagename}>Sales Representatives</a>
            </li>
            <li className={styles.container1}>
              <a className={styles.pagename}>Insurances</a>
            </li>
            <li className={styles.container1}>
              <a className={styles.pagename}>Facilities</a>
            </li>
            <li className={styles.container1}>
              <a className={styles.pagename}>Case Types</a>
            </li>
            <li className={styles.container1}>
              <a className={styles.pagename}>Reports</a>
            </li>
          </ul>
        </header>
        <main className={styles.overviewdetails}>{children}</main>
      </div>
    </div>
  );
};

export default NavBar;
