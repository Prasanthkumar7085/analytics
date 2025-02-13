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
import {
  AnalyticsNavBarOptions,
  BillingNavBarOptions,
} from "@/lib/constants/navbarOptions";

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

  const getClassNames = () => {
    if (pathname.includes("/toxicology-results")) {
      return `${styles.primaryNavbar} ${styles.toxicologyHeader}`;
    } else {
      return `${styles.primaryNavbar}`;
    }
  };
  return (
    <section>
      <nav className={getClassNames()} id="navbar">
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
              <ul className="flex items-center justify-end space-x-5">
                {pathname?.includes("toxicology-results") ||
                pathname?.includes("patient-results") ? (
                  ""
                ) : (
                  <>
                    {AnalyticsNavBarOptions?.length &&
                    !pathname?.includes("billing")
                      ? AnalyticsNavBarOptions?.map((item, index) => {
                          return hasAccessOrNot(`/${item?.link}`, userType) &&
                            userType ? (
                            <li
                              onClick={() => router.push(`/${item?.link}`)}
                              className={`text-white font-normal capitalize cursor-pointer hover:text-[#DD5050] leading-5 focus:text-white text-sm hover:no-underline focus:no-underline ${
                                styles[
                                  pathname == `/${item?.link}`
                                    ? "activePagename"
                                    : "active"
                                ]
                              }`}
                            >
                              {item?.title}
                            </li>
                          ) : (
                            ""
                          );
                        })
                      : BillingNavBarOptions?.map((item, index) => {
                          return hasAccessOrNot(`/${item?.link}`, userType) &&
                            userType ? (
                            <li
                              onClick={() => router.push(`/${item?.link}`)}
                              className={`text-white font-normal capitalize cursor-pointer hover:text-[#DD5050] leading-5 focus:text-white text-md hover:no-underline focus:no-underline text-sm ${
                                styles[
                                  pathname?.includes(`/${item?.link}`)
                                    ? "activePagename"
                                    : "active"
                                ]
                              }`}
                            >
                              {item?.title}
                            </li>
                          ) : (
                            ""
                          );
                        })}
                  </>
                )}

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
                    <Avatar
                      sx={{ bgcolor: "orange" }}
                      className="navbar-avatar"
                    >
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
            className="admit-settings-menu"
            sx={{
              mt: "45px",
              "& .MuiPaper-root": {
                boxShadow: "none",
                border: "1px solid  #CECECE",
                borderRadius: "8px",
                paddingInline: "1rem",
              },
            }}
            PaperProps={{
              elevation: 0,
              sx: {
                overflow: "visible",
                filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                mt: 1.5,
                "& .MuiAvatar-root": {
                  width: 32,
                  height: 32,
                  ml: -0.5,
                  mr: 1,
                },
                "& .MuiButtonBase-root": {
                  fontSize: "14px",
                },
                "&::before": {
                  content: '""',
                  display: "block",
                  position: "absolute",
                  top: 0,
                  right: 14,
                  width: 10,
                  height: 10,
                  bgcolor: "background.paper",
                  transform: "translateY(-50%) rotate(45deg)",
                  zIndex: 0,
                },
              },
            }}
            id="menu-appbar admin-settings-menu"
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
            <MenuItem
              className={styles.dropDownMenu}
              id="admin-settings-menu-items"
              onClick={() => {
                window.open("/patient-results", "_blank");
                handleCloseAdminMenu();
              }}
            >
              1. Patient Results
            </MenuItem>

            <MenuItem
              className={styles.dropDownMenu}
              id="admin-settings-menu-items"
              onClick={() => {
                window.open("/toxicology-results", "_blank");
                handleCloseAdminMenu();
              }}
            >
              2.Toxicology Results
            </MenuItem>

            {/* {!pathname?.includes("billing") ? (
              <MenuItem
                className={styles.dropDownMenu}
                onClick={() => {
                  window.open("/billing/dashboard", "_blank");
                  handleCloseAdminMenu();
                }}
              >
                3. Billing analytics
              </MenuItem>
            ) : (
              ""
            )} */}
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
          pathname?.includes("patient-results") ||
          pathname?.includes("toxicology-results")
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
