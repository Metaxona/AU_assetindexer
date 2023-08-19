import { Badge, Box, Button, Card, Flex, Heading, Image, Link, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, ModalCloseButton, ModalOverlay, SimpleGrid, Text, Tooltip, useDisclosure, useToast } from "@chakra-ui/react";
import { Utils } from "alchemy-sdk";
import OSLogo from "../assets/icons/Logomark-Blue.png";
import ERC1155Icon from "../assets/images/ERC1155.svg";
import ERC20Icon from "../assets/images/ERC20.svg";
import ERC721Icon from "../assets/images/ERC721.svg";
import { IPFStoHTTP } from "../utils/ipfstohttps";

const openseaNetworks = ["etheruem", "matic", "arbitrum", "optimism"];

const getDefaultNFTIcon = (nftType) => {
    if (nftType === "ERC721") return ERC721Icon;
    if (nftType === "ERC1155") return ERC1155Icon;
};

export function TokenCard({ tokenDataObjects, index, element }) {
    const toast = useToast();

    return (
        <Card px={"1rem"} py={"0.5rem"} w={"15rem"}>
            <Flex alignItems={"center"} gap={"0.5rem"}>
                <Image w={"5rem"} h={"5rem"} src={tokenDataObjects[index]?.logo ? tokenDataObjects[index].logo : ERC20Icon} />
                <Box>
                    <Heading size={"sm"} noOfLines={1} overflowWrap={"anywhere"}>
                        {tokenDataObjects[index].symbol}
                    </Heading>
                    <Tooltip label={`click to copy contract address: ${tokenDataObjects[index].address}`}>
                        <Text
                            noOfLines={1}
                            size={5}
                            overflowWrap={"anywhere"}
                            cursor={"pointer"}
                            onClick={() => {
                                navigator.clipboard.writeText(tokenDataObjects[index].address);
                                toast({
                                    title: "Copied Successfully",
                                    description: `${tokenDataObjects[index].address}`,
                                    duration: 5000,
                                    status: "success",
                                    isClosable: true,
                                    position: "top-right",
                                    containerStyle: {
                                        w: "90dvw",
                                        maxH: "20dvh",
                                        overflowY: "scroll",
                                    },
                                });
                            }}
                        >
                            {tokenDataObjects[index].name}
                        </Text>
                    </Tooltip>
                    <Text>{parseFloat(Number(Utils.formatUnits(element.tokenBalance, tokenDataObjects[index].decimals)).toFixed(4))}</Text>
                </Box>
            </Flex>
        </Card>
    );
}

