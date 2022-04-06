import type { NextPage } from "next";
import NextLink from "next/link";
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
} from "@chakra-ui/react";
import { HamburgerIcon, StarIcon } from "@chakra-ui/icons";

const NavBar: NextPage = () => {
  return (
    <Flex p="2" bg="gray.50">
      <Flex p="2">
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
      </Box>
    </Flex>
  );
};

export default NavBar;
