import { FTypo, FGrid, FTable, FHeader, FButton } from "ferrum-design-system";
import { useEffect, useState } from "react";
import Datatable from "react-bs-datatable";
import { useDispatch, useSelector } from "react-redux";
import { crucibleApi } from "../client";
import { fetchWithdrawals } from "../redux/casper/casperActions";
import { Networks } from "../utils/stringUtils";
import { CasperWithdrawal } from "../pages/CasperWithdrawal";

import './layout.scss';
import { Web3Helper } from "../utils/web3Helper";
import { MetaMaskConnector } from "./connector";
import { ConnectWalletDialog } from "../utils/connect-wallet/ConnectWalletDialog";
import { CasperServiceByJsonRPC, CLPublicKey, CLValue, 
    CLValueBuilder, 
    decodeBase16, 
    DeployUtil,
    RuntimeArgs,
    Signer,
    CasperClient
  } from "casper-js-sdk";
  import toast from "react-hot-toast";
import { useHistory } from "react-router";
import ConfirmationDialog from "../dialogs/ConfirmationDialog";
import TxProcessingDialog from "../dialogs/TxProcessingDialog";


const RPC_API = "http://44.208.234.65:7777/rpc";

const casperService = new CasperServiceByJsonRPC(RPC_API);
const casperClient = new CasperClient(RPC_API);

