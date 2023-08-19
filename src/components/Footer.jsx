import { Box, Flex, Heading, Link, Text, useColorModeValue } from "@chakra-ui/react";
import { FaGithub } from "react-icons/fa";

export default function Footer() {
    return (
        <Box bg={useColorModeValue("gray.100", "gray.900")} p={"1rem"} position={"absolute"} bottom={0} w={"100dvw"} h={"4rem"}>
            <Flex justifyContent={"space-between"}>
                <Flex alignItems={"center"}>
                    <Heading size={"sm"}>Asset</Heading>
                    <Heading size={"sm"}>Indexer</Heading>
                </Flex>
                <Flex alignItems={"center"} gap={"0.2rem"}>
                    <Text>Metaxona</Text>
                    <Text>©</Text>
                    <Text>{new Date().getFullYear()}</Text>
                </Flex>
                <Flex gap={"1rem"} mr={"2rem"} alignItems={"center"}>
                    <Link href={"https://github.com/Metaxona/AU_assetindexer"} target="_blank">
                        <FaGithub />
                    </Link>
                </Flex>
            </Flex>
        </Box>
    );
}
