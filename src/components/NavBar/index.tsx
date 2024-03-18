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
              <ul className="flex items-center justify-end space-x-7">
                <li>
                  <Link
                    href={"/dashboard"}
                    className={`text-white font-normal capitalize cursor-pointer hover:text-[#DD5050] leading-5 focus:text-white text-md hover:no-underline focus:no-underline ${
                      styles[
                        pathname == "/dashboard" ? "activePagename" : "active"
                      ]
                    }`}
                  >
                    Overview
                  </Link>
                </li>
                <li>
                  <Link
                    href={"/sales-representatives"}
                    className={`text-white font-normal capitalize cursor-pointer hover:text-[#DD5050] leading-5 focus:text-white text-md hover:no-underline focus:no-underline ${
                      styles[
                        pathname.includes("/sales-representatives")
                          ? "activePagename"
                          : "active"
                      ]
                    }`}
                  >
                    Sales Representatives
                  </Link>
                </li>
                <li>
                  <a
                    className={`text-white font-normal capitalize cursor-pointer hover:text-[#DD5050] leading-5 focus:text-white text-md hover:no-underline focus:no-underline ${
                      styles[
                        pathname == "/insurance" ? "activePagename" : "active"
                      ]
                    }`}
                  >
                    Insurances
                  </a>
                </li>
                <li>
                  <Link
                    href={"/facilities"}
                    className={`text-white font-normal capitalize cursor-pointer hover:text-[#DD5050] leading-5 focus:text-white text-md hover:no-underline focus:no-underline ${
                      styles[
                        pathname == "/facilities" ? "activePagename" : "active"
                      ]
                    }`}
                  >
                    Facilities
                  </Link>
                </li>
                <li>
                  <Link
                    href={"/case-types"}
                    className={`text-white font-normal capitalize cursor-pointer hover:text-[#DD5050] leading-5 focus:text-white text-md hover:no-underline focus:no-underline ${
                      styles[
                        pathname == "/case-types" ? "activePagename" : "active"
                      ]
                    }`}
                  >
                    Case Types
                  </Link>
                </li>
                <li>
                  <a
                    className={`text-white font-normal capitalize cursor-pointer hover:text-[#DD5050] leading-5 focus:text-white text-md hover:no-underline focus:no-underline ${
                      styles[
                        pathname == "/reports" ? "activePagename" : "active"
                      ]
                    }`}
                  >
                    Reports
                  </a>
                </li>
                <li>
                  <Button
                    onClick={logout}
                    className="p-0 text-white font-normal capitalize cursor-pointer hover:text-[#DD5050] leading-5 focus:text-white text-md"
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
