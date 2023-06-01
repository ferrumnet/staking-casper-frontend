import { useState } from "react";
import { FButton, FCard, FGrid, FGridItem, FInputText, FItem, FTypo } from "ferrum-design-system";
import { useDispatch, useSelector } from "react-redux";
import { getStakingInfo } from "../utils/DateUtil";
import { connectWallet, connectWallet as connectWalletDispatch } from '../redux/casper/casperActions';
import { useHistory, useParams } from "react-router";
import './layout.scss';
import { CasperServiceByJsonRPC, CLPublicKey, CLValue, 
  CLValueBuilder, 
  decodeBase16, 
  DeployUtil,
  RuntimeArgs,
  Signer,
  CasperClient
} from "casper-js-sdk";
import toast from "react-hot-toast";
import TxProcessingDialog from "../dialogs/TxProcessingDialog";
import ConfirmationDialog from "../dialogs/ConfirmationDialog";
import { MetaMaskConnector } from "../components/connector";
import { ConnectWalletDialog } from "../utils/connect-wallet/ConnectWalletDialog";
import { crucibleApi } from "../client";
import { Web3Helper } from "../utils/web3Helper";

const RPC_API = "https://rpc.testnet.casperlabs.io/rpc";

const casperService = new CasperServiceByJsonRPC(RPC_API);
const casperClient = new CasperClient(RPC_API);

