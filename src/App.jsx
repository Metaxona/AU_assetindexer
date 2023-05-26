import {
  Box,
  Button,
  Center,
  ChakraProvider,
  Flex,
  Heading,
  Image,
  Popover,
  PopoverTrigger,
  PopoverContent,
  Badge,
  Text,
  Icon,
  Spinner,
  Tooltip,
  Card,
  CardBody,
  CardHeader,
  Avatar,
  Link
} from '@chakra-ui/react';
import { Alchemy, Network, Utils } from 'alchemy-sdk';
import { useState } from 'react';
// import { Connect } from './components/Connect';
import { Header } from './components/Header';
import { useAccount } from 'wagmi'
import { RepeatIcon } from '@chakra-ui/icons'
import { useEffect } from 'react';
import { IPFStoHTTP } from './utils/ipfstohttps'
import OSLogo from './assets/icons/Logomark-Blue.png'

const networks = {
  mainnet: Network.ETH_MAINNET,
  maticmainnet: Network.MATIC_MAINNET,
  optimism: Network.OPT_MAINNET,
  arbitrum: Network.ARB_MAINNET,
  goerli: Network.ETH_GOERLI,
  maticmumbai: Network.MATIC_MUMBAI,
  arbitrumgoerli: Network.ARB_GOERLI,
  optimismgoerli: Network.OPT_GOERLI,
  sepolia: Network.ETH_SEPOLIA,
}


