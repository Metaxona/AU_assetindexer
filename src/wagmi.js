import { getDefaultWallets } from "@rainbow-me/rainbowkit";
import { configureChains, createConfig } from "wagmi";
import { arbitrum, arbitrumGoerli, goerli, mainnet, optimism, optimismGoerli, polygon, polygonMumbai, sepolia } from "wagmi/chains";
import { publicProvider } from "wagmi/providers/public";

export const { chains, publicClient } = configureChains([arbitrum, arbitrumGoerli, goerli, mainnet, optimism, optimismGoerli, polygon, polygonMumbai, sepolia], [publicProvider()]);

const { connectors } = getDefaultWallets({
    appName: "AssetIndexer",
    projectId: "10572be452812a0d483a4ec33344be81",
    chains,
});

export const wagmiConfig = createConfig({
    autoConnect: true,
    connectors,
    publicClient,
});
