import { useState } from "react";
import { FGrid, FCard, FGridItem, FContainer, FInputText, FButton, FDatepicker } from "ferrum-design-system";
import { useForm } from "react-hook-form";
import { Toaster } from "react-hot-toast";
import { useSelector } from "react-redux";
import { CLPublicKey, CasperClient, CLValueBuilder, CLOptionType, DeployUtil, RuntimeArgs, Signer, CasperServiceByJsonRPC, CLAccountHashType, CLValueParsers, CLAccountHash, CLKey, CLTypeBuilder, CLByteArray } from "casper-js-sdk";
import TxProcessingDialog from "../../dialogs/TxProcessingDialog";
import ConfirmationDialog from "../../dialogs/ConfirmationDialog";
import toast from "react-hot-toast";
import axios from "axios";
import { setContractHash } from "../../utils/stringParser";

const RPC_API = "https://rpc.testnet.casperlabs.io/rpc";
const casperClient = new CasperClient(RPC_API);
const casperService = new CasperServiceByJsonRPC(RPC_API);

function toTimestamp(strDate: string){
  var datum = Date.parse(strDate);
  return datum/1000;
}

export const InputForm = () => {
  const connection = useSelector((state: any) => state.casper.connect)
  const { connect: { config, selectedAccount, isWalletConnected, signedAddresses } } = useSelector((state: any) => state.casper);
  // const { actionLoading } = useSelector((state: any) => state.staking);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [processMsg, setProcessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const initialValues = {
    stakingPoolName: "",
    tokenAddress: "",
    stakingCap: "",
    stakingStarts: "",
    stakingEnds: "",
    withdrawStarts: "",
    withdrawEnds: "",
  };

  const {
    // reset,
    register,
    control,
    handleSubmit,
    formState: {
      errors,
      //  isSubmitting
    },
    // watch,
  } = useForm({ defaultValues: initialValues });

  const onSubmit = async (values: any) => {

    try {
      //@ts-ignore
      const casperWalletProvider = await window.CasperWalletProvider;    
      const provider = casperWalletProvider();
      // console.log(selectedAccount?.address, Number(amount));
      const publicKeyHex = selectedAccount?.address;
      const senderPublicKey = CLPublicKey.fromHex(publicKeyHex);

      const deployParams = new DeployUtil.DeployParams(
        senderPublicKey,
        'casper-test'
      );

      const latestBlock = await casperService.getLatestBlockInfo();

      const contractHash = await casperService.getBlockState(
        //@ts-ignore
        latestBlock?.block?.header?.state_root_hash,
        `hash-${values.tokenAddress}`,
        []
     )

     let resolvedContractHash = '';

     if (contractHash) {
      resolvedContractHash = contractHash.ContractPackage?.versions[0].contractHash || ''
     }


      // const hashHex = Buffer.from("e222974816f70ca96fc4002a696bb552e2959d3463158cd82a7bfc8a94c03473");
      // const byteArr = new CLByteArray(new Uint8Array(hashHex));
      // const myKey = new CLKey(byteArr);
      const args = RuntimeArgs.fromMap({
        "name": CLValueBuilder.string(values.stakingPoolName),
        "address": CLValueBuilder.string(values.tokenAddress),
        "staking_starts": CLValueBuilder.u64(toTimestamp(values.stakingStarts)),
        "staking_ends": CLValueBuilder.u64(toTimestamp(values.stakingEnds)),
        "withdraw_starts": CLValueBuilder.u64(toTimestamp(values.withdrawStarts)),
        "withdraw_ends": CLValueBuilder.u64(toTimestamp(values.withdrawEnds)),
        "staking_total": CLValueBuilder.u256(values.stakingCap),
        "erc20_contract_package_hash": setContractHash(`hash-e222974816f70ca96fc4002a696bb552e2959d3463158cd82a7bfc8a94c03473`)
      });

      const res = await axios.get('https://casper-staking-backend.dev.svcs.ferrumnetwork.io',
        {
          responseType: 'arraybuffer'
        }
      ) 

      if (res.status === 200 && res.data) {

        const wasm = new Uint8Array(res.data);

        const session = DeployUtil.ExecutableDeployItem.newModuleBytes(
          wasm,
          args
        );

        const payment = DeployUtil.standardPayment(200000000000);

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
            const res = await casperClient.putDeploy(signedDeploy);
            console.log(res, 'resres');
            setProcessMsg(res)
            setLoading(false)
            setShowConfirmation(true)
          }
        })
      }
  
    } catch (e) {
      console.log("ERROR : ", e);
      toast.error("An error occured please see console for details");
    } finally {
      //setLoading(false)
    }
  };

  return (
    <>
      <Toaster />
      <FContainer width={1200}>
        <FCard variant={"primary"} className="f-mt-2 f-mb-2">
          <form autoComplete="false" onSubmit={handleSubmit(onSubmit)}>
            <FGrid className={"f-mt-1"}>
              <FGridItem size={[6, 6, 6]}>
                <FInputText
                  label="Staking Pool Name"
                  name="stakingPoolName"
                  type="text"
                  className={"w-100"}
                  placeholder="0"
                  register={register}
                  validations={{
                    required: {
                      value: true,
                      message: "pool Name is required",
                    },
                  }}
                  error={errors["stakingPoolName"]?.message ? errors["stakingPoolName"]?.message : ""}
                />
              </FGridItem>
              <FGridItem size={[6, 6, 6]}>
                <FInputText
                  label="Token Address"
                  name="tokenAddress"
                  type="text"
                  className={"w-100"}
                  placeholder="0"
                  register={register}
                  validations={{
                    required: {
                      value: true,
                      message: "Token Address is required",
                    },
                  }}
                  error={errors["tokenAddress"]?.message ? errors["tokenAddress"]?.message : ""}
                />
              </FGridItem>
              <FGridItem size={[6, 6, 6]}>
                <FInputText
                  label="stakingCap"
                  name="stakingCap"
                  className={"f-mt-1"}
                  type="text"
                  placeholder="0"
                  register={register}
                  validations={{
                    required: {
                      value: true,
                      message: "Staking Cap is required",
                    },
                  }}
                  error={errors["stakingCap"]?.message ? errors["stakingCap"]?.message : ""}
                />
              </FGridItem>
              <FGridItem size={[6, 6, 6]}>
                <FDatepicker
                  label="Staking Starts"
                  name="stakingStarts"
                  className={"f-mt-1"}
                  placeholderText="MM-DD-YYYY"
                  register={register}
                  showTimeSelect={true}
                  control={control}
                  validations={{
                    required: {
                      value: true,
                      message: "Staking Starts is required",
                    },
                  }}
                  error={errors["stakingStarts"]?.message ? errors["stakingStarts"]?.message : ""}
                />
              </FGridItem>
              <FGridItem size={[6, 6, 6]}>
                <FDatepicker
                  label="Staking Ends"
                  name="stakingEnds"
                  className={"f-mt-1"}
                  placeholderText="MM-DD-YYYY"
                  register={register}
                  showTimeSelect={true}
                  control={control}
                  validations={{
                    required: {
                      value: true,
                      message: "Staking Ends is required",
                    },
                  }}
                  error={errors["stakingEnds"]?.message ? errors["stakingEnds"]?.message : ""}
                />
              </FGridItem>
              <FGridItem size={[6, 6, 6]}>
                <FDatepicker
                  label="Withdraw Starts"
                  name="withdrawStarts"
                  className={"f-mt-1"}
                  placeholderText="MM-DD-YYYY"
                  register={register}
                  showTimeSelect={true}
                  control={control}
                  validations={{
                    required: {
                      value: true,
                      message: "Withdraw Starts is required",
                    },
                  }}
                  error={errors["withdrawStarts"]?.message ? errors["withdrawStarts"]?.message : ""}
                />
              </FGridItem>
              <FGridItem size={[6, 6, 6]}>
                <FDatepicker
                  label="Withdraw Ends"
                  name="withdrawEnds"
                  className={"f-mt-1"}
                  placeholderText="MM-DD-YYYY"
                  register={register}
                  showTimeSelect={true}
                  control={control}
                  validations={{
                    required: {
                      value: true,
                      message: "Withdraw Ends is required",
                    },
                  }}
                  error={errors["withdrawEnds"]?.message ? errors["withdrawEnds"]?.message : ""}
                />
              </FGridItem>
              <FGridItem alignX={"end"}>
                <FButton
                  type="submit"
                  disabled={!connection.connectedAccounts.length}
                  title={!!connection.connectedAccounts.length ? "Deploy Staking pool" : 'Connect wallet to create' }
                  className={"f-mt-1 f-mb-2"}
                  // postfix={isSubmitting && <ClipLoader color="#fff" size={20} />}
                ></FButton>
              </FGridItem>
            </FGrid>
          </form>
        </FCard>
        <ConfirmationDialog onHide={() =>setShowConfirmation(false)} transaction={processMsg} message={'Transaction successfully sent to network.'} show={showConfirmation} />
        <TxProcessingDialog onHide={() =>setLoading(false)} message={ processMsg || "Transaction Processing...."} show={loading}/>
      </FContainer>
    </>
  );
};
