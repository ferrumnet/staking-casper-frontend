import React, { useState } from "react";
import {
  FButton,
  FCard,
  FInputText,
  FItem,
  FTypo,
  // FResponseBar,
} from "ferrum-design-system";
import { ReactComponent as BrandIcon } from "../assets/images/brand-icon.svg";
import { ReactComponent as EyeIcon } from "../assets/images/EyeIcon.svg";
import { ReactComponent as EyeIconUnhide } from "../assets/images/EyeIconUnhide.svg";
import { ReactComponent as WarningIcon } from "../assets/images/WarningIcon.svg";
import { ReactComponent as IconTimer } from "../assets/images/icon-staking-timer.svg";
import { ReactComponent as LockIcon } from "../assets/images/LockIcon.svg";
// import { ConnectDialog } from "../dialogs/ConnectDialog";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router";
import { CasperClient, CasperServiceByJsonRPC, CLKey, CLPublicKey, CLValue, 
  CLValueBuilder, 
  CLValueParsers, 
  decodeBase16, 
  DeployUtil, RuntimeArgs, Signer } from "casper-js-sdk";
import toast from "react-hot-toast";
import { connectWallet as connectWalletDispatch } from '../redux/casper/casperActions';
import { getStakingInfo } from "../utils/DateUtil";
import { convertHashStrToHashBuff, getTokenHash, setContractHash } from "../utils/stringParser";

const RPC_API = "https://rpc.testnet.casperlabs.io/rpc";

const casperService = new CasperServiceByJsonRPC(RPC_API);
const casperClient = new CasperClient(RPC_API);

