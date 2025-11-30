
import {
  Box,
  Text,
  SimpleGrid,
  Card,
  CardBody,
  Heading,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Flex,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { getFastingDays, getMissedFastingDays, getQuranProgress } from "../services/storageService";
import { motion } from "framer-motion";
import { quranDuas } from "@/data/duas";

const MotionBox = motion(Box);


const Dashboard = () => {
  const [missedFasts, setMissedFasts] = useState(0);
  const [totalTrackedDays, setTotalTrackedDays] = useState(0);
  const [quranJuz, setQuranJuz] = useState(0);
  const [quranPage, setQuranPage] = useState(0);

  useEffect(() => {
    // Load fasting data
    const allDays = getFastingDays();
    const missed = getMissedFastingDays();
    setMissedFasts(missed.length);
    setTotalTrackedDays(allDays.length);

    // Load Quran progress
    const progress = getQuranProgress();
    if (progress) {
      setQuranJuz(progress.juz);
      setQuranPage(progress.page);
    }
  }, []);

 
  
  // Select a dua for today (cycle through available duas)
  const today = new Date();
  const todaysDay = today.getDate();
  const duaIndex = ((todaysDay - 1) % quranDuas.length);
  const todaysDua = quranDuas[duaIndex];


  return (
    <Box mb={8}>
      <MotionBox
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card bg="ramadan.purple" color="white" mb={6} overflow="hidden">
          <CardBody>
            <Heading size="md" mb={2}>
              Ramadan Day {todaysDay}
            </Heading>
            <Text fontSize="md" fontStyle="italic" mb={1}>
              {todaysDua.arabic}
            </Text>
            <Text fontSize="sm">
              {todaysDua.translation} - {todaysDua.reference}
            </Text>
          </CardBody>
        </Card>
      </MotionBox>

      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card>
            <CardBody>
              <Stat>
                <StatLabel>Fasting Status</StatLabel>
                <Flex alignItems="center" mt={2}>
                  <StatNumber>{totalTrackedDays}</StatNumber>
                  <Text ml={2} fontSize="sm">Days Tracked</Text>
                </Flex>
                <StatHelpText>
                  {missedFasts} 
                  {missedFasts === 1 ? " fast" : " fasts"} 
                  {missedFasts > 0 ? " to make up" : " missed"}
                </StatHelpText>
              </Stat>
            </CardBody>
          </Card>
        </MotionBox>

        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card>
            <CardBody>
              <Stat>
                <StatLabel>Quran Progress</StatLabel>
                <Flex alignItems="center" mt={2}>
                  <StatNumber>{quranJuz}</StatNumber>
                  <Text ml={2} fontSize="sm">Juz Completed</Text>
                </Flex>
                <StatHelpText>
                  Page {quranPage} of 604
                </StatHelpText>
              </Stat>
            </CardBody>
          </Card>
        </MotionBox>

        
      </SimpleGrid>
    </Box>
  );
};

export default Dashboard;
