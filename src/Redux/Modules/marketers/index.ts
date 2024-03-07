"use client";
import { marketerSliceReducer } from "./marketers.slice";

const combinedReducer = {
  ...marketerSliceReducer,
};

export * from "./marketers.slice";
export default combinedReducer;
