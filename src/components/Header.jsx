import {
  Box,
  Flex,
  Avatar,
  Input,
  Button,
  Menu,
  Image,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  useDisclosure,
  useColorModeValue,
  Stack,
  useColorMode,
  Center,
  Text,
  Icon,
  Tooltip,
} from '@chakra-ui/react';
import { MoonIcon, SunIcon, CopyIcon, ArrowRightIcon } from '@chakra-ui/icons';
import shortenAddress from '../utils/shortenAddress';
import { useAccount, useDisconnect, useConnect } from 'wagmi'
import SiteIcon from '../assets/icons/assetindexericon.png'

export function Header({alchemyAPIKey, setAlchemyAPIKey}) {
  const { colorMode, toggleColorMode } = useColorMode();
  const { isOpen, onOpen, onClose } = useDisclosure();
    const { connector, address, isConnected } = useAccount()
    const { disconnect } = useDisconnect()
    const { connect, connectors, error, isLoading, pendingConnector } =
    useConnect()

  const apikeychange = (evt)=>{
    localStorage.setItem('alchemy_API_KEY', evt.target.value);
    const apiKey = localStorage.getItem("alchemy_API_KEY");
    setAlchemyAPIKey(apiKey);
  }

  return (
    <>
      <Box bg={useColorModeValue('gray.100', 'gray.900')} px={4}>
        <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
          <Flex flexDirection={'row'} gap={'1rem'} alignItems={'center'}><Image w={'2rem'} src={SiteIcon} alt="AssetIndexer" />
          <Box display={'inline-flex'}>
            <Text fontWeight={'bold'} fontSize={'x-large'}>Asset</Text><Text fontWeight={'bold'} fontSize={'x-large'} color={'#5CB9FE'}>Indexer</Text></Box>
          </Flex>

          <Flex alignItems={'center'}>
            <Stack direction={'row'} spacing={7}>
              <Button onClick={toggleColorMode}>
                {colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
              </Button>

              <Box>
              <Menu>
                <Tooltip label={`${address || "Not Connected"}`}>
                <MenuButton
                  as={Button}
                  rounded={'full'}
                  variant={'link'}
                  cursor={'pointer'}
                  minW={0}>
                    <Flex alignItems={'center'} gap={"0.5rem"} >
                        <Text display={'inline-flex'}>{address ? shortenAddress(address) : "" }</Text>
                        <Avatar size={'sm'} bg='teal.500' src={'https://picsum.photos/200'} />
                    </Flex>
                </MenuButton>
                </Tooltip>
                <MenuList alignItems={'center'}>
                    <br />
                    <Center>
                      <Avatar size={'2xl'} bg='teal.500' src={'https://picsum.photos/200'} />
                    </Center>
                    <br />
                    <Center>
                      <Tooltip label={"copy"}>
                        <Text>{address ? shortenAddress(address) : "Not Connected" }  {address && <Button size='xs' variant='ghost' onClick={() => {navigator.clipboard.writeText(address)}} > <CopyIcon /> </Button>}</Text>
                      </Tooltip>
                    </Center>
                    <br />
                    {isConnected ? <Box padding={'0.3rem'}>
                      <Text fontSize={'small'}>Alchemy API Key</Text>
                      <Input type={'password'} placeholder='Alchemy API_KEY' defaultValue={alchemyAPIKey} onChange={apikeychange} onBlur={apikeychange} />
                    </Box> : "" }
                    <MenuDivider />
                    {(!window?.ethereum) ? "No Wallet Found" 
                    : isConnected 
                    ? <MenuItem onClick={()=>disconnect()}><Flex alignItems={'center'} w={"100%"} justifyContent={'space-between'}><Text display={'inline-flex'}>Disconnect</Text> <Icon as={ArrowRightIcon} /></Flex></MenuItem>
                    : connectors.filter((x) => x.ready && x.id !== connector?.id).map((x) => ( <MenuItem key={x.id} onClick={() => connect({ connector: x })} title={`${x.name === "Injected" ? "Wallet" : x.name}`}>{x.name === "Injected" ? "Wallet" : x.name}</MenuItem>))  
                    }  
                </MenuList>
              </Menu>
              </Box>
            </Stack>
          </Flex>
        </Flex>
      </Box>
    </>
  );
}

