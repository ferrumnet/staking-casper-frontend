import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isWalletConnected: false,
    connectedAccounts: [],
    selectedAccount: undefined,
    shouldStake: false,
    isStaked: false,
    stakeTransaction: undefined,
    signedAddresses: {},
    stakeWithdrawSucess: 0,
    config: undefined,
  };
  
  export const casperSlice = createSlice({
    name: "casper",
    initialState: initialState,
    reducers: {
      connectWallet: (state, action) => {
        state.isWalletConnected = true;
        state.connectedAccounts = action.payload.connectedAccounts;
        state.selectedAccount = action.payload.connectedAccounts?.length
          ? action.payload.connectedAccounts[0]
          : undefined;
      },
      resetWallet: (state, action) => {
        state.isWalletConnected = false;
        state.connectedAccounts = [];
        state.selectedAddress = undefined;
        state.isStaked = false;
      },
      selectAccount: (state, action) => {
        state.selectedAccount = action.payload.selectedAccount;
      },
      setShouldStake: (state) => {
        state.shouldStake = true;
      },
      staked: (state, action) => {
        state.selectedAccount = action.payload.selectedAccount;
        state.isStaked = true;
        state.stakeTransaction = action.payload.stakeTransaction;
      },
      stakeWithdrawSucess: (state) => {
        state.stakeWithdrawSucess = state.stakeWithdrawSucess + 1;
      },
      configLoaded: (state, action) => {
        state.config = action.payload.config;
      },
    },
  });
  