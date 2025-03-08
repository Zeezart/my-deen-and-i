
import { Box, Container, Flex } from "@chakra-ui/react";
import { ReactNode } from "react";
import NavBar from "./NavBar";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <Box bg="gray.50" minH="100vh">
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
