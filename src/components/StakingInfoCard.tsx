import React, { useEffect, useState } from "react";
import { FCard, FGrid, FGridItem, FItem, FTypo } from "ferrum-design-system";
import { useSelector } from "react-redux";


export const StakingInfoCard = () => {

  const isWalletConnected = false;
  // const [stakingCap, setStakingCap] = useState<any>(undefined);
  const [stakeSoFar, setStakeSoFar] = useState<any>(undefined);
  const [youStakedBalance, setYourStakedBalance] = useState<any>(undefined);

  // console.log(stakingCap, stakeSoFar, youStakedBalance);

  return (
    <FCard className={"card-staking f-mb-2"}>
      <FGrid>
        <FGridItem alignX={"center"} size={[6, 6, 12]} className="f-mb-1">
          <FItem align={"center"}>
            <FTypo size={18} align={"center"} className={"f-mb--5 f-mt--7"}>
              MATURITY REWARD
            </FTypo>
            <FTypo size={22} weight={600} color="#dab46e">
              10 APY
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
              0 AFRM
            </FTypo>
          </FItem>
        </FGridItem>
        <FGridItem alignX={"center"} size={[6, 6, 12]} className="f-mb-1">
          <FItem align={"center"}>
            <FTypo size={18} align={"center"} className={"f-mb--5 f-mt--7"}>
              STAKED SO FAR
            </FTypo>
            <FTypo size={22} weight={600} color="#dab46e">
              {stakeSoFar ? stakeSoFar : 0} AFRM
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
                  {youStakedBalance ? youStakedBalance : 0} AFRM
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
            STAKING CONTRIBUTION CLOSE IN 0
            </FTypo>
        </FItem>
        </FGridItem>
      </FGrid>
    </FCard>
  );
};