export const Withdrawals = () => {
    const { connect: { config, selectedAccount, isWalletConnected, withdrawalItems } } = useSelector((state: any) => state.casper);
    const { walletAddress, isConnected, networkClient } = useSelector((state: any) => state.casper.walletConnector);
    const [loading, setLoading] = useState(false);
    const [processMsg, setProcessMsg] = useState('');
    const [showConfirmation, setShowConfirmation] = useState(false);
    const navigate = useHistory();

    const dispatch = useDispatch();

    async function withdrawEvm(id: string):Promise<any>{
        const Api = new crucibleApi()
        await Api.signInToServer(walletAddress)
            const res = await Api.gatewayApi({
                command: 'swapGetTransaction', data: {
                  id,
                  amount: 1,
                  targetCurrency: `CSPR:222974816f70ca96fc4002a696bb552e2959d3463158cd82a7bfc8a94c03473`,
                  currency: 'BSC_TESTNET:0xfe00ee6f00dd7ed533157f6250656b4e007e7179'
              },
                params: [] });
        if (res.data.requests) {
          const helper = new Web3Helper(networkClient)
          const tx = await helper.sendTransactionAsync(
            dispatch,
            res.data.requests
          )
          if(tx) {
            setShowConfirmation(true)
          }
          console.log(tx);
        }
        console.log(res)
    }    

    const fetchEvmWithdrawalItems = async () => {
        const Api = new crucibleApi()
        await Api.signInToServer(`CSPR:${selectedAccount?.address}`)
        const userWithdrawals = await Api.gatewayApi({
            command: 'getUserNonEvmWithdrawItems', data: {
            userAddress: `${selectedAccount?.address}`,
            network: 'BSC_TESTNET',
            receiveAddress: walletAddress,
        }, params: [] });
        if (userWithdrawals.data){
            console.log(userWithdrawals.data,'userWithdrawals.data')
            await fetchWithdrawals(userWithdrawals.data.withdrawableBalanceItems)(dispatch);
        }
        console.log(userWithdrawals, 'userWithdrawals');
    }

    const performCasperWithdraw = async (amount: string) => {
        if (
          isWalletConnected &&
          selectedAccount
        ) {
          setLoading(true)
          try {
            // console.log(selectedAccount?.address, Number(amount));
            const publicKeyHex = selectedAccount?.address;
            const senderPublicKey = CLPublicKey.fromHex(publicKeyHex);

            const deployParams = new DeployUtil.DeployParams(
            senderPublicKey,
            'casper-test'
            );

            const args = RuntimeArgs.fromMap({
                "amount": CLValueBuilder.u256(Number(amount).toFixed()),
                "token_address": CLValueBuilder.string('contract-package-wasme222974816f70ca96fc4002a696bb552e2959d3463158cd82a7bfc8a94c03473'),
            });
    
            const session = DeployUtil.ExecutableDeployItem.newStoredContractByHash(
            decodeBase16('e84a7d24458b7c517b531373a66c8f4f34673dfed785e612a71051533d601aa3'),
            'withdraw',
            args
            );

            const payment = DeployUtil.standardPayment(5000000000);

            const deploy = DeployUtil.makeDeploy(deployParams, session, payment);

            const deployJson: any = DeployUtil.deployToJson(deploy);
        
            Signer.sign(deployJson, publicKeyHex).then(async (signedDeployJson) => {
                const signedDeploy = DeployUtil.deployFromJson(signedDeployJson);
                console.log(signedDeploy)
                if (signedDeploy.ok) {
                    const res = await casperClient.putDeploy(signedDeploy.val);
                    console.log(res, 'resres');
                    if (res) {
                    
                    }
                    setProcessMsg(res)
                    setLoading(false)
                    setShowConfirmation(true)
                }
            });
              // navigate.push(`/${config._id}`);
            //toast.success(`${amount} tokens are staked successfully`);
            
            } catch (e) {
                console.log("ERROR : ", e);
                toast.error("An error occured please see console for details");
                navigate.push(`/${config._id}`);
            } finally {
            //setLoading(false)
            }

        } else {
            console.log("heelelll")
            navigate.push(`/${config._id}`);
        }
    };
        

    console.log(withdrawalItems, 'userWithdrawals');

    useEffect(() => {
       fetchEvmWithdrawalItems()
    }, [selectedAccount, walletAddress]);

    const tableHeads: any[] = [
        { width: 200, prop: "sourceNetwork", title: "Source Network" },
        { prop: "targetNetwork", title: "Target Network" },
        { prop: "amount", title: "Amount" },
        { prop: "action", title: "Action" }
    ];

    console.log(withdrawalItems)

    const body = (withdrawalItems || []).map((item: any) => { 
        return {
          amount: <FTypo className={"col-amount"}>{item.sendAmount}</FTypo>,
          sourceNetwork: <FTypo className={"col-amount"}>{
            //@ts-ignore
            Networks[item.sendNetwork] || item.sendNetwork
        }</FTypo>,
          targetNetwork: <FTypo className={"col-amount"}>{
            //@ts-ignore
            Networks[item.receiveNetwork] || item.receiveCurrency.split(":")[0]
        }</FTypo>,
          action: (
            <div className="col-action">
            {
                isConnected
                ? (<FButton title={"Withdraw"} onClick={() => 
                    item.receiveCurrency.split(":")[0] === 'CSPR' ? performCasperWithdraw(item.sendAmount) : withdrawEvm(item.id)
                } />)
                : (
                    <MetaMaskConnector.WalletConnector
                      WalletConnectView={FButton}
                      WalletConnectModal={ConnectWalletDialog}
                      isAuthenticationNeeded={false}
                      WalletConnectViewProps={{ className: "w-100" }}
                    />
                )
            }
            </div>
          ),
        }; 
    }); 

    return (
        <>
            <FGrid alignX={"center"} className="f-mb-1 withdrawals_container">
                <FTypo size={18} align={"center"} className={"f-mb-14 f-mt--7"}>
                    TOKEN WITHDRAWALS
                </FTypo>
                <FTable>
                    <Datatable tableBody={body || []} tableHeaders={tableHeads} rowsPerPage={10} />
                </FTable>
            </FGrid>
            <ConfirmationDialog onHide={() =>setShowConfirmation(false)} transaction={processMsg} message={'Transaction sent to network and is processing.'} show={showConfirmation} isSwap={true} />
            <TxProcessingDialog onHide={() =>setLoading(false)} message={ processMsg || "Transaction Processing...."} show={loading}/>
        </>
    )
}