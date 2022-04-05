import type { NextPage } from "next";
import NextLink from 'next/link'
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
  Center,
} from "@chakra-ui/react";
import { HamburgerIcon, StarIcon, SunIcon, MoonIcon } from "@chakra-ui/icons";
import { useDispatch, useSelector } from "react-redux";
import { SET_DATE } from "../store/types";
import DatePicker from "../components/DatePicker";
import { useEffect } from "react";

const Home: NextPage = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const colorNav = useColorModeValue("gray.50", "gray.900");
  const iconButton = useColorModeValue(<SunIcon />, <MoonIcon />);
  const dispatch = useDispatch();
  const oldDate = useSelector((state: any) => state.date);

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
          <NextLink _hover={{ textDecoration: 'none' }} href="/" passHref>
            <Heading size="md">Space Date</Heading>
          </NextLink>
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
      <Flex alignItems="center" justifyContent="center">
        <Center>
          <Flex direction="column" alignItems="center"  my="32vh">
            <Heading mb={2}>{!oldDate.loading && oldDate.date.split("T")[0]}</Heading>
            <DatePicker />
            <NextLink href='/launchs'>go launchs</NextLink>
          </Flex>
        </Center>
      </Flex>
    </>
  );
};

export default Home;
