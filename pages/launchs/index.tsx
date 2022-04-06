import type { NextPage } from "next";
import axios from "axios";
import {
  Flex,
  Heading,
  Center,
  Button,
  Spinner,
} from "@chakra-ui/react";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import moment from "moment";
import NavBar from "../../components/NavBar";
import Router from "next/router";
import LaunchsList from "../../components/LaunchsList";

const Launchs: NextPage = () => {
  const [customLink, setCustomLink] = useState("");
  const [loadingList, setLoadingList] = useState(false);
  const [launchList, setLaunchList] = useState({
    results: [],
    previous: "",
    next: "",
  });
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
    } else {
      Router.push("/");
    }
  }, [setLaunchList, customLink, selectedDate]);

  return (
    <>
      <NavBar />
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
            {!loadingList ? (
              <LaunchsList launchList={launchList.results} />
            ) : (
              <Spinner />
            )}
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
