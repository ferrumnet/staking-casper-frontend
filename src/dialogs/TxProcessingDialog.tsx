import React from "react";
import {
  // FButton,
  FDialog,
  FList,
  FLoader,
  FTypo,
} from "ferrum-design-system";
import Loader from "./../assets/images/loading2.gif";

const TxProcessingDialog = ({
  show,
  showClose = true,
  onHide,
  message
}: any) => {
  return (
    <FDialog
      variant={"dark"}
      size={"medium"}
      onHide={() => onHide()}
      show={show}
      className="connect-wallet-dialog text-center"
      showClose={showClose}
      title={""}
    >
      <FList display="block" type="number" variant="connect-wallet">
        <img src={Loader} width={"170px"} />
        <FTypo size={20} className={"f-mb--5 f-mt--9"}> {message || 'Loading'} </FTypo>
      </FList>
      {/* <FButton onClick={onHide} title={"Close"}></FButton> */}
    </FDialog>
  );
};

export default TxProcessingDialog;
