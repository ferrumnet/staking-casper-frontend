import React from "react";
import {
  FButton,
  FCard,
  FItem,
  FTruncateText,
  FTypo,
} from "ferrum-design-system";
import { useSelector } from "react-redux";
import { useHistory } from "react-router";

const StackingPendingCard = () => {
  const navigate = useHistory();
  const { config } = useSelector((state: any) => state.algorand);
  return (
    <FCard className={"card-staking-status f-mb-2"}>
      <FItem align={"center"} className="f-mb-2">
        <FTypo size={20} align={"center"} className={"f-mb--5 f-mt--7"}>
          STAKING
        </FTypo>
        <FItem>
          <FItem
            bgColor="#1F2128"
            className={"f-mt--5 f-p--8"}
            align="center"
            display={"inline-block"}
          >
            <FTypo weight={500} size={18} className="f-pr-3 f-pl-3">
              TRANSACTIONS IN PROGRESS
            </FTypo>
          </FItem>
        </FItem>
      </FItem>
      <FItem align={"center"} className="f-mb-2">
        <FTypo size={16} weight={600} color="white">
          Transaction ID
        </FTypo>
        <FTypo className={"f-mt--7"} size={16} color="rgba(255,255,255,.5)">
          <FTruncateText text={"0x071ef1A1f8B92A2d4E48b35705481c92E64b3d08"} />
        </FTypo>
      </FItem>
      <FItem align={"center"} className="f-mb-2">
        <FTypo size={16} weight={600} color="white">
          Transaction ID
        </FTypo>
        <FTypo className={"f-mt--7"} size={16} color="rgba(255,255,255,.5)">
          <FTruncateText text={"0x071ef1A1f8B92A2d4E48b35705481c92E64b3d08"} />
        </FTypo>
      </FItem>
      <FItem align={"center"} className="f-mb-2">
        <FTypo className={"f-mt-3"} size={26} weight={600} color="#dab46e">
          PENDING
        </FTypo>
        <FTypo className={"f-mt-1"} size={16} weight={600} color="white">
          Please wait until transactions are confirmed
        </FTypo>
      </FItem>
      <FButton
        title={"GO BACK"}
        onClick={() => navigate.push(`/${config._id}`)}
        className="w-100 f-mt-2"
      />
    </FCard>
  );
};
export default StackingPendingCard;
