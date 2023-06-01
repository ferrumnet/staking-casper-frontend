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
import { ReactComponent as IconNetwork } from "../assets/images/casper.svg";

import logo from "../assets/images/logo-light.svg";
import { CgArrowsExchangeAlt } from "react-icons/cg";
import { CasperClient, CasperServiceByJsonRPC, CLPublicKey, Contracts, DeployUtil } from "casper-js-sdk";
import { 
  connectWallet as connectWalletDispatch,
  resetWallet,
  configLoaded,
  signed
} from '../redux/casper/casperActions';
import toast from "react-hot-toast";
import AddressSelector from "../dialogs/AddressSelector";
import { useParams } from "react-router";
import TxProcessingDialog from "../dialogs/TxProcessingDialog";
//@ts-ignore
import { convertHashStrToHashBuff, getTokenHash, setContractHash } from "../utils/stringParser";

const RPC_API = "https://rpc.testnet.casperlabs.io/rpc";
const STATUS_API = "http://159.65.203.12:8888";

const casperService = new CasperServiceByJsonRPC(RPC_API);
const casperClient = new CasperClient(RPC_API);

const contract = new Contracts.Contract(casperClient);

const Header = () => {
  const dispatch = useDispatch();
  const { stakingId }: any = useParams();
  console.log(stakingId);
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
    const isConnected = await provider.isConnected();

    if (isConnected) {
      try {
        const publicKey = await provider.getActivePublicKey();
        console.log(publicKey, stakingId, 'stakingIdstakingId');
        //textAddress.textContent += publicKey;

        const latestBlock = await casperService.getLatestBlockInfo();
        const root = await casperService.getStateRootHash(latestBlock?.block?.hash);

        await connectWalletDispatch([ { "address": publicKey } ])(dispatch)

        const balanceUref = await casperService.getAccountBalanceUrefByPublicKey(root, CLPublicKey.fromHex(publicKey));
        
        // @ts-ignore
        const balance = await casperService.getAccountBalance(latestBlock?.block?.header?.state_root_hash, balanceUref);

        // const args = RuntimeArgs.fromMap({});
        // await contract.setContractHash('hash-56c7117eaea62cb89e94479f45a12c4e8bd9cfc0f427dd0ff3e221a546deff63')
        // const payment = DeployUtil.standardPayment(50000000000);
        // const qu = await contract.queryContractDictionary('staking_ends', 'uref-2bfbe059dc2e7dab956c82404e2dc5a8ea6d6ce3cc15287aaaad7727a3a109ad-007')
        // console.log(qu);
        // @ts-ignore
        // const balances = await casperService.getBlockState(
        //   //@ts-ignore
        //   latestBlock?.block?.header?.state_root_hash,
        //   "hash-e222974816f70ca96fc4002a696bb552e2959d3463158cd82a7bfc8a94c03473",
        //   ["contract_hash"]
        // );
        // console.log(balances.toString())

        
        const info = await casperService.getDeployInfo(
          stakingId
        )

        // @ts-ignore
        const infoArguments = (info.deploy.session.ModuleBytes.args || []).find(
          (e: any) => e[0] === 'erc20_contract_package_hash'
        )

        if (infoArguments) {
          const token_contract = infoArguments[1].parsed.Hash.split('-')[1]
          const token = getTokenHash(token_contract);
          const tokenName = await casperService.getBlockState(
            //@ts-ignore
            latestBlock?.block?.header?.state_root_hash,
            `hash-${token}`,
            ['name']
          )
  
          const tokenSymbol = await casperService.getBlockState(
             //@ts-ignore
             latestBlock?.block?.header?.state_root_hash,
             `hash-${token}`,
             ['symbol']
          )
  
          console.log( 'info2info2', info)

          if(info.deploy.session) {
            //@ts-ignore
            const transforms = info.execution_results[0].result.Success?.effect.transforms;
            const contract_package_hash = transforms.find((e: any) => e.transform.AddKeys && e.transform.AddKeys[0].name === 'contract_package_hash')
            const stacking_contract_package_hash =  transforms.find((e: any) => e.transform.AddKeys && e.transform.AddKeys[0].name === 'staking_contract_hash');

            configLoaded({
              // @ts-ignore
              config: info.deploy.session.ModuleBytes.args,
              tokenInfo: {
                tokenSymbol: tokenSymbol.CLValue?.data,
                tokenName: tokenName.CLValue?.data,
                stacking_contract_package_hash: stacking_contract_package_hash && stacking_contract_package_hash?.transform.AddKeys[0].key.split('hash-')[1],
                contract_package_hash: contract_package_hash && contract_package_hash?.transform.AddKeys[0].key.split('hash-')[1],
                // @ts-ignore
              }
            })(dispatch);
            //@ts-ignore
            signed(info.deploy.approvals)(dispatch)
            //@ts-ignore
            console.log(info.deploy, 'infoooo');
          }
        }
        
      } catch (error) {
        toast.error(`An error occured Error: ${error}`);
        console.log(error, 'Error occured')
      }
    }
  }

  return (
    <div>
      <FHeader showLogo={true} headerLogo={logo} className="bg-none">
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

