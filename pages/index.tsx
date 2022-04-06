import type { NextPage } from "next";
import NextLink from 'next/link'
import Head from "next/head";
import {
  Flex,
  Heading,
  Center,
} from "@chakra-ui/react";
import NavBar from "../components/NavBar";
import { useSelector } from "react-redux";
import DatePicker from "../components/DatePicker";

const Home: NextPage = () => {
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
      <NavBar />
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
