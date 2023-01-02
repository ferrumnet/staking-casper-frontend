import React from "react";
import {
  // FButton,
  FDialog,
  FList,
  FListItem,
  FTypo,
} from "ferrum-design-system";

const AddressSelector = ({
  show,
  onHide,
  connectedAccounts,
  onAccountSelect,
}: any) => {
  return (
    <FDialog
      variant={"dark"}
      size={"large"}
      onHide={() => onHide()}
      show={show}
      className="connect-wallet-dialog text-center"
      showClose={true}
      title={"Select Account"}
    >
      <FList display="block" type="number" variant="connect-wallet">
        {connectedAccounts?.length &&
          connectedAccounts.map((account: any, index: any) => (
            <FListItem
              className={"zHigher f-p--5"}
              onClick={() => onAccountSelect(account)}
              key={index}
            >
              <FTypo
                size={15}
                color="#ffffff"
                weight={600}
                className="f-mb--5 f-mt--5"
              >
                {account.address}
              </FTypo>
            </FListItem>
          ))}
      </FList>
      {/* <FButton onClick={onHide} title={"Close"}></FButton> */}
    </FDialog>
  );
};

export default AddressSelector;
