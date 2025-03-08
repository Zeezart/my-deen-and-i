
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
  Icon,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { getFastingDays, getMissedFastingDays, getQuranProgress } from "../services/storageService";
import { motion } from "framer-motion";

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

  // Check if Ramadan is ongoing, upcoming, or completed
  const today = new Date();
  const ramadanStart = new Date(2024, 2, 11);
  const ramadanEnd = new Date(2024, 3, 9);
  
  let ramadanStatus = "upcoming";
  if (today >= ramadanStart && today <= ramadanEnd) {
    ramadanStatus = "ongoing";
  } else if (today > ramadanEnd) {
    ramadanStatus = "completed";
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
            <Heading size="md" mb={1}>
              Ramadan 2024
            </Heading>
            <Text>
              {ramadanStatus === "upcoming" && "Prepare for the blessed month"}
              {ramadanStatus === "ongoing" && "Make the most of this blessed time"}
              {ramadanStatus === "completed" && "Don't forget to make up missed fasts"}
            </Text>
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
                <StatLabel>Current Ramadan Day</StatLabel>
                <Flex alignItems="center" mt={2}>
                  <StatNumber>
                    {ramadanStatus === "upcoming" && "Coming Soon"}
                    {ramadanStatus === "ongoing" && 
                      Math.ceil((today.getTime() - ramadanStart.getTime()) / (1000 * 60 * 60 * 24))
                    }
                    {ramadanStatus === "completed" && "Completed"}
                  </StatNumber>
                </Flex>
                <StatHelpText>
                  {ramadanStatus === "ongoing" && `${30 - Math.ceil((today.getTime() - ramadanStart.getTime()) / (1000 * 60 * 60 * 24))} days remaining`}
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
