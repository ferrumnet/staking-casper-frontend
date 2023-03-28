import { CasperClient, CasperServiceByJsonRPC } from "casper-js-sdk";
import { FDialog, FList, FTruncateText, FTypo, FLink } from "ferrum-design-system";
import { useEffect, useState } from "react";
import Loader from "./../assets/images/loaderIcon.svg";
import Success from "./../assets/images/SuccessIcon.svg";
import Failure from "./../assets/images/FailureIcon.svg";
import LoaderGif from "./../assets/images/loading2.gif";

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
    const [isSuccessful, setIsSuccessful] = useState(false)
    const [isDone, setIsDone] = useState(false)
    const [intervalId, setIntervalId] = useState(null as any)

    const checkTransaction = async () => {
        setProcessing(true)
        const res = await casperService.getDeployInfo(transaction)
        console.log(res);
        if(res.execution_results.length) {
            console.log(res)
           //@ts-ignore
           if(res.execution_results[0].result.Failure) {
            //@ts-ignore
            console.log(res.execution_results[0].result.Failure.error_message, 'res[0].result.Failure')
            setProcessing(false)
            setIsDone(true)
            setIsSuccessful(false)
           }
           //@ts-ignore
           if(res.execution_results[0].result.Success) {
            //@ts-ignore
            console.log(res.execution_results[0].result.Success)
            setProcessing(false)
            setIsDone(true)
            setIsSuccessful(true)

           }
        }
    }
    useEffect(() => {
        console.log(transaction, isDone)
        if (transaction && !isDone) {
          let intervalId = setInterval(
            () =>  checkTransaction()
          , 5000)
          setIntervalId(intervalId)
        }

        if (transaction && isDone) {
          console.log(intervalId)
          clearInterval(intervalId)
        }
    }, [transaction, isDone])

    useEffect(() => {
      return () => {
        setIsDone(false)
        setIsSuccessful(false)
        setProcessing(false)
      }
    }, [])

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
          {
            isDone && transaction ?
              isSuccessful ?
                <img src={Success} width={"120px"} />
              : <img src={Failure} width={"120px"} />
            : transaction && processing ?
              <img src={LoaderGif} width={"120px"} />
            : <img src={Loader} width={"120px"} />
          }
          <FTypo size={20} className={"f-mb--5 f-mt--9"}> 
            {
              isDone && transaction ?
               isSuccessful ?
                  ('Transaction processed successfully')
               : ('Transaction failed on chain')
              :  (message || 'Loading')
            }
          </FTypo>
          <a href={`https://testnet.cspr.live/deploy/${transaction}`} target="_blank" style={{"color": "white"}}>
            <FTypo size={15} className={"f-mb--5 f-mt--9"}>
              <FTruncateText text={transaction} />
            </FTypo>
          </a>
        </FList>
        {/* <FButton onClick={onHide} title={"Close"}></FButton> */}
      </FDialog>
    );
  };
  
export default ConfirmationDialog
  