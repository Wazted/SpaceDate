import axios from "axios";
import {
  Flex,
  IconButton,
  Text,
  Button,
  Image,
  Spinner,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
  useToast
} from "@chakra-ui/react";
import { StarIcon, ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons";
import { Key, SetStateAction, useEffect, useState, FunctionComponent } from "react";
import { useSelector } from "react-redux";
import moment from "moment";

type LaunchInfos = {
  id: string;
  net: string;
  image: string;
  name: string;
  launch_service_provider: {
    name: String;
    logo_url: string;
    successful_landings: Number;
    failed_landings: Number;
    successful_launches: Number;
    failed_launches: Number;
  };
};

type Props = {
  launchList: Array<LaunchInfos>;
  containsInfos?: boolean;
  updateFavs?: Function;
}

const LaunchsList: FunctionComponent<Props> = ({launchList, containsInfos, updateFavs}) => {
  const toast = useToast();
  const [moreInfos, setMoreInfos] = useState<LaunchInfos>();
  const [loadingLaunch, setLoadingLaunch] = useState(false);
  const [toggledLaunch, setToggledLaunch] = useState(-1);
  const [favoris, setFavoris] = useState(
    JSON.parse(
      (typeof window !== "undefined" && localStorage.getItem("favoris")) || "[]"
    )
  );
  const selectedDate = useSelector((state: any) => state.date);
  const birthDayStart = moment(selectedDate.date || "").set({hours: 0, minutes: 0, seconds: 0});
  const birthDayEnd = moment(selectedDate.date || "").set({hours: 23, minutes: 59, seconds: 59});
  const birthWeekStart = moment(selectedDate.date  || "").day(0).set({hours: 0, minutes: 0, seconds: 0});
  const birthWeekEnd = moment(selectedDate.date  || "").day(6).set({hours: 23, minutes: 59, seconds: 59});

  const favContainId = (id: string) => {
    return favoris.includes(id);
  };

  const addToFav = (id: string) => {
    const oldStorage = JSON.parse(localStorage.getItem("favoris") || "[]");
    oldStorage.push(id);
    setFavoris(oldStorage);
    localStorage.setItem("favoris", JSON.stringify(oldStorage));
  };

  const removeFromFav = (id: string) => {
    let oldStorage = JSON.parse(localStorage.getItem("favoris") || "[]");
    oldStorage = oldStorage.filter((elm: string) => elm !== id);
    setFavoris(oldStorage);
    localStorage.setItem("favoris", JSON.stringify(oldStorage));
    if (containsInfos && updateFavs) {
      updateFavs(id);
    }
  };

  const getMoreInfosLaunch = (id: String, key: SetStateAction<number>) => {
    setToggledLaunch(key);
    setLoadingLaunch(true);
    axios
      .get(`https://lldev.thespacedevs.com/2.2.0/launch/${id}/`)
      .then((res) => {
        const infos = res.data;
        setMoreInfos(infos);
        setLoadingLaunch(false);
      })
      .catch((err) => {
        toast({
          title: "Error get launch",
          description: err,
          status: "error",
          duration: 9000,
          position: "top-right",
          isClosable: true
        });
        setLoadingLaunch(false);
      });
  };

  const backgroundOnDate = (date: string) => {
    if (selectedDate.date) {
      const isInWeek = moment(date).isBetween(birthWeekStart, birthWeekEnd, undefined, '[]');
      const isInDay = moment(date).isBetween(birthDayStart, birthDayEnd, undefined, '[]');

      if (isInDay) {
        return "green.200"
      } else if (isInWeek) {
        return "orange.200"
      }
    }
    return "gray.200"
  }

  return (
    <>
      {launchList &&
        launchList.map((elm: LaunchInfos, idx: Key | any) => (
          <Flex
            key={idx}
            direction="column"
            alignItems="center"
            bg={backgroundOnDate(elm.net)}
            rounded="md"
            p={2}
            my={2}
            w="full"
            position="relative"
            minW="md"
          >
            <Button
              rightIcon={<StarIcon />}
              colorScheme="pink"
              position="absolute"
              top={1}
              right={1}
              onClick={() => {
                favContainId(elm.id) ? removeFromFav(elm.id) : addToFav(elm.id);
              }}
            >
              {favContainId(elm.id) ? "Remove fav" : "Add fav"}
            </Button>
            <Image
              src={elm.image}
              alt="Launch image"
              boxSize="100px"
              objectFit="cover"
              rounded="full"
              shadow="lg"
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
                {!loadingLaunch && (containsInfos || moreInfos) ? (
                  <>
                    <Text>
                      Launch provider:{" "}
                      {containsInfos
                        ? elm.launch_service_provider.name
                        : moreInfos && moreInfos.launch_service_provider.name}
                    </Text>
                    <Image
                      src={
                        containsInfos
                          ? elm.launch_service_provider.logo_url
                          : moreInfos && moreInfos.launch_service_provider.logo_url
                      }
                      alt="Launch image"
                      boxSize="100px"
                      objectFit="contain"
                    />
                    <TableContainer>
                      <Table variant="striped">
                        <TableCaption>Provider metrics</TableCaption>
                        <Thead>
                          <Tr>
                            <Th>Action</Th>
                            <Th isNumeric>Success</Th>
                            <Th isNumeric>Fail</Th>
                          </Tr>
                        </Thead>
                        <Tbody>
                          <Tr>
                            <Td>Landings</Td>
                            <Td isNumeric>
                              {containsInfos
                                ? elm.launch_service_provider
                                    .successful_landings
                                : moreInfos && moreInfos.launch_service_provider
                                    .successful_landings}
                            </Td>
                            <Td isNumeric>
                              {containsInfos
                                ? elm.launch_service_provider.failed_landings
                                : moreInfos && moreInfos.launch_service_provider
                                    .failed_landings}
                            </Td>
                          </Tr>
                          <Tr>
                            <Td>Launches</Td>
                            <Td isNumeric>
                              {containsInfos
                                ? elm.launch_service_provider
                                    .successful_launches
                                : moreInfos && moreInfos.launch_service_provider
                                    .successful_launches}
                            </Td>
                            <Td isNumeric>
                              {containsInfos
                                ? elm.launch_service_provider.failed_launches
                                : moreInfos && moreInfos.launch_service_provider
                                    .failed_launches}
                            </Td>
                          </Tr>
                        </Tbody>
                      </Table>
                    </TableContainer>
                    <IconButton
                      onClick={() => {
                        setToggledLaunch(-1);
                      }}
                      aria-label="Info icon"
                      icon={<ChevronUpIcon />}
                      w="full"
                      bg="white"
                    />
                  </>
                ) : (
                  <Spinner />
                )}
              </Flex>
            ) : (
              <IconButton
                onClick={
                  !containsInfos
                    ? () => getMoreInfosLaunch(elm.id, idx)
                    : () => setToggledLaunch(idx)
                }
                aria-label="Info icon"
                icon={<ChevronDownIcon />}
                bg="white"
                w="full"
              />
            )}
          </Flex>
        ))}
    </>
  );
};

export default LaunchsList;
