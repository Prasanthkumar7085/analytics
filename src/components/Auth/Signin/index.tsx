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
import { EyeIcon, EyeOffIcon, Spinner } from "@heroicons/react/outline";

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
    <section id="loginPage" className="flex h-screen overflow-hidden">
      <div className="hidden md:block w-1/2 bg-indigo-900 text-white flex items-center justify-center">
        <div className="logo">
          <Image
            className="w-[250px]"
            alt=""
            src="/auth/login/logo.svg"
            height={20}
            width={20}
          />
        </div>
      </div>
      <div className="w-full md:w-1/2 p-8 md:p-16 flex items-center justify-center">
        <div className="max-w-md w-full">
          <div className="mb-8">
            <div className="flex items-center justify-center mb-10"></div>

            <h1 className="text-3xl md:text-4xl font-bold text-center text-gray-900">
              Welcome back
            </h1>
            <p className="text-center text-gray-600">
              Enter your email and password to access your account
            </p>
          </div>
          <form className="space-y-4" onSubmit={signIn}>
            <div>
              <label htmlFor="email" className="block text-gray-700">
                Email
              </label>
              <input
                id="email"
                name="email"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <ErrorMessages errorMessages={errorMessages} keyname="username" />
            </div>
            <div>
              <label htmlFor="password" className="block text-gray-700">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 pr-10"
                  placeholder="Enter password"
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
              <ErrorMessages errorMessages={errorMessages} keyname="password" />
              {invalidMessage && (
                <p className="text-red-500">{invalidMessage}</p>
              )}
              <div className="text-right">
                <button
                  type="button"
                  className="text-sm text-indigo-600 hover:underline"
                >
                  Forgot Password?
                </button>
              </div>
            </div>
            <div>
              <button
                type="submit"
                className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md transition duration-300 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
              >
                {loading ? "Loading..." : "Sign In"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default SignIn;
