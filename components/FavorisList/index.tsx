import axios from "axios";
import { Flex, Heading, Center, useToast } from "@chakra-ui/react";
import { useEffect, useState, FunctionComponent } from "react";
import LaunchsList from "../../components/LaunchsList";

type LaunchInfos = {
  id: String;
  launch_service_provider: {
    name: String;
    logo_url: string;
    successful_landings: Number;
    failed_landings: Number;
    successful_launches: Number;
    failed_launches: Number;
  };
};

const FavorisList: FunctionComponent = () => {
  const toast = useToast();
  const [launchList, setLaunchList] = useState<Array<LaunchInfos>>([]);
  const [favoris, setFavoris] = useState(
    JSON.parse(
      (typeof window !== "undefined" && localStorage.getItem("favoris")) || "[]"
    )
  );

  useEffect(() => {
      favoris.forEach((elm: string) => {
        axios
          .get(`https://lldev.thespacedevs.com/2.2.0/launch/${elm}/`)
          .then((res) => {
            const infos = res.data;
            setLaunchList((launchList) => launchList.concat(infos));
          })
          .catch((err) => {
            toast({
              title: "Error get fav info",
              description: err,
              status: "error",
              duration: 9000,
              position: "top-right",
              isClosable: true
            });
          });
      });
  }, [favoris]);

  const refreshLaunchList = (id: String) => {
    setLaunchList((launchList) =>
      launchList.filter((launch) => launch.id !== id)
    );
  };

  return (
    <>
      <Flex alignItems="center" justifyContent="center">
        <Center>
          <Flex direction="column" alignItems="center">
            <Heading mb={2}>Favoris</Heading>
            <LaunchsList
              launchList={launchList}
              containsInfos
              updateFavs={(id: String) => refreshLaunchList(id)}
            />
          </Flex>
        </Center>
      </Flex>
    </>
  );
};

export default FavorisList;
