import type { NextPage } from "next";
import axios from "axios";
import { Flex, Heading, Center, Spinner } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import NavBar from "../../components/NavBar";
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

const Favoris: NextPage = () => {
  const [launchList, setLaunchList] = useState<Array<LaunchInfos>>([]);
  const [favoris, setFavoris] = useState(
    JSON.parse(
      (typeof window !== "undefined" && localStorage.getItem("favoris")) || "[]"
    )
  );

  useEffect(() => {
      favoris.forEach((elm: any) => {
        axios
          .get(`https://lldev.thespacedevs.com/2.2.0/launch/${elm}/`)
          .then((res) => {
            const infos = res.data;
            setLaunchList((launchList) => launchList.concat(infos));
          })
          .catch((err) => {
            console.log(err);
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
      <NavBar />
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

export default Favoris;
