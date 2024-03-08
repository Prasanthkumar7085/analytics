"use client";
import {
  Button,
  CircularProgress,
  IconButton,
  InputAdornment,
  TextField,
} from "@mui/material";
import type { NextPage } from "next";
import { ChangeEvent, useState } from "react";
import styles from "./login.module.css";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  getAllFacilitiesAPI,
  getAllUsersAPI,
  signInAPI,
} from "@/services/authAPIs";
import { useDispatch } from "react-redux";
import { setUserDetails } from "@/Redux/Modules/userlogin";
import Cookies from "js-cookie";
import ErrorMessages from "@/components/core/ErrorMessage/ErrorMessages";
import Image from "next/image";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import VisibilityIcon from "@mui/icons-material/Visibility";
import {
  setAllFacilities,
  setAllMarketers,
  setCaseTypeOptions,
} from "@/Redux/Modules/marketers";
import { caseTypesOptions } from "@/lib/constants/caseTypes";

const SignIn: NextPage = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [errorMessages, setErrorMessages] = useState<any>([]);
  const [invalidMessage, setInvalidMessage] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const getUsersFromLabsquire = async () => {
    try {
      const userData = await getAllUsersAPI();
      if (userData?.status == 201 || userData?.status == 200) {
        dispatch(setAllMarketers(userData?.data));
      }
    } catch (err) {
      console.error(err);
    }
  };
  const getFacilitiesFromLabsquire = async () => {
    try {
      const facilitiesData = await getAllFacilitiesAPI();
      if (facilitiesData?.status == 201 || facilitiesData?.status == 200) {
        dispatch(setAllFacilities(facilitiesData?.data));
      }
    } catch (err) {
      console.error(err);
    }
  };
  const signIn = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessages([]);
    setInvalidMessage("");
    try {
      const payload = {
        username: email,
        password: password,
      };
      let response: any = await signInAPI(payload);
      if (response.success) {
        Cookies.set("user", response?.user_details?.user_type);
        dispatch(setUserDetails(response));
        dispatch(setCaseTypeOptions(caseTypesOptions));
        getUsersFromLabsquire();
        getFacilitiesFromLabsquire();
        router.push("/dashboard");
      } else if (response.type == "VALIDATION_ERROR") {
        setErrorMessages(response?.error_data?.details);
      } else if (response.type == "Invalid_Credentials") {
        setInvalidMessage(response?.message);
      }
    } catch (err: any) {
      toast.error(err?.message?.toString() || "Something went wrong");

      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  return (
    <main className={styles.login}>
      <section className={styles.imagecontainer}>
        <div className={styles.imagecontainer1} />
      </section>
      <section className={styles.logincontainer}>
        <div className={styles.logocontainer}>
          <img className={styles.logoIcon} alt="" src="/auth/login/logo.svg" />
        </div>
        <div className={styles.loginform}>
          <div className={styles.textwrapper}>
            <h1 className={styles.welcometext}>Welcome back</h1>
            <div
              className={styles.enterYourEmail}
            >{`Enter your email and password to access your account  `}</div>
          </div>
          <form className={styles.form} onSubmit={signIn}>
            <div className={styles.inputgroup}>
              <div className={styles.email}>
                <label className={styles.lable}>Email</label>
                <TextField
                  className={styles.emailinput}
                  placeholder="Enter email"
                  value={email}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setEmail(e.target.value)
                  }
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Image
                          src="/auth/login/usericon.svg"
                          alt=""
                          height={17}
                          width={17}
                        />
                      </InputAdornment>
                    ),
                  }}
                />
                <ErrorMessages
                  errorMessages={errorMessages}
                  keyname={"username"}
                />
              </div>
              <div className={styles.email}>
                <label className={styles.lable}>Password</label>
                <div className={styles.container}>
                  <TextField
                    type={showPassword ? "text" : "password"}
                    className={styles.passwordinput}
                    placeholder="Enter email"
                    value={password}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      setPassword(e.target.value)
                    }
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Image
                            src="/auth/login/password.svg"
                            alt=""
                            height={17}
                            width={17}
                          />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {!showPassword ? (
                              <VisibilityOffIcon />
                            ) : (
                              <VisibilityIcon style={{}} />
                            )}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                  <ErrorMessages
                    errorMessages={errorMessages}
                    keyname={"password"}
                  />
                  {invalidMessage ? invalidMessage : ""}
                  <div className={styles.forgotpasswordbuttoncontainer}>
                    <button className={styles.forgotpasswordbutton}>
                      <p className={styles.text}>Forgot Password?</p>
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <Button className={styles.signinbutton} type="submit">
              {loading ? <CircularProgress size={"1.5rem"} /> : "Sign In"}
            </Button>
          </form>
        </div>
      </section>
    </main>
  );
};

export default SignIn;
