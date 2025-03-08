
import {
  Box,
  Flex,
  Text,
  Button,
  Stack,
  useDisclosure,
  IconButton,
  HStack,
  VStack,
  CloseButton,
  Image,
} from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { motion } from "framer-motion";
import { useRef } from "react";

// Create motion components
const MotionBox = motion(Box);
const MotionFlex = motion(Flex);

const NavBar = () => {
  const { isOpen, onToggle, onClose } = useDisclosure();
  const menuRef = useRef<HTMLDivElement>(null);

  return (
    <Box position="sticky" top={0} zIndex={10}>
      <Flex
        bg="white"
        color="gray.600"
        minH={"60px"}
        py={{ base: 2 }}
        px={{ base: 4 }}
        borderBottom={1}
        borderStyle={"solid"}
        borderColor="gray.200"
        align={"center"}
        boxShadow="sm"
      >
        <Flex
          flex={{ base: 1, md: "auto" }}
          ml={{ base: -2 }}
          display={{ base: "flex", md: "none" }}
        >
          <IconButton
            onClick={onToggle}
            icon={
              isOpen ? (
                <CloseButton />
              ) : (
                <svg
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  width="24"
                  height="24"
                >
                  <path d="M4.75 5.75H19.25"></path>
                  <path d="M4.75 12H19.25"></path>
                  <path d="M4.75 18.25H19.25"></path>
                </svg>
              )
            }
            variant={"ghost"}
            aria-label={"Toggle Navigation"}
          />
        </Flex>

        <Flex flex={{ base: 1 }} justify={{ base: "center", md: "start" }}>
          <Flex alignItems="center">
            <Text
              as={RouterLink}
              to="/"
              textAlign={{ base: "center", md: "left" }}
              fontFamily={"heading"}
              fontWeight="bold"
              fontSize="xl"
              color="ramadan.purple"
              _hover={{
                textDecoration: "none",
              }}
            >
              My Deen Support
            </Text>
          </Flex>

          <Flex display={{ base: "none", md: "flex" }} ml={10}>
            <DesktopNav />
          </Flex>
        </Flex>

        <Stack
          flex={{ base: 1, md: 0 }}
          justify={"flex-end"}
          direction={"row"}
          spacing={6}
        >
          <Button
            as={RouterLink}
            to="/"
            fontSize={"sm"}
            fontWeight={600}
            variant="solid"
            size="sm"
            display={{ base: "none", md: "inline-flex" }}
          >
            Dashboard
          </Button>
        </Stack>
      </Flex>

      <MotionBox
        ref={menuRef}
        bg="white"
        display={{ md: "none" }}
        initial="exit"
        animate={isOpen ? "enter" : "exit"}
        variants={{
          enter: { opacity: 1, height: "auto", y: 0 },
          exit: { opacity: 0, height: 0, y: -10, transition: { duration: 0.2 } },
        }}
        overflow="hidden"
        borderBottomRadius="md"
        boxShadow="md"
      >
        <Stack p={4} display={{ md: "none" }}>
          <Stack as={"nav"} spacing={4}>
            {NAV_ITEMS.map((navItem) => (
              <Box key={navItem.label} onClick={onClose}>
                <Text
                  as={RouterLink}
                  to={navItem.href ?? "#"}
                  fontWeight={600}
                  color="gray.600"
                >
                  {navItem.label}
                </Text>
              </Box>
            ))}
          </Stack>
        </Stack>
      </MotionBox>
    </Box>
  );
};

const DesktopNav = () => {
  return (
    <HStack spacing={6}>
      {NAV_ITEMS.map((navItem) => (
        <Box key={navItem.label}>
          <Box
            as={RouterLink}
            to={navItem.href ?? "#"}
            p={2}
            fontSize={"md"}
            fontWeight={600}
            color="gray.600"
            _hover={{
              textDecoration: "none",
              color: "ramadan.purple",
            }}
          >
            {navItem.label}
          </Box>
        </Box>
      ))}
    </HStack>
  );
};

interface NavItem {
  label: string;
  href: string;
}

const NAV_ITEMS: Array<NavItem> = [
  {
    label: "Fasting Tracker",
    href: "/",
  },
  {
    label: "Quran Progress",
    href: "/quran",
  },
];

export default NavBar;
