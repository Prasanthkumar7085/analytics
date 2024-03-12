import React, { FC, ReactNode } from "react";
import styles from "./index.module.css";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@mui/material";
import Cookies from "js-cookie";
import { useDispatch } from "react-redux";
import { removeUserDetails } from "@/Redux/Modules/userlogin";
import Image from "next/image";

interface pageProps {
  children: ReactNode;
}
const NavBar: FC<pageProps> = ({ children }) => {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();

  const logout = () => {
    Cookies.remove("user");
    dispatch(removeUserDetails());
    router.push("/signin");
  };
  return (
    <div className={styles.overviewpage}>
      <div className={styles.background} />
      <div className={styles.container}>
        <header className={styles.navbar}>
          <div className={styles.logocontaier}>
            <Image
              className={styles.labsquirelogoIcon}
              alt=""
              src="/navbar/labsquirelogo@2x.png"
              height={16}
              width={160}
            />
          </div>
          <ul className={styles.navlinkscontainer}>
            <li className={styles.container1}>
              <Link
                href={"/dashboard"}
                className={
                  styles[
                    pathname == "/dashboard" ? "activePagename" : "pagename"
                  ]
                }
              >
                Overview
              </Link>
            </li>
            <li className={styles.container1}>
              <Link
                href={"/sales-representatives"}
                className={
                  styles[
                    pathname.includes("/sales-representatives")
                      ? "activePagename"
                      : "pagename"
                  ]
                }
              >
                Sales Representatives
              </Link>
            </li>
            <li className={styles.container1}>
              <a className={styles.pagename}>Insurances</a>
            </li>
            <li className={styles.container1}>
              <Link
                href={"/facilities"}
                className={
                  styles[
                    pathname == "/facilities" ? "activePagename" : "pagename"
                  ]
                }
              >
                Facilities
              </Link>
            </li>
            <li className={styles.container1}>
              <Link
                href={"/case-types"}
                className={
                  styles[
                    pathname == "/case-types" ? "activePagename" : "pagename"
                  ]
                }
              >
                Case Types
              </Link>
            </li>
            <li className={styles.container1}>
              <a className={styles.pagename}>Reports</a>
            </li>
            <li className={styles.container1}>
              <Button
                onClick={logout}
                sx={{
                  fontSize: "clamp(13px, 0.67vw, 20px)",
                  fontFamily: "'Poppins', sans-serif",
                  color: "#fff",
                  fontWeight: "300",
                }}
              >
                Logout
              </Button>
            </li>
          </ul>
        </header>
        <main className={styles.overviewdetails}>{children}</main>
      </div>
    </div>
  );
};

export default NavBar;
