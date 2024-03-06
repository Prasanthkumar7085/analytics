"use client"
import { userLoginSliceReducer } from "./userlogin.slice";

const combinedReducer = {
  ...userLoginSliceReducer,

};

export * from "./userlogin.slice";
export default combinedReducer;
