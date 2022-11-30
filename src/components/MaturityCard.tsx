import React from "react";
import {
  FCard,
  FContainer,
  FGrid,
  FGridItem,
  FItem,
  FTypo,
} from "ferrum-design-system";
import { useSelector } from "react-redux";

export const CardMaturity = () => { 
  // console.log(maturityInfo);

  return (
    <FCard className={"card-maturity f-mb-2"}>
      <FGrid>
        <FGridItem dir={"column"} alignX={"center"} className="">
          <FItem align={"center"}>
            <FTypo size={18} align={"center"} className={" f-mt--7"}>
              MATURITY AT
            </FTypo>
            <FTypo size={22} weight={600} color="#dab46e">
              0
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
                    1
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
                    2
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
                    3
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
              
            </FTypo>
          </FItem>
        </FGridItem>
      </FGrid>
    </FCard>
  );
};
