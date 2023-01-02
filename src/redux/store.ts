import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { reduxBatch } from "@manaflair/redux-batch";
import { casperSlice } from './casper/casperSlice';

const store = configureStore({
    reducer: {
        casper: combineReducers({
            "connect": casperSlice.reducer
        })
    },
    middleware: (getDefaultMiddleware) => 
     getDefaultMiddleware({

     }).concat(),
    devTools: process.env.NODE_ENV !== "production",
    enhancers: [reduxBatch],
})

export default store;