export function NftCard({ nftInfo, openSeaNetwork }) {
    const toast = useToast();
    const { isOpen, onOpen, onClose } = useDisclosure();

    return (
        <>
            <Card minW={"11rem"} maxW={"19rem"} w={"11rem"} padding={"0.5rem"}>
                <Image aspectRatio={1} w={"100%"} alt={nftInfo.contract.name || nftInfo.contract?.openSea?.collectionName || nftInfo.title} src={IPFStoHTTP(nftInfo.rawMetadata?.image || getDefaultNFTIcon(nftInfo.contract.tokenType))} />

                <Flex h={"100%"} flexDirection={"column"} mb={"0.2rem"}>
                    <Flex gap={"0.3rem"} mt={"0.5rem"}>
                        <Badge padding={"0.1rem"} variant="outline" colorScheme="blue" mb={2}>
                            {nftInfo.contract.tokenType}
                        </Badge>
                        <Tooltip label={`click to copy: ${nftInfo.tokenId}`}>
                            <Badge
                                cursor={"pointer"}
                                padding={"0.1rem"}
                                variant="outline"
                                colorScheme="green"
                                mb={2}
                                onClick={() => {
                                    navigator.clipboard.writeText(nftInfo.tokenId);
                                    toast({
                                        title: "Copied Successfully",
                                        description: `${nftInfo.tokenId}`,
                                        duration: 5000,
                                        status: "success",
                                        isClosable: true,
                                        position: "top-right",
                                        containerStyle: {
                                            w: "90dvw",
                                            maxH: "20dvh",
                                            overflowY: "scroll",
                                        },
                                    });
                                }}
                            >
                                ID: {`${nftInfo.tokenId}`.length > 8 ? `${nftInfo.tokenId.substring(0, 7)}...` : nftInfo.tokenId}
                            </Badge>
                        </Tooltip>
                    </Flex>
                    <Flex>
                        {nftInfo?.balance && nftInfo.contract.tokenType === "ERC1155" && (
                            <Tooltip label={`click to copy: ${nftInfo.balance}`}>
                                <Badge
                                    isTruncated
                                    cursor={"pointer"}
                                    padding={"0.1rem"}
                                    variant="outline"
                                    colorScheme="blue"
                                    mb={2}
                                    onClick={() => {
                                        navigator.clipboard.writeText(nftInfo.balance);
                                        toast({
                                            title: "Copied Successfully",
                                            description: `${nftInfo.balance}`,
                                            duration: 5000,
                                            status: "success",
                                            isClosable: true,
                                            position: "top-right",
                                            containerStyle: {
                                                w: "90dvw",
                                                maxH: "20dvh",
                                                overflowY: "scroll",
                                            },
                                        });
                                    }}
                                >
                                    Amount {nftInfo.balance}
                                </Badge>
                            </Tooltip>
                        )}
                    </Flex>

                    <Text size={"sm"} noOfLines={1}>
                        {nftInfo.title || `${nftInfo.contract.address} [Id: ${nftInfo.tokenId}]`}{" "}
                    </Text>

                    <Tooltip label={`click to copy contract address: ${nftInfo.contract.address}`}>
                        <Text
                            noOfLines={1}
                            cursor={"pointer"}
                            onClick={() => {
                                navigator.clipboard.writeText(nftInfo.contract.address);
                                toast({
                                    title: "Copied Successfully",
                                    description: `${nftInfo.contract.address}`,
                                    duration: 5000,
                                    status: "success",
                                    isClosable: true,
                                    position: "top-right",
                                    containerStyle: {
                                        w: "90dvw",
                                        maxH: "20dvh",
                                        overflowY: "scroll",
                                    },
                                });
                            }}
                        >
                            {nftInfo.contract.name || nftInfo.contract?.openSea?.collectionName || nftInfo.contract.address}
                        </Text>
                    </Tooltip>

                    {nftInfo.contract?.openSea?.floorPrice && <Text>Floor Price: {nftInfo.contract.openSea.floorPrice}</Text>}

                    {openseaNetworks.includes(openSeaNetwork) && (
                        <Link target="_blank" href={`https://opensea.io/assets/${openSeaNetwork}/${nftInfo.contract.address}/${nftInfo.tokenId}`}>
                            <Image src={OSLogo} alt="Opensea" title={`https://opensea.io/assets/${openSeaNetwork}/${nftInfo.contract.address}/${nftInfo.tokenId}`} w={"2rem"} mt={2} />
                        </Link>
                    )}
                    <Button mt={"0.5rem"} onClick={onOpen}>
                        Attributes
                    </Button>
                </Flex>
            </Card>

            <Modal isOpen={isOpen} onClose={onClose} isCentered>
                <ModalOverlay />
                <ModalContent m={"1rem"}>
                    <ModalHeader>
                        <Text fontSize={"large"}>Attributes: </Text>
                        <ModalCloseButton />
                    </ModalHeader>
                    <ModalBody>
                        <SimpleGrid minChildWidth={"7rem"} spacing={"0.5rem"}>
                            {nftInfo.rawMetadata?.attributes?.map((itm) => (
                                <Card key={`attrib-${itm.trait_type}-${nftInfo.contract.address}-${nftInfo.tokenId}`} textAlign={"center"} padding={"0.5rem"}>
                                    <Text fontSize={"large"} fontWeight={"bold"}>
                                        {itm.value}
                                    </Text>
                                    <Text fontSize={"small"}>{itm.trait_type}</Text>
                                </Card>
                            ))}
                        </SimpleGrid>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    );
}