export const CasperSwap = () => {
  const navigate = useHistory();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState();
  const [targetNetwork, setTargetNetwork] = useState('56');
  const [targetToken, setTargetToken] = useState('BASE_FRM');
  const [processMsg, setProcessMsg] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const connection = useSelector((state: any) => state.casper.connect)
  const { connect: { config, selectedAccount, isWalletConnected, signedAddresses, } } = useSelector((state: any) => state.casper);


  const { isConnected, isConnecting, currentWalletNetwork, walletAddress, networkClient } =
    useSelector((state: any) => state.casper.walletConnector);

  

  async function swapEvm():Promise<any>{
    const Api = new crucibleApi()
    await Api.signInToServer(walletAddress)
		const res = await Api.gatewayApi({
            command: 'swapGetTransaction', data: {
              amount: amount,
              targetCurrency: `CSPR:222974816f70ca96fc4002a696bb552e2959d3463158cd82a7bfc8a94c03473`,
              currency: 'BSC_TESTNET:0xfe00ee6f00dd7ed533157f6250656b4e007e7179'
          },
			params: [] });
    
    if (res.data.requests) {
      console.log(res.data.requests, 'res.data.requests')
      const helper = new Web3Helper(networkClient)
      const tx = await helper.sendTransactionAsync(
        dispatch,
        res.data.requests
      )
      if (tx) {

        const res = await Api.gatewayApi({
          command: 'logEvmAndNonEvmTransaction', data: {
            "id": tx.split("|")[0],
            "sendNetwork": "BSC_TESTNET",
            "sendAddress": "0x0Bdb79846e8331A19A65430363f240Ec8aCC2A52",
            "receiveAddress": `${selectedAccount?.address}`,
            "sendCurrency": "BSC_TESTNET:0xfe00ee6f00dd7ed533157f6250656b4e007e7179",
            "sendAmount": amount,
            "receiveCurrency": `CSPR:222974816f70ca96fc4002a696bb552e2959d3463158cd82a7bfc8a94c03473`,
        },
        params: [] });
        console.log(res);
        setShowConfirmation(true)
      }
      console.log(tx);
    }
    console.log(res)
	}


  async function AccountInformation() {
    //@ts-ignore
    const casperWalletProvider = await window.CasperWalletProvider;    
    const provider = casperWalletProvider();
    const isConnected = await provider.isConnected();
    console.log(isConnected, connection, 'isConnectedisConnected')
    if (isConnected) {
        const publicKey = await provider.getActivePublicKey();
        console.log(publicKey);
        //textAddress.textContent += publicKey;

        const latestBlock = await casperService.getLatestBlockInfo();
        console.log(latestBlock);

        const root = await casperService.getStateRootHash(latestBlock?.block?.hash);
        console.log(latestBlock, root)

        await connectWalletDispatch([{
          "address": publicKey
        }])(dispatch)
        const balanceUref = await casperService.getAccountBalanceUrefByPublicKey(root, CLPublicKey.fromHex(publicKey));
        console.log(balanceUref)
        
        // @ts-ignore
        const balance = await casperService.getAccountBalance(latestBlock?.block?.header?.state_root_hash, balanceUref);
        console.log(balance.toString())
        //textBalance.textContent = `PublicKeyHex ${balance.toString()}`;
    }
  }


  const connectWallet = async () => {
    //@ts-ignore
    const casperWalletProvider = await window.CasperWalletProvider;    
    const provider = casperWalletProvider();

    const isConnected = await provider.isConnected();

    if (isConnected) {
      await AccountInformation();
    }   
  };
  // console.log(stakingCap, stakeSoFar, youStakedBalance);

  const performSwap = async () => {
    if (
      isWalletConnected &&
      selectedAccount
    ) {
      setLoading(true)
      try {
        // console.log(selectedAccount?.address, Number(amount));
        if (amount && Number(amount) > 0) {
          const publicKeyHex = selectedAccount?.address;
          const senderPublicKey = CLPublicKey.fromHex(publicKeyHex);

          const deployParams = new DeployUtil.DeployParams(
            senderPublicKey,
            'casper-test'
          );

          const args = RuntimeArgs.fromMap({
            "amount": CLValueBuilder.u256(amount),
            "token_address": CLValueBuilder.string('contract-package-wasme222974816f70ca96fc4002a696bb552e2959d3463158cd82a7bfc8a94c03473'),
            "target_network": CLValueBuilder.u256(targetNetwork),
            "target_token": CLValueBuilder.string(targetToken),
          });

          const session = DeployUtil.ExecutableDeployItem.newStoredContractByHash(
            decodeBase16('0a5a024fbc0c796ec6165de203e1e123fe0c207f943ebe1c542d77d333ff4510'),
            'swap',
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
              // if (res) {
              //   const Api = new crucibleApi();
              //   await Api.signInToServer(walletAddress);
              //   const result = await Api.gatewayApi({
              //     command: 'processFromEvmSwapTransaction', data: {
              //       "id": `0x${res}`,
              //       "txType": "swap",
              //       "sendNetwork": "BSC_TESTNET",
              //       "used": "",
              //       "sendAddress": "0x0Bdb79846e8331A19A65430363f240Ec8aCC2A52",
              //       "receiveAddress": `${selectedAccount?.address}`,
              //       "sendCurrency": "BSC_TESTNET:0xfe00ee6f00dd7ed533157f6250656b4e007e7179",
              //       "sendAmount": amount,
              //       "receiveCurrency": `CSPR:222974816f70ca96fc4002a696bb552e2959d3463158cd82a7bfc8a94c03473`,
              //   }})
              //   console.log(result);
              // }
              setProcessMsg(res)
              setLoading(false)
              setShowConfirmation(true)
            }
            
          });
          // navigate.push(`/${config._id}`);
          //toast.success(`${amount} tokens are staked successfully`);
        } else {
          toast.error("Amount must be greater than 0");
        }
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

  return (
    <>
         <FCard className={"card-staking f-mb-2"}>
        <FGrid>
          <FTypo size={18} align={"center"} className={"f-mb--5 f-mt--7"}>
            SWAP FROM BSC TO CASPER
          </FTypo>
          <FGridItem alignX={"center"} size={[8, 8, 12]} className="f-m-auto f-mb-1">
            <FItem align={"center"}>
              <FInputText
                className={"f-mt-2"}
                label={"AMOUNT TO SWAP"}
                placeholder={"0"}
                value={amount}
                onChange={(e: any) => {
                  e.preventDefault();
                  const re = /^-?\d*\.?\d*$/;
                  if (e.target.value === "" || re.test(e.target.value)) {
                    setAmount(e.target.value);
                  }
                }}
                postfix={
                  <FTypo className={"f-pr-1"} color="#dab46e">
                    TOKEN
                  </FTypo>
                }
              />
              <FInputText
                className={"f-mt-2"}
                label={"Target Network"}
                disabled
                value={'CASPER'}
                onChange={(e: any) => {}}
              />
              <FInputText
                className={"f-mt-2"}
                label={"BASE_FRM"}
                disabled
                value={targetToken}
                onChange={(e: any) => {}}
              />
              {
                isConnected ?
                 (
                   <FButton 
                     title={"SWAP"}
                     className="w-100 f-mt-2"
                     onClick={() => swapEvm()}
                   />
                 )
                : (
                  <div className="w-100 f-mt-2">
                    <MetaMaskConnector.WalletConnector
                      WalletConnectView={FButton}
                      WalletConnectModal={ConnectWalletDialog}
                      isAuthenticationNeeded={false}
                      WalletConnectViewProps={{ className: "w-100" }}
                    />
                  </div>
                )
              }
            </FItem>
          </FGridItem>
         
        </FGrid>
        <ConfirmationDialog amount={amount} onHide={() =>setShowConfirmation(false)} transaction={processMsg} message={'Transaction sent to network and is processing.'} show={showConfirmation} isSwap={true} />
        <TxProcessingDialog onHide={() =>setLoading(false)} message={ processMsg || "Transaction Processing...."} show={loading}/>
      </FCard>
      <FCard className={"card-staking f-mb-2"}>
        <FGrid alignX={"center"} className="f-mb-1">
          <FTypo size={18} align={"center"} className={"f-mb-14 f-mt--7"}>
            SWAP FROM CASPER TO BSC
          </FTypo>
          <FGridItem alignX={"center"} size={[8, 8, 12]} className="f-m-auto f-mb-1">
            <FItem align={"center"}>    
              <FInputText
                className={"f-mt-2"}
                label={"AMOUNT TO SWAP "}
                placeholder={"0"}
                value={amount}
                onChange={(e: any) => {
                  e.preventDefault();
                  const re = /^-?\d*\.?\d*$/;
                  if (e.target.value === "" || re.test(e.target.value)) {
                    setAmount(e.target.value);
                  }
                }}
                postfix={
                  <FTypo className={"f-pr-1"} color="#dab46e">
                    TOKEN
                  </FTypo>
                }
              />
              <FInputText
                className={"f-mt-2"}
                label={"Target Network"}
                disabled
                value={targetNetwork}
                onChange={(e: any) => {}}
              />
              <FInputText
                className={"f-mt-2"}
                label={"Target Token"}
                disabled
                value={targetToken}
                onChange={(e: any) => {}}
              />
              {
                connection.isWalletConnected && (
                  <FButton 
                    title={"SWAP"}
                    className="w-100 f-mt-2"
                    onClick={() => performSwap()}
                  />
                )
              }
              {
                !connection.isWalletConnected && (
                  <FButton title={"Connect Casper Signer"} className="w-100 f-mt-2" onClick={() => connectWallet()} />
                )
              }
              {
                //     <FButton
                //       title={stakingInfo.isStakingOpen ? "Stake" : stakingInfo.isEarlyWithdraw ? "Early Withdraw" : stakingInfo.isWithdrawOpen ? "Maturity Withdraw" : "Refresh"}
                //       className="w-100 f-mt-2"
                //       onClick={() => {
                //         // console.log("staking");
                //         // dispatch(algorandActions.shouldStake());
                //         if (getStakingInfo(connection?.config?.stakingEnds, connection?.config?.stakingStarts, connection?.config?.withdrawStarts, connection?.config?.withdrawEnds).isStakingOpen) {
                //           // navigate.push(`/${stakingId}/submit-stake`);
                //         } else if (
                //           getStakingInfo(connection?.config?.stakingEnds, connection?.config?.stakingStarts, connection?.config?.withdrawStarts, connection?.config?.withdrawEnds).isEarlyWithdraw ||
                //           getStakingInfo(connection?.config?.stakingEnds, connection?.config?.stakingStarts, connection?.config?.withdrawStarts, connection?.config?.withdrawEnds).isWithdrawOpen
                //         ) {
                //           // console.log(stakingId, 'withdrawwww')
                //           // navigate.push(`/${stakingId}/submit-withdraw`);
                //         } else {
                //           window.location.reload();
                //         }
                //       }}
                //     />
                //   )
                // 
              }
            </FItem>
          </FGridItem>
        </FGrid>
      </FCard>
   
    </>
  );
};

export default CasperSwap
