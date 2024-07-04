"use client";
import { createSlice } from "@reduxjs/toolkit";
import { IMarketers } from "./marketers";

const reducerName = "users";

export const initialState: IMarketers.IMarketersInitialState = {
  marketers: [],
  facilities: [],
  caseTypes: [],
  queryString: "",
  excludeSalesRepValue:false
};

export const marketerSlice = createSlice({
  name: reducerName,
  initialState,
  reducers: {
    setAllMarketers: (state: any, action: any) => {
      state.marketers = [...action.payload];
    },
    removeAllMarketers: (state: any) => {
      state.marketers = [];
    },
    setAllFacilities: (state: any, action: any) => {
      state.facilities = [...action.payload];
    },
    removeAllFacilities: (state: any, action: any) => {
      state.facilities = {};
    },
    setCaseTypeOptions: (state: any, action: any) => {
      state.caseTypes = [...action.payload];
    },
    storeQueryString: (state: any, action: any) => {
      state.queryString = action.payload;
    },
    setExcludeSalesRepValueInStore: (state: any, action: any) => {
      state.excludeSalesRepValue = action.payload;
    }
  },
});

export const {
  setAllMarketers,
  removeAllMarketers,
  setAllFacilities,
  removeAllFacilities,
  setCaseTypeOptions,
  storeQueryString,
  setExcludeSalesRepValueInStore
}: any = marketerSlice.actions;
export const marketerSliceReducer = { [reducerName]: marketerSlice.reducer };
