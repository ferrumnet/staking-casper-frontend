import { CLValueBuilder } from "casper-js-sdk";
import { contractInfo } from "./stringUtils";

export const convertHashStrToHashBuff = (hashStr: string) => {
    let hashHex = hashStr;
    if (hashStr.startsWith("hash-")) {
        hashHex = hashStr.slice(5);
    }
    return Buffer.from(hashHex, "hex");
};

export const setContractHash = (contractHash: string) => {
    return CLValueBuilder.key(
        CLValueBuilder.byteArray(convertHashStrToHashBuff(contractHash))
    );
}

export const getTokenHash = (token_contract: any) => {
    const info = contractInfo.find( e => e.token === token_contract);
    return info ? info["contract-hash"] : 'ba950993182bbc4a73fbcc0183c43534bdf7fa9a862db5a847cc7d726e274d9e'
}