import type { NextPage } from "next";
import axios from "axios";
import { Flex, Heading, Center, Button, Spinner, RadioGroup, Stack, Radio, useToast } from "@chakra-ui/react";
import { useSelector } from "react-redux";
import { SetStateAction, useEffect, useState } from "react";
import moment from "moment";
import NavBar from "../../components/NavBar";
import Router from "next/router";
import LaunchsList from "../../components/LaunchsList";

const urlDomain = "https://lldev.thespacedevs.com/2.2.0/launch/";
const defaultOpt = "&is_crewed=false&include_suborbital=true&related=false";

const Launchs: NextPage = () => {
  const toast = useToast();
  const [listType, setListType] = useState("Year");
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
      const dateParsed = moment(selectedDate.date);
      setLoadingList(true);
      axios
        .get(
          customLink
            ? customLink
            : `${urlDomain}?net__gte=${dateParsed
                .startOf("year")
                .toISOString()}&net__lte=${dateParsed
                .endOf("year")
                .toISOString()}${defaultOpt}`
        )
        .then((res) => {
          const launchs = res.data;
          setLaunchList(launchs);
          setLoadingList(false);
        })
        .catch((err) => {
          toast({
            title: "Error get list",
            description: err,
            status: "error",
            duration: 9000,
            position: "top-right",
            isClosable: true
          });
          setLoadingList(false);
        });
    } else {
      toast({
        title: "Pick a date (Ex: birthdate 🎂)",
        status: "info",
        duration: 9000,
        position: "top-right"
      });
      Router.push("/");
    }
  }, [setLaunchList, customLink, selectedDate]);

  const setWeekCustomLink = () => {
    const url = `${urlDomain}?net__gte=${moment(selectedDate.date)
      .day(0)
      .toISOString()}&net__lte=${moment(selectedDate.date)
      .day(6)
      .toISOString()}${defaultOpt}`;
    setCustomLink(url);
  };

  const setDayCustomLink = () => {
    const birthDayStart = moment(selectedDate.date).set({hours: 0, minutes: 0, seconds: 0}).toISOString();
    const birthDayEnd = moment(selectedDate.date).set({hours: 23, minutes: 59, seconds: 59}).toISOString();
    const url = `${urlDomain}?net__gte=${birthDayStart}&net__lte=${birthDayEnd}${defaultOpt}`;
    setCustomLink(url);
  };

  const chooseCustomLink = (id: SetStateAction<string>) => {
    setListType(id);
    switch (id) {
      case "Year":
        setCustomLink("");
        break;
      case "Week":
        setWeekCustomLink();
        break;
      case "Day":
        setDayCustomLink();
        break;
      default:
        break;
    }
  }

  return (
    <>
      <NavBar />
      <Flex alignItems="center" justifyContent="center">
        <Center>
          <Flex direction="column" alignItems="center">
            <Heading my={4}>
              {!selectedDate.loading && selectedDate.date.split("T")[0]}
            </Heading>
            <RadioGroup onChange={chooseCustomLink} value={listType} mb={4}>
              <Stack direction="row">
                <Radio value={"Year"}>Year</Radio>
                <Radio value={"Week"} colorScheme='yellow'>Week</Radio>
                <Radio value={"Day"} colorScheme='green'>Day</Radio>
              </Stack>
            </RadioGroup>
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
