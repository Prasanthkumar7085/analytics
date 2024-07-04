import { removeUserDetails } from "@/Redux/Modules/userlogin";
import { adminAccess, hasAccessOrNot } from "@/lib/helpers/hasAccessOrNot";
import { Avatar, Box, Button, Menu, MenuItem, Typography } from "@mui/material";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Cookies from "js-cookie";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import React, { FC, ReactNode } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "./index.module.css";
import CheckBoxForExcludeGenSales from "../core/CheckBoxForExcludeGenSales";

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
  const userDetails = useSelector(
    (state: any) => state.auth.user?.user_details
  );
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null
  );
  const [adminMenuanchorElUser, setAdminMenuAnchorElUser] =
    React.useState<null | HTMLElement>(null);
  const handleOpenAdminMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAdminMenuAnchorElUser(event.currentTarget);
  };
  const handleCloseAdminMenu = () => {
    setAdminMenuAnchorElUser(null);
  };

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

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
                    className={`text-white font-normal capitalize cursor-pointer hover:text-[#DD5050] leading-5 focus:text-white text-md hover:no-underline focus:no-underline ${
                      styles[
                        pathname == "/dashboard" ? "activePagename" : "active"
                      ]
                    }`}
                  >
                    Overview
                  </li>
                ) : (
                  ""
                )}
                {hasAccessOrNot("/sales-representatives", userType) &&
                userType ? (
                  <li
                    onClick={() => router.push("/sales-representatives")}
                    className={`text-white font-normal capitalize cursor-pointer hover:text-[#DD5050] leading-5 focus:text-white text-md hover:no-underline focus:no-underline ${
                      styles[
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
                    className={`text-white font-normal capitalize cursor-pointer hover:text-[#DD5050] leading-5 focus:text-white text-md hover:no-underline focus:no-underline ${
                      styles[
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
                    className={`text-white font-normal capitalize cursor-pointer hover:text-[#DD5050] leading-5 focus:text-white text-md hover:no-underline focus:no-underline ${
                      styles[
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
                    className={`text-white font-normal capitalize cursor-pointer hover:text-[#DD5050] leading-5 focus:text-white text-md hover:no-underline focus:no-underline ${
                      styles[
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
                    className={`text-white font-normal capitalize cursor-pointer hover:text-[#DD5050] leading-5 focus:text-white text-md hover:no-underline focus:no-underline ${
                      styles[
                        pathname == "/sales-targets"
                          ? "activePagename"
                          : "active"
                      ]
                    }`}
                  >
                    Sales Targets
                  </li>
                ) : (
                  ""
                )}
                {/* {hasAccessOrNot("/target-status", userType) && userType ? (
                  <li
                    onClick={() => router.push("/target-status")}
                    className={`text-white font-normal capitalize cursor-pointer hover:text-[#DD5050] leading-5 focus:text-white text-md hover:no-underline focus:no-underline ${
                      styles[
                        pathname == "/target-status"
                          ? "activePagename"
                          : "active"
                      ]
                    }`}
                  >
                    Sales Achievements
                  </li>
                ) : (
                  ""
                )} */}

                {adminAccess() ? (
                  <Box
                    className={styles.navList}
                    sx={{ display: { xs: "none", sm: "block" } }}
                  >
                    <div
                      className={styles.profileBlock}
                      onClick={handleOpenAdminMenu}
                    >
                      <div className={styles.adminCaption}>
                        <Typography variant="subtitle1">
                          Admin Settings
                          <Image
                            src="/navbar/drop-down-icon.svg"
                            alt="drop-down"
                            width={15}
                            height={15}
                          />
                        </Typography>
                      </div>
                    </div>
                  </Box>
                ) : (
                  ""
                )}
                <Box
                  className={styles.navList}
                  sx={{ display: { xs: "none", sm: "block" } }}
                >
                  <div
                    className={styles.profileBlock}
                    onClick={handleOpenUserMenu}
                  >
                    <Avatar sx={{ bgcolor: "orange" }}>
                      {userDetails?.username?.slice(0, 1).toUpperCase()}
                    </Avatar>
                    <div className={styles.adminCaption}>
                      <Typography>{userType}</Typography>
                      <Typography variant="subtitle1">
                        {userDetails?.first_name ? userDetails?.first_name : ""}{" "}
                        {userDetails?.last_name ? userDetails?.last_name : ""}
                        <Image
                          src="/navbar/drop-down-icon.svg"
                          alt="drop-down"
                          width={15}
                          height={15}
                        />
                      </Typography>
                    </div>
                  </div>
                </Box>
              </ul>
            </Grid>
          </Grid>

          <Menu
            sx={{
              mt: "45px",
              "& .MuiPaper-root": {
                boxShadow: "none",
                border: "1px solid  #CECECE",
                borderRadius: "8px",
                paddingInline: "1rem",
              },
            }}
            id="menu-appbar"
            anchorEl={adminMenuanchorElUser}
            anchorOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            keepMounted
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            open={Boolean(adminMenuanchorElUser)}
            onClose={handleCloseAdminMenu}
          >
            {/* <MenuItem className={styles.dropDownMenu} sx={{ fontSize: "12px" }}>
              <CheckBoxForExcludeGenSales />
            </MenuItem> */}
            <MenuItem
              className={styles.dropDownMenu}
              onClick={() => {
                window.open("/patient-results", "_blank");
              }}
            >
              1. Patient Results
            </MenuItem>
          </Menu>

          <Menu
            sx={{
              mt: "45px",
              "& .MuiPaper-root": {
                boxShadow: "none",
                border: "1px solid  #CECECE",
                borderRadius: "8px",
                paddingInline: "1rem",
              },
            }}
            id="menu-appbar"
            anchorEl={anchorElUser}
            anchorOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            keepMounted
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            open={Boolean(anchorElUser)}
            onClose={handleCloseUserMenu}
          >
            <MenuItem className={styles.dropDownMenu} onClick={logout}>
              Log Out
            </MenuItem>
          </Menu>
        </Container>
      </nav>
      <div
        className={
          pathname?.includes("patient-results")
            ? "patientResultstsDashboard"
            : styles.primaryMainDashboard
        }
      >
        <Container maxWidth="xl">
          <main>{children}</main>
        </Container>
      </div>
    </section>
  );
};

export default NavBar;