function App() {
  const { address } = useAccount()
  const [currentNetwork, setCurrentNetwork] = useState(networks.mainnet);
  const [currentNetworkName, setCurrentNetworkName] = useState("ETH");
  const [results, setResults] = useState([]);
  const [hasQueried, setHasQueried] = useState(false);
  const [tokenDataObjects, setTokenDataObjects] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshed, setIsRefreshed] = useState(false);
  const [assetDisplay, setAssetDisplay] = useState("TOKEN")
  const [nftData, setNftData] = useState([])
  const [alchemyAPIKey, setAlchemyAPIKey] = useState("demo")
  const [fetchError, setFetchError] = useState(null)
  const [openSeaNetwork, setOpenSeaNetwork] = useState("ethereum")

  useEffect(()=>{
    setHasQueried(false)
    const config = {
      apiKey: alchemyAPIKey,
      network: currentNetwork,
    };
    const alchemy = new Alchemy(config);
    
    async function getTokenBalance() {
      try{
        setIsLoading(true)
  
        const data = await alchemy.core.getTokenBalances(address);
    
        setResults(data);
    
        const tokenDataPromises = [];
    
        for (let i = 0; i < data.tokenBalances.length; i++) {
          const tokenData = alchemy.core.getTokenMetadata(
            data.tokenBalances[i].contractAddress
          );
          tokenDataPromises.push(tokenData);
        }
    
        setTokenDataObjects(await Promise.all(tokenDataPromises));
        setHasQueried(true);
        setIsLoading(false)
        setFetchError(null)
      }
      catch(e){
        setFetchError(`${e.message}`)
        setHasQueried(false);
        setIsLoading(false)
      }
    }

    async function getNFTBalance() {
      try{
        setIsLoading(true)
  
        const NFTData = await alchemy.nft.getNftsForOwner(address);
  
        setNftData(NFTData.ownedNfts)
        setHasQueried(true);
        setIsLoading(false)
        setFetchError(null)
      }
      catch(e){
        setFetchError(`${e.message}`)
        setHasQueried(false);
        setIsLoading(false)
      }
    }

    address ? ((assetDisplay === "TOKEN") ? getTokenBalance() : getNFTBalance() ) : setHasQueried(false)
  }, [address, isRefreshed, currentNetwork, assetDisplay])

  function setNetwork(network){
    setCurrentNetworkName(network.toUpperCase())
    const oslink = {
      "eth" : "etheruem",
      "polygon" : "matic",
      "arbitrum" : "arbitrum",
      "optimism" : "optimism",
      "goerli": "goerli",
      "maticmumbai": "maticmumbai",
      "arbitrumgoerli": "arbitrumgoerli",
      "optimismgoerli": "optimismgoerli",
      "ethsepolia": "ethsepolia"
    }
    setOpenSeaNetwork(oslink[network])
    if(network === "eth") return setCurrentNetwork(networks.mainnet);
    if(network === "polygon") return setCurrentNetwork(networks.maticmainnet);
    if(network === "optimism") return setCurrentNetwork(networks.optimism);
    if(network === "arbitrum") return setCurrentNetwork(networks.arbitrum);
    if(network === "goerli") return setCurrentNetwork(networks.goerli);
    if(network === "maticmumbai") return setCurrentNetwork(networks.maticmumbai);
    if(network === "arbitrumgoerli") return setCurrentNetwork(networks.arbitrumgoerli);
    if(network === "optimismgoerli") return setCurrentNetwork(networks.optimismgoerli);
    if(network === "ethsepolia") return setCurrentNetwork(networks.sepolia);
  }



  return (<ChakraProvider>
  <Header alchemyAPIKey={alchemyAPIKey} setAlchemyAPIKey={setAlchemyAPIKey} />
  <Box w="100vw" padding={'1rem'}>

      <Flex flexDirection={'row'} gap={"1rem"} alignItems={'center'} flexWrap={'wrap'} mb={3} >
        <Text>Networks: </Text>
        
        <Button key={"eth-network-button"} onClick={()=>setNetwork("eth")}>ETH</Button>
        <Button key={"polygon-network-button"} onClick={()=>setNetwork("polygon")}>POLYGON</Button>
        <Button key={"optimism-network-button"} onClick={()=>setNetwork("optimism")}>OPTIMISM</Button>
        <Button key={"arbitrum-network-button"} onClick={()=>setNetwork("arbitrum")}>ARBITRUM</Button>
      </Flex>

      <Flex flexDirection={'row'} gap={"1rem"} alignItems={'center'} flexWrap={'wrap'} mb={3} >
        <Text>Test Networks: </Text>

        <Button key={"goerli-network-button"} onClick={()=>setNetwork("goerli")}>ETH (GOERLI)</Button>
        <Button key={"maticmumbai-network-button"} onClick={()=>setNetwork("maticmumbai")}>POLYGON (MUMBAI)</Button>
        <Button key={"arbitrumgoerli-network-button"} onClick={()=>setNetwork("arbitrumgoerli")}>ARBITRUM (GOERLI)</Button>
        <Button key={"optimismgoerli-network-button"} onClick={()=>setNetwork("optimismgoerli")}>OPTIMISM (GOERLI)</Button>
        <Button key={"sepolia-network-button"} onClick={()=>setNetwork("ethsepolia")}>ETH (SEPOLIA)</Button>
      </Flex>

      <Flex alignItems={'center'} justifyContent={"start"} gap={"1rem"} flexDirection={'row'} mb={3} >
        <Heading fontSize={36}>Assets: {currentNetworkName} </Heading>
        <Tooltip label="Refresh" ><Icon as={RepeatIcon} fontSize={20} onClick={()=>setIsRefreshed(!isRefreshed)} /></Tooltip>
      </Flex>
      
      <Flex w="100%" flexDirection="column" alignItems="center" justifyContent={'start'} gap={'1rem'} >
        
        <Flex flexDirection={'row'} gap={"1rem"} alignItems={'center'} flexWrap={'wrap'} >
          <Button key={"assetType-Token"} onClick={()=>setAssetDisplay("TOKEN")}>TOKENS</Button>
          <Button key={"assetType-Nft"} onClick={()=>setAssetDisplay("NFT")}>NFT</Button>
        </Flex>

        <Heading>{assetDisplay}</Heading>
        
        {fetchError && <Flex flexDirection={'column'} gap={'1rem'}>
          <Text>Failed To Fetch Data: A Problem Has Occured!</Text>  
          <Popover> 
            <PopoverTrigger>
              <Button>More Info</Button>
            </PopoverTrigger> 
            <PopoverContent padding={'0.5rem'} >{fetchError}</PopoverContent>
          </Popover>
          </Flex>}

        {isLoading 
        ? <Spinner  /> 
        : (assetDisplay === "TOKEN") 
        ? (hasQueried && (
            <Flex w={'100vw'} gap={"1rem"} padding={"1rem"} flexWrap={"wrap"} justifyContent={'center'} >
            {(results?.tokenBalances.length) === 0 ? <Text>No Tokens Found</Text> : results.tokenBalances.map((e, i) => {
              return (
                <Card px={'1rem'} py={"0.5rem"} minW={'17rem'}  w={'20rem'} key={e.id}  direction={{ base: 'row', xs: 'column', sm: 'column', md: 'row', lg: 'row', xl: 'row' }} alignItems={'center'} >
                  <CardHeader>
                    <Flex key={e.id + "-flex"} alignItems={'center'} gap={"0.5rem"} >
                      <Avatar key={e.id + "-icon"} src={tokenDataObjects[i]?.logo ? tokenDataObjects[i].logo : "https://www.clipartmax.com/png/full/119-1193322_token-clip-art.png" } />
                      <Box>
                        <Heading size={36} key={e.id + "-symbol"} wordBreak={'break-word'}>{tokenDataObjects[i].symbol}</Heading>
                        <Text key={e.id + "-name"} wordBreak={'break-word'} size={5} >{tokenDataObjects[i].name}</Text>
                        <Text key={e.id + "-balance"}>
                          {parseFloat(Number(Utils.formatUnits(e.tokenBalance, tokenDataObjects[i].decimals)).toFixed(4))} &nbsp;
                          {/* <Tag maxW={'4rem'} whiteSpace={'nowrap'} overflow={'hidden'} textOverflow={'ellipsis'} colorScheme='grey' borderRadius='full' variant='solid' p={2}>${tokenDataObjects[i].symbol}</Tag> */}
                        </Text>
                      </Box>
                    </Flex>
                  </CardHeader>
                </Card>
              );
            })}
          </Flex>
        )) 
        :(hasQueried &&        
          <Flex w={'100vw'} gap={"1rem"} padding={"1rem"} flexWrap={"wrap"} justifyContent={'center'} >
                {(nftData.length) === 0 ? <Text>No NFTs Found</Text> : nftData.map((item)=>
                <Card key={item.contract.address + item.tokenId + "-card"} minW={'17rem'} w={'20rem'} padding={"0.5rem"} >
                  <CardHeader key={item.contract.address+ "-cardheader"} >
                    <Badge key={item.contract.address+ "-tokenType"} padding={'0.5rem'} variant='outline' colorScheme='blue' mb={2} >{item.contract.tokenType}</Badge>
                    <Image aspectRatio={1} w={"100%"} key={item.contract.address+ "-tokenImage"} alt={item.contract.name || item.contract?.openSea?.collectionName || item.title} src={IPFStoHTTP(item.rawMetadata?.image_url || item.rawMetadata?.image || item.contract?.openSea.imageUrl || "https://xdc.blocksscan.io/_nuxt/img/nft-placeholder.813e0c0.svg")} />
                  </CardHeader>
                  <CardBody key={item.contract.address+ "-cardbody"} >
                    <Tooltip label={`click to copy: ${item.tokenId}`}>
                      <Badge cursor={'pointer'} key={item.contract.address+ "-tokenIdBadge"} padding={'0.5rem'} variant='outline' colorScheme='green' mb={2} onClick={()=>{navigator.clipboard.writeText(item.tokenId)}} >ID: {`${item.tokenId}`.length > 8 ? `${item.tokenId.substring(0, 7)}...` : item.tokenId}</Badge>
                    </Tooltip>
                  <Heading key={item.contract.address+ "-tokenName"} fontSize={'medium'} wordBreak={'break-word'}>{item.title || `${item.contract.address} [Id: ${item.tokenId}]`} </Heading>
                  <Text key={item.contract.address+ "-collectionName"}>{item.contract.name || item.contract?.openSea?.collectionName || ""}</Text>
                  {item.contract.openSea.floorPrice && <Text>Floor Price: {item.contract.openSea.floorPrice}</Text>}
                  <Link key={item.contract.address+ "-openseaLink"} target='_blank' href={`https://opensea.io/assets/${openSeaNetwork}/${item.contract.address}/${item.tokenId}`}>
                    <Image src={OSLogo} alt='Opensea' title={`https://opensea.io/assets/${openSeaNetwork}/${item.contract.address}/${item.tokenId}`} w={'2rem'} mt={2} /> 
                  </Link>
                  </CardBody>
                </Card>
                )}
          </Flex>
          )}

      </Flex>

    </Box>
    </ChakraProvider>
  );
}

export default App;
