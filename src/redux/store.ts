import { configureStore } from "@reduxjs/toolkit";
import { reduxBatch } from "@manaflair/redux-batch";

const store = configureStore({
    reducer: {},
    middleware: (getDefaultMiddleware) => 
     getDefaultMiddleware({

     }).concat(),
    devTools: process.env.NODE_ENV !== "production",
    enhancers: [reduxBatch],
})

export default store;