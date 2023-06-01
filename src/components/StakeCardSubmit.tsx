import React, { useEffect, useState } from "react";
import {
  FButton,
  FCard,
  FInputText,
  FItem,
  // FResponseBar,
  FTypo,
} from "ferrum-design-system";
import { ReactComponent as BrandIcon } from "../assets/images/brand-icon.svg";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router";
import toast from "react-hot-toast";
import { CLPublicKey, CasperClient, CasperServiceByJsonRPC, CLValueBuilder, decodeBase16, DeployUtil, RuntimeArgs } from "casper-js-sdk";
import TxProcessingDialog from "../dialogs/TxProcessingDialog";
import ConfirmationDialog from "../dialogs/ConfirmationDialog";
import { getTokenHash, setContractHash } from "../utils/stringParser";

// interface CardSubmitStakeProps {
//   walletConnected?: boolean;
// }

const RPC_API = "https://rpc.testnet.casperlabs.io/rpc";

const casperService = new CasperServiceByJsonRPC(RPC_API);
const casperClient = new CasperClient(RPC_API);

const StakeCardSubmit = () => {
  const { stakingId }: any = useParams();
  const navigate = useHistory();
  const dispatch = useDispatch();
  const [amount, setAmount] = useState();
  const [processMsg, setProcessMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const { connect: { config, selectedAccount, isWalletConnected, signedAddresses, tokenInfo } } = useSelector((state: any) => state.casper);

 
  const isAddressSigned = () => {
    if (signedAddresses[`${stakingId}`]?.length) {
      const result = signedAddresses[`${stakingId}`]?.find((address: any) => address === selectedAccount.address);
      if (result) {
        return true;
      }
    }
    return false;
  };

  const performStake = async () => {
    if (
      isWalletConnected &&
      selectedAccount
    ) {
      setLoading(true)
      try {
        //@ts-ignore
        const casperWalletProvider = await window.CasperWalletProvider;    
        const provider = casperWalletProvider();

        if (amount && Number(amount) > 0) {
          const publicKeyHex = selectedAccount?.address;
          const senderPublicKey = CLPublicKey.fromHex(publicKeyHex);

          const deployParams = new DeployUtil.DeployParams(
            senderPublicKey,
            'casper-test'
          );

          const args = RuntimeArgs.fromMap({
            "amount": CLValueBuilder.u256(amount),
            'staking_contract_package_hash': CLValueBuilder.string(`contract-package-wasm${tokenInfo.contract_package_hash}`)
          });

          const session = DeployUtil.ExecutableDeployItem.newStoredContractByHash(
            decodeBase16(tokenInfo.stacking_contract_package_hash),
            'stake',
            args
          );

          const payment = DeployUtil.standardPayment(50000000000);

          const deploy = DeployUtil.makeDeploy(deployParams, session, payment);

          const deployJson: any = DeployUtil.deployToJson(deploy);
        
          provider.sign(JSON.stringify(deployJson), publicKeyHex).then(async (signedDeployJson: any) => {
            console.log(signedDeployJson);
            const signedDeploy = DeployUtil.setSignature(
              deploy,
              signedDeployJson.signature,
              CLPublicKey.fromHex(publicKeyHex)
            );
            // @ts-ignore
            if (!signedDeploy.cancelled) {
              // @ts-ignore
              const res = await casperClient.putDeploy(signedDeploy);
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

  const performApprove = async () => {
    if (
      isWalletConnected &&
      selectedAccount
    ) {
      setLoading(true)
      try {
        //@ts-ignore
        const casperWalletProvider = await window.CasperWalletProvider;    
        const provider = casperWalletProvider();

          const publicKeyHex = selectedAccount?.address;
          const senderPublicKey = CLPublicKey.fromHex(publicKeyHex);

          const deployParams = new DeployUtil.DeployParams(
            senderPublicKey,
            'casper-test'
          );

          const args = RuntimeArgs.fromMap({
            "amount": CLValueBuilder.u256(`1000000000000`),
            'spender': setContractHash(`hash-${tokenInfo.contract_package_hash}`)
          });

          const getToken = config.address;
          const token = getTokenHash(getToken);
          const session = DeployUtil.ExecutableDeployItem.newStoredContractByHash(
            decodeBase16(`${token}`),
            'approve',
            args
          );

          const payment = DeployUtil.standardPayment(1000000000);

          const deploy = DeployUtil.makeDeploy(deployParams, session, payment);

          const deployJson: any = DeployUtil.deployToJson(deploy);
        
          provider.sign(JSON.stringify(deployJson), publicKeyHex).then(async (signedDeployJson: any) => {
            console.log(signedDeployJson);
            const signedDeploy = DeployUtil.setSignature(
              deploy,
              signedDeployJson.signature,
              CLPublicKey.fromHex(publicKeyHex)
            );

            // @ts-ignore
            if (!signedDeploy.cancelled) {
              // @ts-ignore
              const res = await casperClient.putDeploy(signedDeploy);
              console.log(res, 'resres');
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


  return (
    <React.Fragment>
      <FCard className={"card-submit-stake f-mb-2"}>
        <FItem display={"flex"} className="f-mb-2">
          <FItem bgColor="#1F2128" size={70} className="f-p--8 f-mr-1" display={"flex"} alignX="center" alignY={"center"}>
            <BrandIcon />
          </FItem>
          <FItem className={"f-ml-1"}>
            <FTypo size={24} color="white" className={"f-mt--4"}>
              Title Pool
            </FTypo>
            <FTypo size={12} color="white">
              POOL TYPE
            </FTypo>
          </FItem>
        </FItem>
        <FInputText
          className={"f-mt-2"}
          label={"AMOUNT TO STAKE"}
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
        {/* <FInputText
          className={"f-mt-2"}
          label={"AVAILABLE BALANCE"}
          placeholder={"0"}
          onChange={(e: any) => console.log(e.target.value)}
          disabled={true}
        />
        <FInputText
          className={"f-mt-2"}
          label={"REMAINING FROM CAP"}
          placeholder={"0"}
          onChange={(e: any) => console.log(e)}
          disabled={true}
        /> */}

        {/* <FResponseBar
          variant="error"
          title="Could send a sign request. Not enough balance."
          className="f-mb-0"
          show={true}
        ></FResponseBar> */}
        <FButton title={" Submit Stake"} className="w-100 f-mt-2" onClick={performStake} />
        {
          isWalletConnected && (
            <div onClick={performApprove} style={{display: 'flex', justifyContent: 'end', marginTop: '1rem', cursor: 'pointer'}}>
              Approve Wallet
            </div>
          )
        }
       

      </FCard>
      <ConfirmationDialog onHide={() =>setShowConfirmation(false)} transaction={processMsg} message={'Transaction sent to network and is processing.'} show={showConfirmation} />
      <TxProcessingDialog onHide={() =>setLoading(false)} message={ processMsg || "Transaction Processing...."} show={loading}/>
    </React.Fragment>
  );
};
export default StakeCardSubmit;
