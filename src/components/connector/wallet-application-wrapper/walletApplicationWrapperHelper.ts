export const getFilteredAssets = (tokens: any, groupTokenConfigs: any) => {
  const toReturn : any = {};
  const groupTokenConfigsSet = new Set<string>(groupTokenConfigs);

  // console.log("Global tokens = ", tokens);
  // console.log("Group token configs = ", groupTokenConfigs);
  // console.log("Group token configs as set = ",groupTokenConfigsSet);

  tokens.forEach((tl: any) => {
    // console.log(tl.currency)
    // console.log(groupTokenConfigsSet.has(tl.currency))
    if (groupTokenConfigsSet.has(tl.currency)) {
      toReturn[tl.currency]= tl;
    }
  });

  return toReturn;
};