const StakingCard = () => {
  const { stakingId }: any = useParams();
  console.log(stakingId, 'stakingIdstakingId');
  // const maturityInfo = getMaturityInfo();
  const dispatch = useDispatch();
  const navigate = useHistory();
  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState();
  const [processMsg, setProcessMsg] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showAddress, setShowAddress] = useState<boolean>(false);
  const isWalletConnected = false;
  const connection = useSelector((state: any) => state.casper.connect)
  const { connect: { config, selectedAccount, signedAddresses } } = useSelector((state: any) => state.casper);

  const connectWallet = async () => {
    //@ts-ignore
    const casperWalletProvider = await window.CasperWalletProvider;    
    const provider = casperWalletProvider();
    const isConnected = await provider.isConnected();


    if (isConnected) {
      await AccountInformation();
    }   
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
  
          if(info.deploy.session) {
            //@ts-ignore
            const transforms = info.execution_results[0].result.Success?.effect.transforms;
            const stacking_contract_package_hash = transforms.find((e: any) => e.transform.AddKeys && e.transform.AddKeys[0].name === 'stacking_contract_package_hash')
            const contract_package_hash = transforms.find((e: any) => e.transform.AddKeys && e.transform.AddKeys[0].name === 'contract_package_hash')
            // @ts-ignore
            configLoaded({
              // @ts-ignore
              config: info.deploy.session.ModuleBytes.args,
              contract_package_hash: contract_package_hash,
              stacking_contract_package_hash: stacking_contract_package_hash,
              tokenInfo: {
                tokenSymbol: tokenSymbol.CLValue?.data,
                tokenName: tokenName.CLValue?.data
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


  const stakingInfo = getStakingInfo( 
    connection?.config?.stakingEnds,
    connection?.config?.stakingStarts,
    connection?.config?.withdrawStarts,
    connection?.config?.withdrawEnds
  );

  const isAddressSigned = () => {
    if (connection?.selectedAccount?.address) {
      const isSigned = connection.signedAddresses?.find(
        (e: any) => e.signer === connection?.selectedAccount?.address
      )

      return true
      //!!isSigned
    }
    return false; 
  };

  const signIt = async () => {
    const publicKeyHex = connection?.selectedAccount?.address;
    const senderPublicKey = CLPublicKey.fromHex(publicKeyHex);

    const deployParams = new DeployUtil.DeployParams(
      senderPublicKey,
      'casper-test'
    );

    const args = RuntimeArgs.fromMap({
      "spender": CLValueBuilder.string('b9e3b671e577a7d7a4c53aa7010449b47fb8a811c76582dcc41f65a67a16e23d'),
    });

    const session = DeployUtil.ExecutableDeployItem.newStoredContractByHash(
      decodeBase16('6adb2902bf7c56116ead7ea7a2ffa269b8d4b117b632d2c44052f3c951dcaa0b'),
      'approve',
      args
    );

    const payment = DeployUtil.standardPayment(10000000000000);

    const deploy = DeployUtil.makeDeploy(deployParams, session, payment);

    const deployJson: any = DeployUtil.deployToJson(deploy);
  
    Signer.sign(deployJson, publicKeyHex).then((signedDeployJson) => {
      const signedDeploy = DeployUtil.deployFromJson(signedDeployJson);
      console.log(signedDeploy)
      if (signedDeploy.ok) {
        return casperService.deploy(signedDeploy.val).then((res) => {
          console.log(res);
          return res;
        });
      }
     
    });
  };

  console.log(stakingInfo, 'stakingInfostakingInfo', connection)

  return (
    <React.Fragment>
      <FCard className={"card-connect f-mb-2"}>
        <FItem display={"flex"} className="f-mb-2">
          <FItem bgColor="#1F2128" size={70} className="f-p--8 f-mr-1" display={"flex"} alignX="center" alignY={"center"}>
            <BrandIcon />
          </FItem>
          <FItem className={"f-ml-1"}>
            <FTypo size={24} color="white" className={"f-mt--4"}>
              { connection?.config?.name || 'Pool Name'}
            </FTypo>
            <FTypo size={12} color="white">
              STAKING POOL
            </FTypo>
          </FItem>
        </FItem>
        {/* <FTypo className={"f-mb-4"} color="white" size={16}>
          CONNECTED TO ETHEREUM NETWORK
        </FTypo> */}

        {!stakingInfo.isStakingOpen && stakingInfo.stakingOpensIn && (
          <FTypo className={"f-mb-3"} color="white" size={22} weight={600} display="flex" alignX={"center"} alignY="center">
            <IconTimer className="f-mr-1" /> Staking Opens in {stakingInfo.stakingOpensIn}
          </FTypo>
        )}  
        {isWalletConnected && <FInputText className={"f-mt-2 f-mb-2"} label={"YOUR ADDRESS"} disabled={true} value={''} />}
        <FItem className="f-mt-2 f-mb-1" display={"flex"} alignX={"between"} alignY="center">
          <FTypo weight={600}>CONTRACT ADDRESS</FTypo>
          {showAddress ? <EyeIconUnhide width={50} onClick={() => setShowAddress(false)} /> : <EyeIcon width={50} onClick={() => setShowAddress(true)} />}
        </FItem>
        {showAddress ? <FInputText className={"f-mb-2"} type="text" disabled={true} value={stakingId || ''} /> : null}
        {showAddress ? (
          <FItem display={"flex"} className={"f-p--8"} bgColor=" rgba(255, 255, 255, 0.25" alignY={"center"}>
            <WarningIcon width={40} />
            <FTypo className={"f-pl-1 f-pr-1"} size={15} weight={600}>
              NEVER SEND TOKENS TO THE CONTRACT, THEY WILL BE LOCKED FOREVER. ONLY USE THIS UI TO STAKE.
            </FTypo>
          </FItem>
        ) : null}

        {!connection.isWalletConnected ? (
          <FButton title={"Connect"} className="w-100 f-mt-2" onClick={() => connectWallet()} />
        ) : (
          <>
            {isAddressSigned() ? (
              <>
                <FButton
                  title={stakingInfo.isStakingOpen ? "Stake" : stakingInfo.isEarlyWithdraw ? "Early Withdraw" : stakingInfo.isWithdrawOpen ? "Maturity Withdraw" : "Refresh"}
                  className="w-100 f-mt-2"
                  onClick={() => {
                    // console.log("staking");
                    // dispatch(algorandActions.shouldStake());
                    if (getStakingInfo(connection?.config?.stakingEnds, connection?.config?.stakingStarts, connection?.config?.withdrawStarts, connection?.config?.withdrawEnds).isStakingOpen) {
                      navigate.push(`/${stakingId}/submit-stake`);
                    } else if (
                      getStakingInfo(connection?.config?.stakingEnds, connection?.config?.stakingStarts, connection?.config?.withdrawStarts, connection?.config?.withdrawEnds).isEarlyWithdraw ||
                      getStakingInfo(connection?.config?.stakingEnds, connection?.config?.stakingStarts, connection?.config?.withdrawStarts, connection?.config?.withdrawEnds).isWithdrawOpen
                    ) {
                      console.log(stakingId, 'withdrawwww')
                      navigate.push(`/${stakingId}/submit-withdraw`);
                    } else {
                      window.location.reload();
                    }
                  }}
                />
              </>
            ) : (
              <FButton title={"Sign"} className="w-100 f-mt-2" onClick={() => signIt()} />
            )}
          </>
        )}
        {/* <FResponseBar
          variant="error"
          title="Could send a sign request. Not enough balance."
          className="f-mb-0"
          show={true}
        ></FResponseBar> */}
        {stakingInfo.isLockPeriod && (
          <FItem className={"f-mt-2 "}>
            <FItem bgColor="#1F2128" className={"f-p--8 w-100"} display={"flex"} alignX="center" alignY="center">
              <LockIcon className={"f-mr-1"} />
              <FItem display="flex">
                <FTypo weight={600} size={20} display="inline-block">
                  Lock Period
                </FTypo>
                <FTypo color="#dab46e" weight={600} size={20} className={"f-pl--5"} display="inline-block">
                  {stakingInfo.lockPeriod}
                </FTypo>
              </FItem>
            </FItem>
          </FItem>
        )}
      </FCard>
    </React.Fragment>
  );
};

export default StakingCard;
