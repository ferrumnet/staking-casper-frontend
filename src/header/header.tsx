import React, { useState } from "react";
import {
  FHeader,
  // FHeaderCollapse,
  FButton,
  FItem,
  FTruncateText,
  // FHeaderMenuItem,
} from "ferrum-design-system";
import { useSelector, useDispatch } from "react-redux";
import { ReactComponent as IconNetwork } from "../assets/images/Icon-connect-network.svg";
import logo from "../assets/images/logo-light.svg";
import { CgArrowsExchangeAlt } from "react-icons/cg";
import { CasperClient, CasperServiceByJsonRPC } from "casper-js-sdk";
import AddressSelector from "../dialogs/AddressSelector";


const RPC_API = "https://casperlabs-proxy-server.herokuapp.com/http://44.208.234.65:7777/rpc";
const STATUS_API = "http://159.65.203.12:8888";

const casperService = new CasperServiceByJsonRPC(RPC_API);
const casperClient = new CasperClient(RPC_API);

const Header = () => {
  const dispatch = useDispatch();
  const [showAddressSelectorDlg, setShowAddressSelectorDlg] =
    useState<boolean>(false);
  const selectedAccount: { address?: string } = {};
  const connectedAccounts: [] = [];

  const connectWallet = async () => {
    await  window.casperlabsHelper.requestConnection();
    const isConnected = await window.casperlabsHelper.isConnected();
    if (isConnected) {
      await AccountInformation();
    }   
  };

  const disconnectWallet = () => {
    window.casperlabsHelper.disconnectFromSite();
  };

  async function AccountInformation() {
    const isConnected = await window.casperlabsHelper.isConnected();

    if (isConnected) {
        const publicKey = await window.casperlabsHelper.getActivePublicKey();
        //textAddress.textContent += publicKey;

        const latestBlock = await casperService.getLatestBlockInfo();
        const root = await casperService.getStateRootHash(latestBlock?.block?.hash);
        console.log(latestBlock, root)

        // const balanceUref = await casperService.getAccountBalanceUrefByPublicKey(root, CLPublicKey.fromHex(publicKey));
        // console.log(balanceUref)
        // // @ts-ignore
        // const balance = await casperService.getAccountBalance(latestBlock?.block?.header?.state_root_hash, balanceUref);
        // console.log(balance.toString())
        //textBalance.textContent = `PublicKeyHex ${balance.toString()}`;
    }
}

  return (
    <div>
      <FHeader showLogo={true} headerLogo={logo} className="bg-none">
        <FItem display={"flex"} align="right" alignY={"center"}>
          {connectedAccounts?.length ? (
            <>
              <FButton
                prefix={<CgArrowsExchangeAlt />}
                onClick={() => {
                  setShowAddressSelectorDlg(true);
                }}
              ></FButton>
              <FButton
                className="f-mr-1"
                title={"Disconnect Wallet"}
                onClick={connectWallet}
                btnInfo={
                  <FItem display={"flex"}>
                    <IconNetwork width={20} />{" "}
                    <FTruncateText
                      className="f-ml-1"
                      text={selectedAccount?.address}
                    />
                  </FItem>
                }
              />
            </>
          ) : (
            <FButton
              className="f-mr-1"
              title={"Connect Wallet"}
              onClick={connectWallet}
            ></FButton>
          )}
          {/* <FHeaderCollapse>
            <FHeaderMenuItem to="/status-page" title="Status Page" />
          </FHeaderCollapse> */}
        </FItem>
      </FHeader>
      {showAddressSelectorDlg && (
        <AddressSelector
          show={showAddressSelectorDlg}
          onHide={() => setShowAddressSelectorDlg(false)}
          connectedAccounts={connectedAccounts}
          onAccountSelect={(account: any) => {
           // onAccountSelect(account);
          }}
        />
      )}
    </div>
  );
};
export default Header;
