import React from "react";
import { FContainer } from "ferrum-design-system";
import { useSelector } from "react-redux";
import StackingPendingCard from "../../components/StackingPendingCard";
import StackingSuccessCard from "../../components/StackingSuccessCard";

const StatusPage = () => {
  const { isStaked } = useSelector((state: any) => state.algorand);
  return (
    <FContainer width={500}>
      {!isStaked ? <StackingPendingCard /> : <StackingSuccessCard />}
    </FContainer>
  );
};

export default StatusPage;
