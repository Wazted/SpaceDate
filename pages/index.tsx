import type { NextPage } from "next";
import Head from "next/head";
import {
  Flex,
  Heading,
  Spacer,
  Box,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react";
import { HamburgerIcon, StarIcon, SunIcon, MoonIcon } from "@chakra-ui/icons";

const Home: NextPage = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const colorNav = useColorModeValue("gray.50", "gray.900");
  const iconButton = useColorModeValue(<SunIcon />, <MoonIcon />);
  return (
    <>
      <Head>
        <title>Space Date</title>
        <meta
          name="description"
          content="Find any launch with your birthdate"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Flex
        p="2"
        bg={colorNav}
        borderBottom={colorMode === "light" ? "1px solid gray" : ""}
      >
        <Flex p="2" bg={colorNav}>
          <Heading size="md">Space Date</Heading>
        </Flex>
        <Spacer />
        <Box>
          <Menu>
            <MenuButton as={IconButton} icon={<HamburgerIcon />} mr="4" />
            <MenuList>
              <MenuItem icon={<StarIcon />}>Favoris</MenuItem>
            </MenuList>
          </Menu>
          <IconButton
            onClick={toggleColorMode}
            icon={iconButton}
            aria-label="ColorMode"
          />
        </Box>
      </Flex>
    </>
  );
};

export default Home;
