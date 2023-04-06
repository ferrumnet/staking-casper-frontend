import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isWalletConnected: false,
    connectedAccounts: [],
    withdrawalItems: [],
    selectedAccount: undefined,
    shouldStake: false,
    isStaked: false,
    stakeTransaction: undefined,
    signedAddresses: [],
    stakeWithdrawSucess: 0,
    config: undefined,
    tokenInfo: {
      symbol: 'TOKEN_SYMBOL',
      name: 'TOKEN_NAME',
    }
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
      fetchWithdrawals: (state, action) => {
        console.log(action, 'actionaction')
        state.withdrawalItems = action.payload.withdrawalItems;
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
      signed: (state, action) => {
        console.log(action)
        state.signedAddresses = action.payload
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
        state.tokenInfo = action.payload.tokenInfo;
      },
    },
  });
  