import React, { useEffect, useState } from "react";
import { FCard, FGrid, FGridItem, FItem, FTypo } from "ferrum-design-system";
import { useSelector } from "react-redux";
import { getStakingInfo } from "../utils/DateUtil";


export const StakingInfoCard = () => {

  // const [stakingCap, setStakingCap] = useState<any>(undefined);
  const [stakeSoFar, setStakeSoFar] = useState<any>(undefined);
  const [youStakedBalance, setYourStakedBalance] = useState<any>(undefined);
  const { connect: { config, selectedAccount, isWalletConnected, signedAddresses, tokenInfo} } = useSelector((state: any) => state.casper);

  // console.log(stakingCap, stakeSoFar, youStakedBalance);
  console.log(config, 'configconfigconfig');
  const closesIn = getStakingInfo(config?.stakingEnds, config?.stakingStarts, config?.withdrawStarts, config?.withdrawEnds).stakingClosesIn;

  return (
    <FCard className={"card-staking f-mb-2"}>
      <FGrid>
        <FGridItem alignX={"center"} size={[6, 6, 12]} className="f-mb-1">
          <FItem align={"center"}>
            <FTypo size={18} align={"center"} className={"f-mb--5 f-mt--7"}>
              MATURITY REWARD
            </FTypo>
            <FTypo size={22} weight={600} color="#dab46e">
              0 APY
            </FTypo>
          </FItem>
        </FGridItem>
        <FGridItem alignX={"center"} size={[6, 6, 12]} className="f-mb-1">
          <FItem align={"center"}>
            <FTypo size={18} align={"center"} className={"f-mb--5 f-mt--7"}>
              EARLY REWARDS
            </FTypo>
            <FTypo size={22} weight={600} color="#dab46e">
              0 APY
            </FTypo>
          </FItem>
        </FGridItem>
        <FGridItem alignX={"center"} size={[6, 6, 12]} className="f-mb-1">
          <FItem align={"center"}>
            <FTypo size={18} align={"center"} className={"f-mb--5 f-mt--7"}>
              STAKING CAP
            </FTypo>
            <FTypo size={22} weight={600} color="#dab46e">
              {config?.stakingTotal || 0} {tokenInfo.tokenSymbol || "token"}
            </FTypo>
          </FItem>
        </FGridItem>
        <FGridItem alignX={"center"} size={[6, 6, 12]} className="f-mb-1">
          <FItem align={"center"}>
            <FTypo size={18} align={"center"} className={"f-mb--5 f-mt--7"}>
              STAKED SO FAR
            </FTypo>
            <FTypo size={22} weight={600} color="#dab46e">
              {stakeSoFar ? stakeSoFar : 0} {tokenInfo.tokenSymbol || "token"}
            </FTypo>
          </FItem>
        </FGridItem>
        {isWalletConnected && (
          <>
            <FGridItem alignX={"center"} className="f-mb-1">
              <FItem align={"center"}>
                <FTypo size={18} align={"center"} className={"f-mb--5 f-mt--7"}>
                  YOUR STAKED BALANCE
                </FTypo>
                <FTypo size={22} weight={600} color="#dab46e">
                  {youStakedBalance ? youStakedBalance : 0} {tokenInfo.tokenSymbol || "token"}
                </FTypo>
              </FItem>
            </FGridItem>
          </>
        )}
        <FGridItem>
        <FItem
            bgColor="#1F2128"
            className={"f-mt--5 f-p--8 w-100"}
            align="center"
        >
            <FTypo weight={500} size={18}>
            STAKING CONTRIBUTION CLOSE IN {closesIn || 0}
            </FTypo>
        </FItem>
        </FGridItem>
      </FGrid>
    </FCard>
  );
};

export default StakingInfoCard;
