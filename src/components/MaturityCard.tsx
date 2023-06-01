import React, { useState } from "react";
import {
  FCard,
  FContainer,
  FGrid,
  FGridItem,
  FItem,
  FTypo,
} from "ferrum-design-system";
import { getMaturityInfo } from "../utils/DateUtil";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { CasperClient, CasperServiceByJsonRPC, CLPublicKey, CLValueBuilder, decodeBase16, DeployUtil, RuntimeArgs, Signer } from "casper-js-sdk";
import { useHistory } from "react-router";

const RPC_API = "https://rpc.testnet.casperlabs.io/rpc";

const casperService = new CasperServiceByJsonRPC(RPC_API);
const casperClient = new CasperClient(RPC_API);

export const CardMaturity = () => { 
  // console.log(maturityInfo);
  const navigate = useHistory();
  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState();
  const [processMsg, setProcessMsg] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const { config } = useSelector((state: any) => state.casper.connect);
  const { connect: { selectedAccount, isWalletConnected, signedAddresses } } = useSelector((state: any) => state.casper);

  const maturityInfo: any = getMaturityInfo(
    config?.withdrawStarts,
    config?.withdrawEnds
  );

  return (
    <FCard className={"card-maturity f-mb-2"}>
      <FGrid>
        <FGridItem dir={"column"} alignX={"center"} className="">
          <FItem align={"center"}>
            <FTypo size={18} align={"center"} className={" f-mt--7"}>
              MATURITY AT
            </FTypo>
            <FTypo size={22} weight={600} color="#dab46e">
              {maturityInfo.maturityAt}
            </FTypo>
          </FItem>
        </FGridItem>
        {/* {maturityAt?.month > 0 ||
        maturityAt?.days > 0 ||
        maturityAt?.minuts > 0 ? ( */}
        <FContainer width={350} className="f-mt-2">
          <FGrid>
            <FGridItem
              alignY="center"
              alignX={"center"}
              dir={"column"}
              className={"countdown-timer"}
              size={[4, 4, 4]}
            >
              <FItem className={"timer-block"}>
                <FItem
                  bgColor="#272930"
                  display={"flex"}
                  alignX={"center"}
                  alignY={"center"}
                  size={90}
                >
                  <FTypo
                    size={28}
                    weight={600}
                    color="#dab46e"
                    align={"center"}
                  >
                    {maturityInfo.months}
                  </FTypo>{" "}
                </FItem>
                <FTypo align={"center"} className="f-mt--5">
                  MONTHS
                </FTypo>
              </FItem>
            </FGridItem>
            <FGridItem size={[4, 4, 4]} dir={"column"} alignY="center">
              <FItem className={"timer-block"}>
                <FItem
                  bgColor="#272930"
                  display={"flex"}
                  alignX={"center"}
                  alignY={"center"}
                  size={90}
                >
                  <FTypo
                    size={28}
                    weight={600}
                    color="#dab46e"
                    align={"center"}
                  >
                    {maturityInfo.days}
                  </FTypo>{" "}
                </FItem>
                <FTypo align={"center"} className="f-mt--5">
                  DAYS
                </FTypo>
              </FItem>
            </FGridItem>
            <FGridItem size={[4, 4, 4]} dir={"column"} alignY="center">
              <FItem className={"timer-block"}>
                <FItem
                  bgColor="#272930"
                  display={"flex"}
                  alignX={"center"}
                  alignY={"center"}
                  size={90}
                >
                  <FTypo
                    size={28}
                    weight={600}
                    color="#dab46e"
                    align={"center"}
                  >
                    {maturityInfo.minutes || 0}
                  </FTypo>{" "}
                </FItem>
                <FTypo align={"center"} className="f-mt--5">
                  MINUTES
                </FTypo>
              </FItem>
            </FGridItem>
          </FGrid>
        </FContainer>
        {/* ) : null} */}
        <FGridItem alignX={"center"} className="f-mt-2">
          <FItem align={"center"}>
            <FTypo size={18} align={"center"} className={"f-mb--5 f-mt--7"}>
              EARLY WITHDRAW OPEN
            </FTypo>
            <FTypo size={22} weight={600} color="#dab46e">
              {maturityInfo.earlyWithdrawDate}
            </FTypo>
          </FItem>
        </FGridItem>
      </FGrid>
    </FCard>
  );
};
