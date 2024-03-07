"use client";
import { createSlice } from "@reduxjs/toolkit";
import { IMarketers } from "./marketers";

const reducerName = "users";

export const initialState: IMarketers.IMarketersInitialState = {
  marketers: [],
};

export const marketerSlice = createSlice({
  name: reducerName,
  initialState,
  reducers: {
    setAllMarketers: (state: any, action: any) => {
      state.marketers = [...action.payload];
    },
    removeAllMarketers: (state: any) => {
      state.marketers = {};
    },
  },
});

export const { setAllMarketers, removeAllMarketers } = marketerSlice.actions;
export const marketerSliceReducer = { [reducerName]: marketerSlice.reducer };
