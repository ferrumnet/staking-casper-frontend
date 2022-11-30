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

const StakingCard = () => {
  const { stakingId }: any = useParams();
  console.log(stakingId);
  // const maturityInfo = getMaturityInfo();
  const dispatch = useDispatch();
  const navigate = useHistory();
  const [showAddress, setShowAddress] = useState<boolean>(false);
  const isWalletConnected = false;

  const connectWallet = async () => {
    
  };

  const isAddressSigned = () => {
   
    return false;
  };

  const signIt = async () => {
    
  };

  return (
    <React.Fragment>
      <FCard className={"card-connect f-mb-2"}>
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
        {/* <FTypo className={"f-mb-4"} color="white" size={16}>
          CONNECTED TO ETHEREUM NETWORK
        </FTypo> */}

        <FTypo className={"f-mb-3"} color="white" size={22} weight={600} display="flex" alignX={"center"} alignY="center">
            <IconTimer className="f-mr-1" /> Staking Opens in
        </FTypo>
        {isWalletConnected && <FInputText className={"f-mt-2 f-mb-2"} label={"YOUR ADDRESS"} disabled={true} value={''} />}
        <FItem className="f-mt-2 f-mb-1" display={"flex"} alignX={"between"} alignY="center">
          <FTypo weight={600}>CONTRACT ADDRESS</FTypo>
          {showAddress ? <EyeIconUnhide width={50} onClick={() => setShowAddress(false)} /> : <EyeIcon width={50} onClick={() => setShowAddress(true)} />}
        </FItem>
        {showAddress ? <FInputText className={"f-mb-2"} type="text" disabled={true} value={'01a3df24a5d41c33a51e7cdaba832b24af23ab61a38dc6bacc873adde13ecd9abd'} /> : null}
        {showAddress ? (
          <FItem display={"flex"} className={"f-p--8"} bgColor=" rgba(255, 255, 255, 0.25" alignY={"center"}>
            <WarningIcon width={40} />
            <FTypo className={"f-pl-1 f-pr-1"} size={15} weight={600}>
              NEVER SEND TOKENS TO THE CONTRACT, THEY WILL BE LOCKED FOREVER. ONLY USE THIS UI TO STAKE.
            </FTypo>
          </FItem>
        ) : null}

        {!isWalletConnected ? (
          <FButton title={"Connect"} className="w-100 f-mt-2" onClick={() => connectWallet()} />
        ) : (
          <>
            {isAddressSigned() ? (
              <>
                <FButton
                  title={""}
                  className="w-100 f-mt-2"
                  onClick={() => {
                    // console.log("staking");
                    
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
        <FItem className={"f-mt-2 "}>
        <FItem bgColor="#1F2128" className={"f-p--8 w-100"} display={"flex"} alignX="center" alignY="center">
            <LockIcon className={"f-mr-1"} />
            <FItem display="flex">
            <FTypo weight={600} size={20} display="inline-block">
                Lock Period
            </FTypo>
            <FTypo color="#dab46e" weight={600} size={20} className={"f-pl--5"} display="inline-block">
                
            </FTypo>
            </FItem>
        </FItem>
        </FItem>
      </FCard>
    </React.Fragment>
  );
};

export default StakingCard;
