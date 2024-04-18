import { removeUserDetails } from "@/Redux/Modules/userlogin";
import { hasAccessOrNot } from "@/lib/helpers/hasAccessOrNot";
import { Button } from "@mui/material";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Cookies from "js-cookie";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { FC, ReactNode } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "./index.module.css";

interface pageProps {
  children: ReactNode;
}
const NavBar: FC<pageProps> = ({ children }) => {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();

  const userType = useSelector(
    (state: any) => state.auth.user?.user_details?.user_type
  );

  const logout = () => {
    Cookies.remove("user");
    Cookies.remove("user_ref_id");
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
                onClick={() => router.push("/dashboard")}
                style={{ cursor: "pointer" }}
                className={styles.labsquirelogoIcon}
                alt=""
                src="/navbar/labsquirelogo@2x.png"
                height={16}
                width={160}
              />
            </Grid>
            <Grid item xs={9}>
              <ul className="flex items-center justify-end space-x-7">
                {hasAccessOrNot("/dashboard", userType) && userType ? (
                  <li
                    onClick={() => router.push("/dashboard")}
                    className={`text-white font-normal capitalize cursor-pointer hover:text-[#DD5050] leading-5 focus:text-white text-md hover:no-underline focus:no-underline ${styles[
                      pathname == "/dashboard" ? "activePagename" : "active"
                    ]
                      }`}
                  >
                    Overview
                  </li>
                ) : (
                  ""
                )}
                {hasAccessOrNot("/sales-representatives", userType) && userType ? (
                  <li
                    onClick={() => router.push("/sales-representatives")}
                    className={`text-white font-normal capitalize cursor-pointer hover:text-[#DD5050] leading-5 focus:text-white text-md hover:no-underline focus:no-underline ${styles[
                      pathname.includes("/sales-representatives")
                        ? "activePagename"
                        : "active"
                    ]
                      }`}
                  >
                    Sales Representatives
                  </li>
                ) : (
                  ""
                )}
                {hasAccessOrNot("/insurances", userType) && userType ? (
                  <li
                    onClick={() => router.push("/insurances")}
                    className={`text-white font-normal capitalize cursor-pointer hover:text-[#DD5050] leading-5 focus:text-white text-md hover:no-underline focus:no-underline ${styles[
                      pathname.includes("/insurances")
                        ? "activePagename"
                        : "active"
                    ]
                      }`}
                  >
                    Insurances
                  </li>
                ) : (
                  ""
                )}
                {hasAccessOrNot("/facilities", userType) && userType ? (
                  <li
                    onClick={() => router.push("/facilities")}
                    className={`text-white font-normal capitalize cursor-pointer hover:text-[#DD5050] leading-5 focus:text-white text-md hover:no-underline focus:no-underline ${styles[
                      pathname.includes("/facilities")
                        ? "activePagename"
                        : "active"
                    ]
                      }`}
                  >
                    Facilities
                  </li>
                ) : (
                  ""
                )}
                {hasAccessOrNot("/case-types", userType) && userType ? (
                  <li
                    onClick={() => router.push("/case-types")}
                    className={`text-white font-normal capitalize cursor-pointer hover:text-[#DD5050] leading-5 focus:text-white text-md hover:no-underline focus:no-underline ${styles[
                      pathname.includes("/case-types")
                        ? "activePagename"
                        : "active"
                    ]
                      }`}
                  >
                    Case Types
                  </li>
                ) : (
                  ""
                )}

                {hasAccessOrNot("/sales-targets", userType) && userType ? (
                  <li
                    onClick={() => router.push("/sales-targets")}
                    className={`text-white font-normal capitalize cursor-pointer hover:text-[#DD5050] leading-5 focus:text-white text-md hover:no-underline focus:no-underline ${styles[
                      pathname == "/sales-targets" ? "activePagename" : "active"
                    ]
                      }`}
                  >
                    Sales Targets
                  </li>
                ) : (
                  ""
                )}

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
            {/* {userType == "MARKETER" ?
              <Grid item xs={9}>
                <ul className="flex items-center justify-end space-x-7">
                  <li
                    className={`text-white font-normal capitalize cursor-pointer hover:text-[#DD5050] leading-5 focus:text-white text-md hover:no-underline focus:no-underline ${styles[
                      pathname.includes("/sales-representatives")
                        ? "activePagename"
                        : "active"
                    ]
                      }`}
                  >
                    Sales Representatives
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
              :

              <Grid item xs={9}>

                <ul className="flex items-center justify-end space-x-7">
                  <li

                    onClick={() => router.push("/dashboard")}
                    className={`text-white font-normal capitalize cursor-pointer hover:text-[#DD5050] leading-5 focus:text-white text-md hover:no-underline focus:no-underline ${styles[
                      pathname == "/dashboard" ? "activePagename" : "active"
                    ]
                      }`}
                  >
                    Overview
                  </li>
                  <li
                    onClick={() => router.push("/sales-representatives")}
                    className={`text-white font-normal capitalize cursor-pointer hover:text-[#DD5050] leading-5 focus:text-white text-md hover:no-underline focus:no-underline ${styles[
                      pathname.includes("/sales-representatives")
                        ? "activePagename"
                        : "active"
                    ]
                      }`}
                  >
                    Sales Representatives
                  </li>
                  <li
                    onClick={() => router.push("/insurances")}
                    className={`text-white font-normal capitalize cursor-pointer hover:text-[#DD5050] leading-5 focus:text-white text-md hover:no-underline focus:no-underline ${styles[
                      pathname.includes("/insurances") ? "activePagename" : "active"
                    ]
                      }`}
                  >
                    Insurances
                  </li>
                  <li
                    onClick={() => router.push("/facilities")}
                    className={`text-white font-normal capitalize cursor-pointer hover:text-[#DD5050] leading-5 focus:text-white text-md hover:no-underline focus:no-underline ${styles[
                      pathname.includes("/facilities") ? "activePagename" : "active"
                    ]
                      }`}
                  >
                    Facilities
                  </li>
                  <li
                    onClick={() => router.push("/case-types")}
                    className={`text-white font-normal capitalize cursor-pointer hover:text-[#DD5050] leading-5 focus:text-white text-md hover:no-underline focus:no-underline ${styles[
                      pathname.includes("/case-types") ? "activePagename" : "active"
                    ]
                      }`}
                  >
                    Case Types
                  </li>
                  <li>
                    <a
                      className={`text-white font-normal capitalize cursor-pointer hover:text-[#DD5050] leading-5 focus:text-white text-md hover:no-underline focus:no-underline ${styles[
                        pathname.includes("/reports") ? "activePagename" : "active"
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
              </Grid>} */}
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
