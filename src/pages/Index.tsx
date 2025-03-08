
import { Box, Container, Heading, Text, VStack, SimpleGrid, Divider } from "@chakra-ui/react";
import Layout from "../components/Layout";
import FastingCalendar from "../components/FastingCalendar";
import Dashboard from "../components/Dashboard";
import GoodDeedsChallenge from "../components/GoodDeedsChallenge";
import DhikrReminders from "../components/DhikrReminders";
import AppSettings from "../components/AppSettings";
import HijriDate from "../components/HijriDate";
import AdhkarSection from "../components/AdhkarSection";

const Index = () => {
  return (
    <Layout>
      <HijriDate />
      <Dashboard />
      
      <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6} my={6}>
        <FastingCalendar />
        <GoodDeedsChallenge />
      </SimpleGrid>

      <SimpleGrid columns={{ base: 1, lg: 1 }} spacing={6} my={6}>
        <DhikrReminders />
      </SimpleGrid>
      
      <SimpleGrid columns={{ base: 1, lg: 1 }} spacing={6} my={6}>
        <AdhkarSection />
      </SimpleGrid>

      <AppSettings />

      <Box mt={12} textAlign="center" py={6}>
        <Divider mb={6} />
        <Heading size="sm" color="gray.600" mb={2}>
          My Deen Support
        </Heading>
        <Text fontSize="sm" color="gray.500">
          Track your Ramadan journey and spiritual growth
        </Text>
      </Box>
    </Layout>
  );
};

export default Index;
