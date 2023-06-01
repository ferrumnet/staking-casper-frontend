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
import { Withdrawals } from "../components/Withdrawals";

const RPC_API = "https://rpc.testnet.casperlabs.io/rpc";

const casperService = new CasperServiceByJsonRPC(RPC_API);
const casperClient = new CasperClient(RPC_API);

export const CasperWithdrawal = () => {
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

  // const [stakingCap, setStakingCap] = useState<any>(undefined);
  const [stakeSoFar, setStakeSoFar] = useState<any>(undefined);
  const [youStakedBalance, setYourStakedBalance] = useState<any>(undefined);
  const { isConnected, isConnecting, currentWalletNetwork, walletAddress, networkClient } =
    useSelector((state: any) => state.casper.walletConnector);

  const stakingInfo = getStakingInfo(
    config?.stakingEnds,
    config?.stakingStarts,
    config?.withdrawStarts,
    config?.withdrawEnds
  );

  async function AccountInformation() {
    //@ts-ignore
    const casperWalletProvider = await window.CasperWalletProvider;    
    const provider = casperWalletProvider();
    const isConnected = await provider.isConnected();

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
  {/* casper-client put-deploy \
    --chain-name casper-test \
    --node-address http://44.208.234.65:7777 \
    --secret-key keys/secret_key.pem \
    --session-hash hash-c312f4eda82c253e2817f41586ce0af99294d652507c2c7827bb6abbdc0f6e0f \
    --session-entry-point withdraw_signed \
    --payment-amount 5000000000 \
    --session-arg "token_address:string='contract-package-wasme222974816f70ca96fc4002a696bb552e2959d3463158cd82a7bfc8a94c03473'" \
    --session-arg "payee:string='0203d3a2770de0d4fe892c74e4e33f98580bb6136b1ab35f1244b0cf0758b3d1d3b3'" \
    --session-arg "amount:u256='1'" \
    --session-arg "signature:string='7369676e6174757265'" \
    --session-arg "salt:string='0000000000000000000000000000000000000000000000000000000000000001'"  */}

  const performWithdraw = async () => {
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
            "payee": CLValueBuilder.string('0203d3a2770de0d4fe892c74e4e33f98580bb6136b1ab35f1244b0cf0758b3d1d3b3'),
            "signature": CLValueBuilder.string('7369676e6174757265'),
            "salt": CLValueBuilder.string('0000000000000000000000000000000000000000000000000000000000000001'),
          });

          const session = DeployUtil.ExecutableDeployItem.newStoredContractByHash(
            decodeBase16('c312f4eda82c253e2817f41586ce0af99294d652507c2c7827bb6abbdc0f6e0f'),
            'withdraw_signed',
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
        <FGrid alignX={"center"} className="f-mb-1">
          <FTypo size={18} align={"center"} className={"f-mb-14 f-mt--7"}>
           CASPER TOKEN WITHDRAWAL
          </FTypo>
          <FGridItem alignX={"center"} size={[8, 8, 12]} className="f-m-auto f-mb-1">
            <FItem align={"center"}>    
              <FInputText
                className={"f-mt-2"}
                label={"AMOUNT TO WITHDRAW"}
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
              <FInputText
                className={"f-mt-2"}
                label={"Token Address"}
                disabled
                value={'contract-package-wasme222974816f70ca96fc4002a696bb552e2959d3463158cd82a7bfc8a94c03473'}
                onChange={(e: any) => {}}
              />
              <FInputText
                className={"f-mt-2"}
                label={"Payee"}
                disabled
                value={'0203d3a2770de0d4fe892c74e4e33f98580bb6136b1ab35f1244b0cf0758b3d1d3b3'}
                onChange={(e: any) => {}}
              />
              {/* <FInputText
                className={"f-mt-2"}
                label={"signature"}
                disabled
                value={'7369676e6174757265'}
                onChange={(e: any) => {}}
              />
              <FInputText
                className={"f-mt-2"}
                label={"salt"}
                disabled
                value={'0000000000000000000000000000000000000000000000000000000000000001'}
                onChange={(e: any) => {}}
              /> */}
              {
                connection.isWalletConnected && (
                  <FButton 
                    title={"WITHDRAW"}
                    className="w-100 f-mt-2"
                    onClick={() => performWithdraw()}
                  />
                )
              }
              {
                !connection.isWalletConnected && (
                  <FButton title={"Connect Casper Signer"} className="w-100 f-mt-2" onClick={() => connectWallet()} />
                )
              }
            </FItem>
          </FGridItem>
        </FGrid>
        <ConfirmationDialog onHide={() =>setShowConfirmation(false)} transaction={processMsg} message={'Transaction sent to network and is processing.'} show={showConfirmation} />
        <TxProcessingDialog onHide={() =>setLoading(false)} message={ processMsg || "Transaction Processing...."} show={loading}/>
      </FCard>
    </>
  );
};

export default CasperWithdrawal
