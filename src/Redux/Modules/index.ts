import { combineReducers } from "@reduxjs/toolkit";
import userLoginReducer from "./userlogin";
import marketerReducer from "./marketers";
export const combinedReducer = combineReducers({
  ...userLoginReducer,
  ...marketerReducer,
});
