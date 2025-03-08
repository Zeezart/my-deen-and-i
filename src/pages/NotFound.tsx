
import { Box, Button, Container, Heading, Text, VStack } from "@chakra-ui/react";
import { Link as RouterLink, useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <Container centerContent maxW="xl" py={20}>
      <VStack spacing={6} textAlign="center">
        <Heading size="4xl" color="ramadan.purple">
          404
        </Heading>
        <Text fontSize="xl" mb={2}>
          Oops! Page not found
        </Text>
        <Text color="gray.600" mb={6}>
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </Text>
        <Button
          as={RouterLink}
          to="/"
          size="lg"
          colorScheme="purple"
        >
          Return to Home
        </Button>
      </VStack>
    </Container>
  );
};

export default NotFound;
