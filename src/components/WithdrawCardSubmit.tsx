import React, { useEffect, useState } from "react";
import {
  FButton,
  FCard,
  FInputText,
  FItem,
  //   FResponseBar,
  FTypo,
} from "ferrum-design-system";
import { ReactComponent as BrandIcon } from "../assets/images/brand-icon.svg";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router";
import toast from "react-hot-toast";

// interface CardSubmitStakeProps {
//   walletConnected?: boolean;
// }

const WidthCardSubmit = () => {
  const { stakingId }: any = useParams();
  console.log(stakingId);
  const history = useHistory();
  const dispatch = useDispatch();
  const [amount, setAmount] = useState();
  const { connect: { selectedAccount, isWalletConnected, signedAddresses, config } } = useSelector((state: any) => state.casper);

  useEffect(() => {
    if (
      !isWalletConnected ||
      selectedAccount === undefined
    ) {
      history.push(`/${stakingId}`);
    }
    // eslint-disable-next-line
  }, [isWalletConnected, selectedAccount, signedAddresses]);

  const isAddressSigned = () => {
    if (signedAddresses[`${stakingId}`]?.length) {
      const result = signedAddresses[`${stakingId}`]?.find((address: any) => address === selectedAccount.address);
      if (result) {
        return true;
      }
    }
    return false;
  };

  const performWithdraw = async () => {
    if (
      isWalletConnected &&
      selectedAccount &&
      isAddressSigned()
    ) {
      try {
        if (amount && Number(amount) > 0) {
          history.push(`/${stakingId}`);
          toast.success(`${amount} tokens are unstaked successfully`);
        } else {
          toast.error("Amount must be greater than 0");
        }
      } catch (e) {
        console.log("ERROR : ", e);
        toast.error("An error occured please see console for details");
        history.push(`/${stakingId}`);
      }
    } else {
        history.push(`/${stakingId}`);
    }
  };

  return (
    <React.Fragment>
      <FCard className={"card-submit-stake f-mb-2"}>
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
        <FInputText
          className={"f-mt-2"}
          label={"AMOUNT TO WITHDRAW"}
          placeholder={"0"}
          value={amount}
          onChange={(e: any) => {
            e.preventDefault();
            const re = /^-?\d*\.?\d*$/;
            if (e.target.value === "" || re.test(e.target.value)) {
              setAmount(e.target.value);
            }
          }}
          postfix={
            <FTypo className={"f-pr-1"} color="#dab46e">
              TOKEN
            </FTypo>
          }
        />
        {/* <FInputText
          className={"f-mt-2"}
          label={"AVAILABLE BALANCE"}
          placeholder={"0"}
          onChange={(e: any) => console.log(e.target.value)}
          disabled={true}
        />
        <FInputText
          className={"f-mt-2"}
          label={"REMAINING FROM CAP"}
          placeholder={"0"}
          onChange={(e: any) => console.log(e)}
          disabled={true}
        /> */}

        {/* <FResponseBar
          variant="error"
          title="Could send a sign request. Not enough balance."
          className="f-mb-0"
          show={true}
        ></FResponseBar> */}
        <FButton
          title={'Withdraw'}
          className="w-100 f-mt-2"
          onClick={performWithdraw}
        />
      </FCard>
    </React.Fragment>
  );
};
export default WidthCardSubmit;
