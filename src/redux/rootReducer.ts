import { combineReducers } from "@reduxjs/toolkit";
import { casperSlice } from "./casper/casperSlice";

const rootReducer = combineReducers({
    casper: casperSlice.reducer,
});

export default rootReducer;