import { algorandSlice } from "./algorandSlice";
import moment from "moment";
const { actions } = algorandSlice;

export const connectWallet = (connectedAccounts) => async (dispatch) => {
  dispatch(
    actions.connectWallet({
      connectedAccounts: connectedAccounts,
    })
  );
};

export const resetWallet = (connectedAccounts) => async (dispatch) => {
  dispatch(actions.resetWallet());
};

export const staked = (selectedAddress) => async (dispatch) => {
  dispatch(actions.staked({ selectedAddress }));
};

export const signed = (signedAddress) => async (dispatch) => {
  dispatch(actions.singed(signedAddress));
};

export const selectAccount = (selectedAccount) => async (dispatch) => {
  dispatch(actions.selectAccount({ selectedAccount }));
};

export const shouldStake = () => async (dispatch) => {
  dispatch(actions.setShouldStake());
};

export const stakeWithdrawSucess = () => async (dispatch) => {
  dispatch(actions.stakeWithdrawSucess());
};

export const configLoaded = (config) => async (dispatch) => {
  console.log(config);
  // var stillUtc = moment
  //   .utc(moment.utc(values.stakingStarts).format("YYYY-MM-DD HH:mm:ss Z"))
  //   .toDate();
  // console.log(moment(stillUtc).local().format("YYYY-MM-DD HH:mm:ss"));
  const stakingStartUtc = moment
    .utc(moment.utc(config.stakingStarts).format("YYYY-MM-DD HH:mm:ss Z"))
    .toDate();
  // console.log(moment(stakingStartUtc).local().format("YYYY-MM-DD HH:mm:ss")); // UTC to Local
  const stakingEndsUtc = moment
    .utc(moment.utc(config.stakingEnds).format("YYYY-MM-DD HH:mm:ss Z"))
    .toDate();
  // console.log(moment(stakingEndsUtc).local().format("YYYY-MM-DD HH:mm:ss")); // UTC to Local
  const withdrawStartUtc = moment
    .utc(moment.utc(config.withdrawStarts).format("YYYY-MM-DD HH:mm:ss Z"))
    .toDate();
  // console.log(moment(withdrawStartUtc).local().format("YYYY-MM-DD HH:mm:ss")); // UTC to Local
  const withdrawEndsUtc = moment
    .utc(moment.utc(config.withdrawEnds).format("YYYY-MM-DD HH:mm:ss Z"))
    .toDate();
  // console.log(moment(withdrawEndsUtc).local().format("YYYY-MM-DD HH:mm:ss")); // UTC to Local
  const data = {
    ...config,
    stakingStarts: moment(stakingStartUtc)
      .local()
      .format("YYYY-MM-DD HH:mm:ss"),
    stakingEnds: moment(stakingEndsUtc).local().format("YYYY-MM-DD HH:mm:ss"),
    withdrawStart: moment(withdrawStartUtc)
      .local()
      .format("YYYY-MM-DD HH:mm:ss"),
    withdrawEnds: moment(withdrawEndsUtc).local().format("YYYY-MM-DD HH:mm:ss"),
  };
  dispatch(actions.configLoaded({ config: data }));
};
