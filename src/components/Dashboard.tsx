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
import ramadanDuas from "../data/ramadanDuas.json";

const MotionBox = motion(Box);

const Dashboard = () => {
  const [missedFasts, setMissedFasts] = useState(0);
  const [totalTrackedDays, setTotalTrackedDays] = useState(0);
  const [quranJuz, setQuranJuz] = useState(0);
  const [quranPage, setQuranPage] = useState(0);
  const [currentDua, setCurrentDua] = useState<{
    arabic: string;
    translation: string;
    reference: string;
  } | null>(null);

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

  // Check if Ramadan is ongoing, upcoming, or completed
  const today = new Date();
  const ramadanStart = new Date(2024, 2, 11); // March 11, 2024
  const ramadanEnd = new Date(2024, 3, 9);    // April 9, 2024
  
  let ramadanStatus = "upcoming";
  let ramadanDay = 0;
  
  if (today >= ramadanStart && today <= ramadanEnd) {
    ramadanStatus = "ongoing";
    // Calculate current Ramadan day (1-30)
    const timeDiff = today.getTime() - ramadanStart.getTime();
    ramadanDay = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
    
    // Ensure day is within valid range (1-30)
    ramadanDay = Math.max(1, Math.min(ramadanDay, 30));
    
    // Get dua for current day
    const dailyDua = ramadanDuas.find(dua => dua.day === ramadanDay);
    if (dailyDua) {
      setCurrentDua(dailyDua);
    }
  } else if (today > ramadanEnd) {
    ramadanStatus = "completed";
    // Show last day's dua if Ramadan is completed
    setCurrentDua(ramadanDuas[29]); // Index 29 is day 30
  } else {
    // Show first day's dua if Ramadan is upcoming
    setCurrentDua(ramadanDuas[0]); // Index 0 is day 1
  }

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
              {ramadanStatus === "upcoming" && "Ramadan 1445 - Coming Soon"}
              {ramadanStatus === "ongoing" && `Ramadan 1445 - Day ${ramadanDay}`}
              {ramadanStatus === "completed" && "Ramadan 1445 - Completed"}
            </Heading>
            {currentDua && (
              <>
                <Text fontSize="md" fontStyle="italic" mb={1}>
                  {currentDua.arabic}
                </Text>
                <Text fontSize="sm">
                  {currentDua.translation} - {currentDua.reference}
                </Text>
              </>
            )}
          </CardBody>
        </Card>
      </MotionBox>

      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
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

        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card>
            <CardBody>
              <Stat>
                <StatLabel>Previous Ramadan</StatLabel>
                <Flex alignItems="center" mt={2}>
                  <StatNumber>
                    {ramadanStatus === "upcoming" && "Coming Soon"}
                    {ramadanStatus === "ongoing" && ramadanDay}
                    {ramadanStatus === "completed" && "Completed"}
                  </StatNumber>
                </Flex>
                <StatHelpText>
                  {ramadanStatus === "ongoing" && `${30 - ramadanDay} days remaining`}
                  {ramadanStatus === "upcoming" && "Starts on March 11, 2024"}
                  {ramadanStatus === "completed" && "Ended on April 9, 2024"}
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
