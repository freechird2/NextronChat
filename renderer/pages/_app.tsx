import React from "react";
import { RecoilRoot } from "recoil";
import "styles/global.css";
import { ConfigProvider } from "antd";

export default function App({ Component, pagePros }) {
  return (
    <React.Fragment>
      <RecoilRoot>
        <ConfigProvider
          theme={{
            token: { fontFamily: "Gothic A1, sans-serif", fontSize: 16 },
          }}
        >
          <Component {...pagePros} />
        </ConfigProvider>
      </RecoilRoot>
    </React.Fragment>
  );
}
