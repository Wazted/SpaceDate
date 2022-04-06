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
  Image,
  Spinner,
} from "@chakra-ui/react";
import {
  HamburgerIcon,
  StarIcon,
  SunIcon,
  MoonIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "@chakra-ui/icons";
import { useDispatch, useSelector } from "react-redux";
import { Key, useEffect, useState } from "react";
import moment from "moment";
import NextLink from "next/link";

const Launchs: NextPage = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const [customLink, setCustomLink] = useState("");
  const [moreInfos, setMoreInfos] = useState({});
  const [loadingLaunch, setLoadingLaunch] = useState(false);
  const [loadingList, setLoadingList] = useState(false);
  const [toggledLaunch, setToggledLaunch] = useState(-1);
  const [launchList, setLaunchList] = useState({
    results: [],
    previous: "",
    next: "",
  });
  const colorNav = useColorModeValue("gray.50", "gray.900");
  const iconButton = useColorModeValue(<SunIcon />, <MoonIcon />);
  const dispatch = useDispatch();
  const selectedDate = useSelector((state: any) => state.date);

  useEffect(() => {
    if (selectedDate.date) {
      console.log(selectedDate, moment(selectedDate.date));
      const dateParsed = moment(selectedDate.date);
      setLoadingList(true);
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
          setLoadingList(false);
        })
        .catch((err) => {
          console.log(err);
          setLoadingList(false);
        });
    }
  }, [setLaunchList, customLink]);

  const getMoreInfosLaunch = (id: String, key: Key) => {
    setMoreInfos({});
    setToggledLaunch(key);
    setLoadingLaunch(true);
    axios
      .get(`https://lldev.thespacedevs.com/2.2.0/launch/${id}/`)
      .then((res) => {
        const infos = res.data;
        console.log(infos);
        setMoreInfos(infos);
        setLoadingLaunch(false);
      })
      .catch((err) => {
        console.log(err);
        setLoadingLaunch(false);
      });
  };

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
            <Flex mb={2}>
              <Button
                onClick={() => setCustomLink(launchList.previous)}
                disabled={!launchList.previous}
                mx={1}
              >
                prev
              </Button>
              <Button
                mx={1}
                onClick={() => setCustomLink(launchList.next)}
                disabled={!launchList.next}
              >
                next
              </Button>
            </Flex>
            {!loadingList ?
              <>
                {launchList.results &&
                launchList.results.map((elm: any, idx: Key) => (
                  <Flex
                    key={idx}
                    direction="column"
                    alignItems="center"
                    bg="gray.200"
                    rounded="md"
                    p={2}
                    my={2}
                    w='full'
                  >
                    <Image
                      src={elm.image}
                      alt="Launch image"
                      boxSize="100px"
                      objectFit="cover"
                      rounded='full'
                      shadow='lg'
                      mb={2}
                    />
                    <Text fontWeight={"bold"}>{elm && elm.name}</Text>
                    {idx === toggledLaunch ? (
                      <Flex
                        direction="column"
                        alignItems="center"
                        w={"full"}
                        bg="white"
                        rounded={"md"}
                        shadow="inner"
                        p={2}
                      >
                        {!loadingLaunch ? (
                          <>
                            <Text>
                              Launch provider:{" "}
                              {moreInfos.launch_service_provider.name}
                            </Text>
                            <Image
                              src={moreInfos.launch_service_provider.logo_url}
                              alt="Launch image"
                              boxSize="100px"
                              objectFit="contain"
                            />
                            <Text>
                              Landings:{" "}
                              {
                                moreInfos.launch_service_provider
                                  .successful_landings
                              }{" "}
                              success |{" "}
                              {moreInfos.launch_service_provider.failed_landings}{" "}
                              fail
                            </Text>
                            <IconButton
                              onClick={() => {
                                setToggledLaunch(-1);
                              }}
                              aria-label="Info icon"
                              icon={<ChevronUpIcon />}
                              w='full'
                              bg='white'
                            />
                          </>
                        ) : (
                          <Spinner />
                        )}
                      </Flex>
                    ) : (
                      <IconButton
                        onClick={() => getMoreInfosLaunch(elm.id, idx)}
                        aria-label="Info icon"
                        icon={<ChevronDownIcon />}
                        bg='white'
                        w='full'
                      />
                    )}
                  </Flex>
                ))}
              </>
              : <Spinner />
            }
            <Flex mt={2}>
              <Button
                onClick={() => setCustomLink(launchList.previous)}
                disabled={!launchList.previous}
                mx={1}
              >
                prev
              </Button>
              <Button
                onClick={() => setCustomLink(launchList.next)}
                disabled={!launchList.next}
                mx={1}
              >
                next
              </Button>
            </Flex>
          </Flex>
        </Center>
      </Flex>
    </>
  );
};

export default Launchs;
