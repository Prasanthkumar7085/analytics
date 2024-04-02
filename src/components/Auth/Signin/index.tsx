"use client";
//REVIEW: Remove unused imports
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
import { getSingleRepProfileDeatilsAPI } from "@/services/salesRepsAPIs";

const SignIn: NextPage = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [errorMessages, setErrorMessages] = useState<any>([]);
  const [invalidMessage, setInvalidMessage] = useState<string>("");
  const [loading, setLoading] = useState(false);


  // REVIEW: Remove unused code
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


  //get single sales rep ref id
  const getSalesRepDetails = async () => {
    setLoading(true);

    try {
      let response: any = await getSingleRepProfileDeatilsAPI();
      if (response.success) {
        let refId = response?.data?.[0]?.id;
        Cookies.set("user_ref_id", refId);
        router.push(`/sales-representatives/${refId}`);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
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
        if (response?.user_details?.user_type == "MARKETER") {
          await getSalesRepDetails();
          //TODO: Remove this condition after confirmed
          // } else if (
          //   response?.user_details?.user_type == "HOSPITAL_MARKETING_MANAGER"
          // ) {
          //   router.push("/dashboard");
        } else {
          router.push("/dashboard");
        }
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
    <section id="loginPage" className="flex h-screen overflow-hidden">
      <div className="hidden md:block w-1/2 bg-indigo-900 text-white signInBackground">
        <div className="caption absolute top-[40%] left-[5%] max-w-md">
          <h4 className="text-5xl mb-5">Welcome back!</h4>
          <p className="text-md leading-7">
            We are glad to see you again! Get access to your Reports, Revenues
            and Volumes.
          </p>
        </div>
      </div>
      <div className="w-full md:w-1/2 p-8 md:p-16 flex items-center justify-center">
        <div className="max-w-md w-full">
          <div className="logo flex items-center justify-center mb-20">
            <Image
              className="w-[600px]"
              alt=""
              src="/auth/login/logo.svg"
              height={20}
              width={20}
            />
          </div>
          <form onSubmit={signIn}>
            <h4 className="text-3xl mb-7">Sign In</h4>
            <div className="formGroupItem mb-7">
              <label htmlFor="email" className="block text-gray-700">
                Username
              </label>
              <input
                id="email"
                name="email"
                className="mt-1 block w-full border h-[50px] rounded pl-4 mb-2"
                placeholder="Enter Username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <ErrorMessages errorMessages={errorMessages} keyname="username" />
            </div>
            <div className="form-group mb-5">
              <label htmlFor="password" className="block text-gray-700">
                Password
              </label>
              <div>
                <div>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      name="password"
                      className="mt-1 block w-full border h-[50px] rounded pl-4 mb-2"
                      placeholder="Enter Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? "Hide" : "Show"}
                    </button>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="w-1/2">
                      <ErrorMessages
                        errorMessages={errorMessages}
                        keyname="password"
                      />
                    </div>

                    {/* <div className="w-1/2 forgot-password text-right">
                      <button
                        type="button"
                        className="text-sm text-indigo-600 hover:underline"
                      >
                        Forgot Password?
                      </button>
                    </div> */}
                  </div>
                </div>
              </div>
            </div>
            {invalidMessage && (
              <p className="text-red-500 pt-3">{invalidMessage}</p>
            )}
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md transition duration-300 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
            >
              {loading ? "Loading...." : "Sign In"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default SignIn;
