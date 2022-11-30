import React from "react";
import {
  FButton,
  FCard,
  FIcon,
  FItem,
  FTruncateText,
  FTypo,
} from "ferrum-design-system";
import { ReactComponent as CheckIcon } from "../../assets/images/CheckIcon.svg";
import { useHistory } from "react-router";
import { useDispatch } from "react-redux";

const StackingSuccessCard = () => {
  const navigate = useHistory();
  const dispatch = useDispatch();

  const stakeMoreHanlder = () => {
    navigate.push("/");
  };
  return (
    <FCard className={"card-staking-status f-mb-2"}>
      <FItem align={"center"} className="f-mb-2">
        <FTypo size={20} align={"center"} className={"f-mb--5 f-mt--7"}>
          STAKING
        </FTypo>
        <FItem>
          <FItem
            bgColor="#1F2128"
            className={"f-p--8"}
            align="center"
            display={"inline-block"}
          >
            <FTypo weight={500} size={18} className="f-pr-3 f-pl-3">
              CONGRATULATIONS
            </FTypo>
          </FItem>
        </FItem>
      </FItem>
      <FItem align={"center"} className="f-mb-2">
        <FIcon>
          <CheckIcon />
        </FIcon>
        <FTypo size={24} weight={600} color="#dab46e" className="f-mt-1">
          You hace stakeed 10,000 AFRM
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
        <FTypo size={16} weight={600} color="white">
          Transaction ID
        </FTypo>
        <FTypo className={"f-mt--7"} size={16} color="rgba(255,255,255,.5)">
          <FTruncateText text={"0x071ef1A1f8B92A2d4E48b35705481c92E64b3d08"} />
        </FTypo>
      </FItem>

      <FButton
        variant={"secondary"}
        title={"STAKE MORE"}
        className="w-100 f-mt-2"
        onClick={stakeMoreHanlder}
        outlined
      />

      <FButton
        title={"GO BACK"}
        className="w-100 f-mt-2"
        onClick={() => navigate.push("/")}
      />
    </FCard>
  );
};
export default StackingSuccessCard;
