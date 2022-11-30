import React from "react";
// import logo from "./assets/images/logo-light.svg";

import { FLayout, FMain, FContainer } from "ferrum-design-system";
// å// import { ReactComponent as IconNetwork } from "./assets/images/Icon-connect-network.svg";
import BaseRoutes from "./Routes";
import { Toaster } from "react-hot-toast";
import Header from "./header/header";

function App() {
  return (
    <div className="App">
      <Toaster position="top-right" />
      <FLayout themeBuilder={false} FsiderLayoutState={true}>
        <FContainer width={1200} className="f-pl-1 f-pr-1">
          <Header />
          <FMain>
            {/* <FResponseBar
              variant="error"
              title="You are connected to POLYGON. Please connect to ETHEREUM for the current staking"
            /> */}
            <BaseRoutes />
          </FMain>
        </FContainer>
      </FLayout>
    </div>
  );
}

export default App;
