import type { NextPage } from "next";
import axios from "axios";
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
  Text,
  Button,
} from "@chakra-ui/react";
import { HamburgerIcon, StarIcon, SunIcon, MoonIcon } from "@chakra-ui/icons";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import moment from "moment";
import NextLink from "next/link";

const Launchs: NextPage = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const [customLink, setCustomLink] = useState("");
  const [launchList, setLaunchList] = useState({results: [], previous: '', next: ''});
  const colorNav = useColorModeValue("gray.50", "gray.900");
  const iconButton = useColorModeValue(<SunIcon />, <MoonIcon />);
  const dispatch = useDispatch();
  const selectedDate = useSelector((state: any) => state.date);

  useEffect(() => {
    if (selectedDate.date) {
      console.log(selectedDate, moment(selectedDate.date));
      const dateParsed = moment(selectedDate.date);
      console.log(
        dateParsed,
        dateParsed.year(),
        `https://ll.thespacedevs.com/2.2.0/launch/?net__gte=${dateParsed.year()}-01-01T00%3A00%3A00Z&net__lte=${dateParsed.year()}-12-31T00%3A00%3A00Z&is_crewed=false&include_suborbital=true&related=false`
      );
      axios
        .get(
          customLink
            ? customLink
            : `https://lldev.thespacedevs.com/2.2.0/launch/?net__gte=${dateParsed.year()}-01-01T00%3A00%3A00Z&net__lte=${dateParsed.year()}-12-31T00%3A00%3A00Z&is_crewed=false&include_suborbital=true&related=false`
        )
        .then((res) => {
          const launchs = res.data;
          console.log(launchs);
          setLaunchList(launchs);
        });
    }
  }, [setLaunchList, customLink]);

  return (
    <>
      <Flex
        p="2"
        bg={colorNav}
        borderBottom={colorMode === "light" ? "1px solid gray" : ""}
      >
        <Flex p="2" bg={colorNav}>
          <NextLink href="/" passHref>
            <Heading _hover={{ textDecoration: "none" }} size="md">
              Space Date
            </Heading>
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
          <Flex direction="column" alignItems="center">
            <Heading mb={2}>
              {!selectedDate.loading && selectedDate.date.split("T")[0]}
            </Heading>
            {launchList.results &&
              launchList.results.map((elm: any, idx: any) => (
                <Text key={idx}>{elm && elm.name}</Text>
              ))}
            <Flex>
              <Button onClick={() => setCustomLink(launchList.previous)} disabled={!launchList.previous}>prev</Button>
              <Button onClick={() => setCustomLink(launchList.next)} disabled={!launchList.next}>next</Button>
            </Flex>
          </Flex>
        </Center>
      </Flex>
    </>
  );
};

export default Launchs;
