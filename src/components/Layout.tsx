
import { Box, Container, Flex, useColorModeValue } from "@chakra-ui/react";
import { ReactNode, useEffect } from "react";
import NavBar from "./NavBar";
import { getUserSettings } from "../services/storageService";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const bgColor = useColorModeValue("gray.50", "gray.900");

  useEffect(() => {
    // Load user settings to apply theme
    const settings = getUserSettings();
    
    // Any additional layout-specific initialization can go here
  }, []);

  return (
    <Box bg={bgColor} minH="100vh" transition="background-color 0.2s">
      <NavBar />
      <Container maxW="container.xl" py={8}>
        <Flex direction="column" gap={6}>
          {children}
        </Flex>
      </Container>
    </Box>
  );
};

export default Layout;
