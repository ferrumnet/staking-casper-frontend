import { FGrid, FGridItem, FTypo } from "ferrum-design-system";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Route, Switch, useParams } from "react-router";
import axios from "axios";
import { StakingInfoCard } from "../../components/StakingInfoCard";
import { CardMaturity } from "../../components/MaturityCard";
import StakeCardSubmit from "../../components/StakeCardSubmit";
import WidthCardSubmit from "../../components/WithdrawCardSubmit";
import StakingCard from "../../components/StakingCard";

export const LandingPage = () => {
    return (
        <div>
            <FGrid spacing={13}>            
                <>
                    <FGridItem size={[6, 6, 12]} dir="column">
                    <Switch>
                        <Route
                            path={"/:stakingId/submit-stake"}
                            component={StakeCardSubmit}
                        ></Route>
                        <Route
                            path={"/:stakingId/submit-withdraw"}
                            component={WidthCardSubmit}
                        ></Route>
                        <Route path={"/:stakingId/"} component={StakingCard}></Route>
                    </Switch>
                    </FGridItem>
                    <FGridItem size={[6, 6, 12]} dir="column">
                        <StakingInfoCard />
                        <CardMaturity />
                    </FGridItem>
                </>
            </FGrid>
        </div>
    )
}