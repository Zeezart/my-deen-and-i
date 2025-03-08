
import { Box, Container, Heading, Text, VStack, SimpleGrid, Divider } from "@chakra-ui/react";
import Layout from "../components/Layout";
import FastingCalendar from "../components/FastingCalendar";
import QuranTracker from "../components/QuranTracker";
import Dashboard from "../components/Dashboard";

const Index = () => {
  return (
    <Layout>
      <Dashboard />
      
      <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
        <FastingCalendar />
        <QuranTracker />
      </SimpleGrid>

      <Box mt={12} textAlign="center" py={6}>
        <Divider mb={6} />
        <Heading size="sm" color="gray.600" mb={2}>
          My Deen Support
        </Heading>
        <Text fontSize="sm" color="gray.500">
          Track your Ramadan journey and Quran progress
        </Text>
      </Box>
    </Layout>
  );
};

export default Index;
