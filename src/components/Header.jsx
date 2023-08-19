import { MoonIcon, SunIcon } from "@chakra-ui/icons";
import { Box, Button, Flex, Hide, Image, Input, Link, Menu, MenuButton, MenuDivider, MenuList, Stack, Text, Tooltip, useColorMode, useColorModeValue } from "@chakra-ui/react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useEffect } from "react";
import { BiKey } from "react-icons/bi";
import { FaWallet } from "react-icons/fa";
import SiteIcon from "../assets/icons/assetindexericon.png";

export function Header({ alchemyAPIKey, setAlchemyAPIKey }) {
    const { colorMode, toggleColorMode } = useColorMode();

    useEffect(() => {
        localStorage.getItem("alchemy_API_KEY") || localStorage.setItem("alchemy_API_KEY", "demo");
        setAlchemyAPIKey(localStorage.getItem("alchemy_API_KEY"));
    }, []);

    const apikeychange = (evt) => {
        localStorage.setItem("alchemy_API_KEY", evt.target.value);
        const apiKey = localStorage.getItem("alchemy_API_KEY");
        setAlchemyAPIKey(apiKey);
    };

    return (
        <Box bg={useColorModeValue("gray.100", "gray.900")} px={4}>
            <Flex h={16} alignItems={"center"} justifyContent={"space-between"}>
                <Flex flexDirection={"row"} gap={"1rem"} alignItems={"center"}>
                    <Image w={"2rem"} src={SiteIcon} alt="AssetIndexer" />
                    <Hide below={"lg"}>
                        <Box display={"inline-flex"}>
                            <Text fontWeight={"bold"} fontSize={"x-large"}>
                                Asset
                            </Text>
                            <Text fontWeight={"bold"} fontSize={"x-large"} color={"#5CB9FE"}>
                                Indexer
                            </Text>
                        </Box>
                    </Hide>
                </Flex>

                <Flex alignItems={"center"}>
                    <Stack direction={"row"} spacing={7}>
                        <Button onClick={toggleColorMode}>{colorMode === "light" ? <MoonIcon /> : <SunIcon />}</Button>
                        <Box>
                            <Menu>
                                <Tooltip label={"Alchemy API Key"}>
                                    <MenuButton as={Button} variant={"ghost"}>
                                        <BiKey />
                                    </MenuButton>
                                </Tooltip>
                                <MenuList alignItems={"center"}>
                                    <Box padding={"0.3rem"}>
                                        <Text fontSize={"md"}>Alchemy API Key</Text>
                                        <MenuDivider />
                                        <Input type={"password"} placeholder="Alchemy API_KEY" defaultValue={alchemyAPIKey} onChange={apikeychange} onBlur={apikeychange} />
                                        <Link href={"https://docs.alchemy.com/docs/alchemy-quickstart-guide#1key-create-an-alchemy-key"} target="_blank">
                                            How To Get Your Own API Key?
                                        </Link>
                                    </Box>
                                </MenuList>
                            </Menu>
                        </Box>
                        <Box>
                            <ConnectButton
                                label={<FaWallet />}
                                accountStatus={{
                                    smallScreen: "avatar",
                                    largeScreen: "full",
                                }}
                                showBalance={{
                                    smallScreen: false,
                                    largeScreen: true,
                                }}
                            />
                        </Box>
                    </Stack>
                </Flex>
            </Flex>
        </Box>
    );
}
