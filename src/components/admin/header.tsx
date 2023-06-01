import React, { useEffect, useState } from "react";
import {
  FHeader,
  // FHeaderCollapse,
  FButton,
  FItem,
  FTruncateText,
  // FHeaderMenuItem,
} from "ferrum-design-system";
import { useSelector, useDispatch } from "react-redux";
import { ReactComponent as IconNetwork } from "../../assets/images/casper.svg";

import logo from "../../assets/images/logo-light.svg";
import { CgArrowsExchangeAlt } from "react-icons/cg";
import { CasperClient, CasperServiceByJsonRPC, CLPublicKey } from "casper-js-sdk";
import { 
  connectWallet as connectWalletDispatch,
  resetWallet,
  configLoaded,
  signed
} from '../../redux/casper/casperActions';
import toast from "react-hot-toast";
import AddressSelector from "../../dialogs/AddressSelector";
import { useParams } from "react-router";
import TxProcessingDialog from "../../dialogs/TxProcessingDialog";

const RPC_API = "https://rpc.testnet.casperlabs.io/rpc";
const STATUS_API = "http://159.65.203.12:8888";

const casperService = new CasperServiceByJsonRPC(RPC_API);
const casperClient = new CasperClient(RPC_API);

export const Header = () => {
  const dispatch = useDispatch();

  const connection = useSelector((state: any) => state.casper.connect)
  const [loading, setLoading] = useState(false);

  console.log(connection)

  const [showAddressSelectorDlg, setShowAddressSelectorDlg] =  useState<boolean>(false);

  const selectedAccount: { address?: string } = {};

  const connectWallet = async () => {
    //@ts-ignore
    const casperWalletProvider = await window.CasperWalletProvider;    
    const provider = casperWalletProvider();
    await provider.requestConnection()

    const isConnected = await provider.isConnected();

    if (isConnected) {
      setLoading(true)
      await AccountInformation();
      setLoading(false)
    }
 
    return;
  };

  const disconnectWallet = async () => {
    //@ts-ignore
    const casperWalletProvider = await window.CasperWalletProvider;    
    const provider = casperWalletProvider();
    provider.disconnectFromSite();
    await resetWallet()(dispatch)
  };

  async function AccountInformation() {
    //@ts-ignore
    const casperWalletProvider = await window.CasperWalletProvider;    
    const provider = casperWalletProvider();
    await provider.requestConnection()

    const isConnected = await provider.isConnected();


    if (isConnected) {
      try {
        //@ts-ignore
        const casperWalletProvider = await window.CasperWalletProvider;    
        const provider = casperWalletProvider();
        await provider.requestConnection()

        const publicKey = await provider.getActivePublicKey();
        console.log(publicKey, 'stakingIdstakingId');
        //textAddress.textContent += publicKey;

        const latestBlock = await casperService.getLatestBlockInfo();
        console.log(latestBlock);

        const root = await casperService.getStateRootHash(latestBlock?.block?.hash);
        console.log(latestBlock, root)

        await connectWalletDispatch([ { "address": publicKey } ])(dispatch)

        const balanceUref = await casperService.getAccountBalanceUrefByPublicKey(root, CLPublicKey.fromHex(publicKey));
        
        // @ts-ignore
        const balance = await casperService.getAccountBalance(latestBlock?.block?.header?.state_root_hash, balanceUref);
        console.log(balance.toString())
        
      } catch (error) {
        
        //toast.error(`An error occured Error: ${error}`);
        console.log(error, 'Error occured')
      }
    }
  }

  return (
    <div>
      <FHeader titleText={"Staking Admin Portal"} showLogo={true} headerLogo={logo} className="bg-none">
        <FItem display={"flex"} align="right" alignY={"center"}>
          {connection?.isWalletConnected ? (
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
                onClick={disconnectWallet}
                btnInfo={
                  <FItem display={"flex"}>
                    <IconNetwork width={20} />{" "}
                    <FTruncateText
                      className="f-ml-1"
                      text={connection?.selectedAccount?.address || ''}
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
      <TxProcessingDialog showClose={false} message={"Loading Configuration"} show={loading}/>
      {showAddressSelectorDlg && (
        <AddressSelector
          show={showAddressSelectorDlg}
          onHide={() => setShowAddressSelectorDlg(false)}
          connectedAccounts={connection?.connectedAccounts || []}
          onAccountSelect={(account: any) => {
           // onAccountSelect(account);
          }}
        />
      )}
    </div>
  );
};

export default Header;


// titleText={"Staking Admin Portal"}