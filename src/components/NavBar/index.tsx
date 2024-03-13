import React, { FC, ReactNode } from "react";
import styles from "./index.module.css";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@mui/material";
import Cookies from "js-cookie";
import { useDispatch } from "react-redux";
import { removeUserDetails } from "@/Redux/Modules/userlogin";
import Image from "next/image";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";

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
    <section>
      <nav className={styles.primaryNavbar}>
        <Container maxWidth="xl">
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={3}>
              <Image
                className={styles.labsquirelogoIcon}
                alt=""
                src="/navbar/labsquirelogo@2x.png"
                height={16}
                width={160}
              />
            </Grid>
            <Grid item xs={9}>
              <ul className={styles.navigationLinks}>
                <li>
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
                <li>
                  <Link
                    href={"/sales-representatives"}
                    className={
                      styles[
                        pathname == "/sales-representatives"
                          ? "activePagename"
                          : "pagename"
                      ]
                    }
                  >
                    Sales Representatives
                  </Link>
                </li>
                <li>
                  <a className={styles.pagename}>Insurances</a>
                </li>
                <li className={styles.container1}>
                  <Link
                    href={"/facilities"}
                    className={
                      styles[
                        pathname == "/facilities"
                          ? "activePagename"
                          : "pagename"
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
                        pathname == "/case-types"
                          ? "activePagename"
                          : "pagename"
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
            </Grid>
          </Grid>
        </Container>
      </nav>
      <div className={styles.primaryMainDashboard}>
        <Container maxWidth="xl">
          <main>{children}</main>
        </Container>
      </div>
    </section>
  );
};

export default NavBar;
