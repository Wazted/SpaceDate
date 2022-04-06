import type { NextPage } from "next";
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
} from "@chakra-ui/react";
import { StarIcon, ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons";
import { Key, SetStateAction, useEffect, useState } from "react";

type LaunchInfos = {
  launch_service_provider: {
    name: String;
    logo_url: string;
    successful_landings: Number;
    failed_landings: Number;
    successful_launches: Number;
    failed_launches: Number;
  };
};

interface Props {
  launchList: Array<LaunchInfos>;
}

const LaunchsList: NextPage<Props> = (props) => {
  const [moreInfos, setMoreInfos] = useState<LaunchInfos>();
  const [loadingLaunch, setLoadingLaunch] = useState(false);
  const [toggledLaunch, setToggledLaunch] = useState(-1);
  const [favoris, setFavoris] = useState(
    JSON.parse(localStorage.getItem("favoris") || "[]")
  );

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
  };

  const getMoreInfosLaunch = (id: String, key: SetStateAction<number>) => {
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
      {props.launchList &&
        props.launchList.map((elm: any, idx: Key | any) => (
          <Flex
            key={idx}
            direction="column"
            alignItems="center"
            bg="gray.200"
            rounded="md"
            p={2}
            my={2}
            w="full"
            position="relative"
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
                {!loadingLaunch && moreInfos ? (
                  <>
                    <Text>
                      Launch provider: {moreInfos.launch_service_provider.name}
                    </Text>
                    <Image
                      src={moreInfos.launch_service_provider.logo_url}
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
                              {
                                moreInfos.launch_service_provider
                                  .successful_landings
                              }
                            </Td>
                            <Td isNumeric>
                              {
                                moreInfos.launch_service_provider
                                  .failed_landings
                              }
                            </Td>
                          </Tr>
                          <Tr>
                            <Td>Launches</Td>
                            <Td isNumeric>
                              {
                                moreInfos.launch_service_provider
                                  .successful_launches
                              }
                            </Td>
                            <Td isNumeric>
                              {
                                moreInfos.launch_service_provider
                                  .failed_launches
                              }
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
                onClick={() => getMoreInfosLaunch(elm.id, idx)}
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
