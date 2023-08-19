import { RepeatIcon } from "@chakra-ui/icons";
import { Box, ChakraProvider, Flex, Heading, Hide, Icon, Select, Spinner, Text, Tooltip, useToast } from "@chakra-ui/react";
import { Alchemy, Network } from "alchemy-sdk";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { NftCard, TokenCard } from "./components/Cards";
import { Header } from "./components/Header";
import Footer from "./components/Footer";

const networks = {
    eth: Network.ETH_MAINNET,
    polygon: Network.MATIC_MAINNET,
    arbitrum: Network.ARB_MAINNET,
    optimism: Network.OPT_MAINNET,
    goerli: Network.ETH_GOERLI,
    maticmumbai: Network.MATIC_MUMBAI,
    arbitrumgoerli: Network.ARB_GOERLI,
    optimismgoerli: Network.OPT_GOERLI,
    ethsepolia: Network.ETH_SEPOLIA,
};

const oslink = {
    eth: "etheruem",
    polygon: "matic",
    arbitrum: "arbitrum",
    optimism: "optimism",
    goerli: "goerli",
    maticmumbai: "maticmumbai",
    arbitrumgoerli: "arbitrumgoerli",
    optimismgoerli: "optimismgoerli",
    ethsepolia: "ethsepolia",
};

// TODO: Add Search Assets Owned By Address
// TODO: Add a Load More Infinite Scrolling

