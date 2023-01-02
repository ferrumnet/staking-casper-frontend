import { CasperClient, CasperServiceByJsonRPC } from "casper-js-sdk";
import { FDialog, FList, FTruncateText, FTypo } from "ferrum-design-system";
import { useEffect, useState } from "react";
import Loader from "./../assets/images/loaderIcon.svg";

const RPC_API = "http://44.208.234.65:7777/rpc";

const casperService = new CasperServiceByJsonRPC(RPC_API);
const casperClient = new CasperClient(RPC_API);

const ConfirmationDialog = ({
    show,
    onHide,
    message,
    transaction
  }: any) => {
    const [processing, setProcessing] = useState(false)
    const [isDone, setIsDone] = useState(false)

    const checkTransaction = async () => {
        const res = await casperService.getDeployInfo(transaction)
        if(res.execution_results.length) {
            console.log(res)
           //@ts-ignore
           if(res.execution_results[0].result.Failure) {
            //@ts-ignore
            console.log(res.execution_results[0].result.Failure.error_message, 'res[0].result.Failure')
           }
           //@ts-ignore
           if(res.execution_results[0].result.Success) {
            //@ts-ignore
            console.log(res.execution_results[0].result.Success)
           }
        }
    }
    useEffect(() => {
        if (transaction) {
            checkTransaction()
        }
    }, [transaction])

    return (
      <FDialog
        variant={"dark"}
        size={"medium"}
        onHide={() => onHide()}
        show={show}
        className="connect-wallet-dialog text-center"
        showClose={true}
        title={""}
      >
        <FList display="block" type="number" variant="connect-wallet">
          <img src={Loader} width={"120px"} />
          <FTypo size={20} className={"f-mb--5 f-mt--9"}> {message || 'Loading'} </FTypo>
          <FTypo size={15} className={"f-mb--5 f-mt--9"}>
            <FTruncateText text={transaction} />
          </FTypo>
        </FList>
        {/* <FButton onClick={onHide} title={"Close"}></FButton> */}
      </FDialog>
    );
  };
  
export default ConfirmationDialog
  