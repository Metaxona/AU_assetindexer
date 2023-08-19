import { RainbowKitProvider, darkTheme, lightTheme } from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
import React from "react";
import ReactDOM from "react-dom/client";
import { WagmiConfig, mainnet } from "wagmi";
import App from "./App";
import "./index.css";
import { chains, wagmiConfig } from "./wagmi";

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <WagmiConfig config={wagmiConfig}>
            <RainbowKitProvider chains={chains} initialChain={mainnet} theme={{ lightMode: lightTheme(), darkMode: darkTheme() }}>
                <App />
            </RainbowKitProvider>
        </WagmiConfig>
    </React.StrictMode>,
);