function App() {
    const toast = useToast();
    const { address, isConnected } = useAccount();
    const [alchemyAPIKey, setAlchemyAPIKey] = useState(localStorage.getItem("alchemy_API_KEY") || "demo");
    const [isLoading, setIsLoading] = useState(false);
    const [hasQueried, setHasQueried] = useState(false);
    const [isRefreshed, setIsRefreshed] = useState(false);
    const [hasErrors, setHasErrors] = useState(false);

    const [currentNetwork, setCurrentNetwork] = useState(networks[localStorage.getItem("currentNetwork") || "eth"]);
    const [openSeaNetwork, setOpenSeaNetwork] = useState(oslink[currentNetwork]);
    const [assetDisplay, setAssetDisplay] = useState(localStorage.getItem("selectedAsset") || "TOKEN");

    const [results, setResults] = useState([]);
    const [tokenDataObjects, setTokenDataObjects] = useState([]);
    const [nftData, setNftData] = useState([]);

    useEffect(() => {
        setHasQueried(false);

        const config = {
            apiKey: alchemyAPIKey,
            network: currentNetwork,
        };

        const alchemy = new Alchemy(config);

        async function getTokenBalance() {
            try {
                setIsLoading(true);

                const data = await alchemy.core.getTokenBalances(address);

                setResults(data);

                const tokenDataPromises = [];

                for (let i = 0; i < data.tokenBalances.length; i++) {
                    const tokenData = alchemy.core.getTokenMetadata(data.tokenBalances[i].contractAddress);
                    tokenDataPromises.push(tokenData);
                }

                const allTokenData = await Promise.all(tokenDataPromises);

                setTokenDataObjects(
                    allTokenData.map((item, index) => {
                        item.address = data.tokenBalances[index].contractAddress;
                        return item;
                    }),
                );
                setHasQueried(true);
                setIsLoading(false);
                setHasErrors(false);
            } catch (error) {
                setHasQueried(false);
                setIsLoading(false);
                setHasErrors(true);
                toast({
                    title: `${error.name}`,
                    description: `${error.message}` || `${error.stack}`,
                    status: "error",
                    duration: 9000,
                    containerStyle: {
                        w: "90dvw",
                        maxH: "20dvh",
                        overflowY: "scroll",
                    },
                    position: "top-right",
                    isClosable: true,
                });
            }
        }

        async function getNFTBalance() {
            try {
                setIsLoading(true);

                const NFTData = await alchemy.nft.getNftsForOwner(address);

                setNftData(NFTData.ownedNfts || []);
                setHasQueried(true);
                setIsLoading(false);
                setHasErrors(false);
            } catch (error) {
                setHasQueried(false);
                setIsLoading(false);
                setHasErrors(true);
                toast({
                    title: error.name,
                    description: error.message || error.stack,
                    status: "error",
                    duration: 9000,
                    containerStyle: {
                        w: "90dvw",
                        maxH: "20dvh",
                        overflowY: "scroll",
                    },
                    position: "top-right",
                    isClosable: true,
                });
            }
        }

        isConnected && assetDisplay === "TOKEN" && getTokenBalance();
        isConnected && assetDisplay === "NFT" && getNFTBalance();
    }, [address, isRefreshed, currentNetwork, assetDisplay, alchemyAPIKey, isConnected]);

    function setNetwork(network) {
        setOpenSeaNetwork(oslink[network]);
        setCurrentNetwork(networks[network]);
    }

    useEffect(() => {
        localStorage.getItem("currentNetwork") || localStorage.setItem("currentNetwork", "eth");
        localStorage.getItem("selectedAsset") || localStorage.setItem("selectedAsset", "TOKEN");

        setNetwork(localStorage.getItem("currentNetwork"));
        setAssetDisplay(localStorage.getItem("selectedAsset"));
    }, []);

    function onChangeNetwork(event) {
        localStorage.setItem("currentNetwork", event.target.value);
        setNetwork(localStorage.getItem("currentNetwork"));
    }

    function onChangeAsset(event) {
        localStorage.setItem("selectedAsset", event.target.value);
        setAssetDisplay(localStorage.getItem("selectedAsset"));
    }

    return (
        <ChakraProvider>
            <Header alchemyAPIKey={alchemyAPIKey} setAlchemyAPIKey={setAlchemyAPIKey} />
            <Flex h={"100dvh"} padding={"1rem"} flexDirection={"column"}>
                <Flex flexDirection={"row"} gap={"1rem"} alignItems={"center"} flexWrap={"wrap"} mb={3}>
                    <Flex alignItems={"center"} gap={"1rem"}>
                        <Text>Network: </Text>
                        <Select maxW={"12rem"} onChange={onChangeNetwork} value={localStorage.getItem("currentNetwork") || "eth"}>
                            <option value="eth">Ethereum</option>
                            <option value="polygon">Polygon</option>
                            <option value="optimism">Optimism</option>
                            <option value="arbitrum">Arbitrum</option>
                            <option value="ethsepolia">Sepolia (Ethereum)</option>
                            <option value="maticmumbai">Mumbai (Polygon)</option>
                            <option value="goerli">Goerli (Ethereum)</option>
                            <option value="arbitrumgoerli">Goerli (Arbitrum)</option>
                            <option value="optimismgoerli">Goerli (Optimism)</option>
                        </Select>
                    </Flex>

                    <Flex alignItems={"center"} gap={"1rem"}>
                        <Text>Asset: </Text>
                        <Select maxW={"12rem"} onChange={onChangeAsset} value={localStorage.getItem("selectedAsset") || "TOKEN"}>
                            <option value="TOKEN">Token</option>
                            <option value="NFT">NFT</option>
                        </Select>
                    </Flex>
                </Flex>

                <Flex flexDirection="column" alignItems="center" justifyContent={"start"} gap={"1rem"}>
                    <Flex flexDirection={"row"} gap={"1rem"} alignItems={"center"} flexWrap={"wrap"}>
                        <Heading>{assetDisplay}</Heading>
                        <Tooltip label="Refresh">
                            <Icon as={RepeatIcon} fontSize={20} onClick={() => setIsRefreshed(!isRefreshed)} />
                        </Tooltip>
                    </Flex>

                    <Flex w={"100dvw"} gap={"1rem"} flexDirection={"row"} flexWrap={"wrap"} justifyContent={"center"}>
                        {isLoading && <Spinner />}

                        {!isLoading && hasErrors && <Text p={"0.5rem"}>An Error Has Occurred! You May Be Rate Limited, Please Use A Proper Alchemy API Key For A Better Experience</Text>}

                        {isConnected && assetDisplay === "TOKEN" && hasQueried && tokenDataObjects?.length === 0 && <Text>No Tokens Found</Text>}
                        {isConnected && assetDisplay === "NFT" && hasQueried && nftData.length === 0 && <Text>No NFTs Found</Text>}

                        {assetDisplay === "TOKEN" &&
                            hasQueried &&
                            !hasErrors &&
                            results?.tokenBalances.length !== 0 &&
                            results.tokenBalances.map((e, i) => {
                                return <TokenCard key={`token-${i}-${tokenDataObjects[i].symbol}-${tokenDataObjects[i].name}`} tokenDataObjects={tokenDataObjects} index={i} element={e} />;
                            })}

                        {assetDisplay === "NFT" && hasQueried && !hasErrors && nftData.length !== 0 && nftData.map((item) => <NftCard key={`nft-${item.contract.address}-${item.tokenId}`} nftInfo={item} openSeaNetwork={openSeaNetwork} />)}
                    </Flex>
                </Flex>
            </Flex>
            <Hide below={"lg"}>
                <Footer />
            </Hide>
        </ChakraProvider>
    );
}

export default App;
