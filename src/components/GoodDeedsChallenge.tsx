
import {
  Box,
  Card,
  CardBody,
  CardHeader,
  Heading,
  Text,
  VStack,
  HStack,
  Checkbox,
  Badge,
  Flex,
  Icon,
  useColorModeValue,
  Divider,
  Progress
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import {
  getDailyGoodDeeds,
  getCompletedDeeds,
  markDeedCompleted,
  getGoodDeedStreak
} from "../services/storageService";
import { motion } from "framer-motion";

const MotionBox = motion(Box);
const MotionFlex = motion(Flex);

const GoodDeedsChallenge = () => {
  const [deeds, setDeeds] = useState([]);
  const [completed, setCompleted] = useState<number[]>([]);
  const [streak, setStreak] = useState(0);
  
  const bgColor = useColorModeValue("white", "gray.800");
  const headerBg = useColorModeValue("ramadan.burgundy", "ramadan.deepBlue");
  const textColor = useColorModeValue("gray.700", "gray.100");
  
  useEffect(() => {
    const loadDeeds = () => {
      const dailyDeeds = getDailyGoodDeeds();
      const completedDeeds = getCompletedDeeds();
      const currentStreak = getGoodDeedStreak();
      
      setDeeds(dailyDeeds);
      setCompleted(completedDeeds);
      setStreak(currentStreak);
    };
    
    loadDeeds();
    
    // Refresh deeds at midnight
    const now = new Date();
    const night = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() + 1,
      0, 0, 0
    );
    const msToMidnight = night.getTime() - now.getTime();
    
    const timerId = setTimeout(loadDeeds, msToMidnight);
    return () => clearTimeout(timerId);
  }, []);
  
  const handleDeedComplete = (deedId: number) => {
    // Toggle completion
    let newCompleted;
    if (completed.includes(deedId)) {
      newCompleted = completed.filter(id => id !== deedId);
    } else {
      newCompleted = [...completed, deedId];
    }
    
    setCompleted(newCompleted);
    markDeedCompleted(deedId);
    setStreak(getGoodDeedStreak());
  };
  
  const progress = deeds.length > 0 ? Math.round((completed.length / deeds.length) * 100) : 0;
  
  return (
    <Card w="100%" overflow="hidden">
      <CardHeader bg={headerBg} py={4} color="white">
        <Heading size="md">Daily Good Deeds Challenge</Heading>
      </CardHeader>
      
      <CardBody>
        <VStack spacing={6} align="stretch">
          <Flex justify="space-between" align="center">
            <Heading size="sm">Today's Challenges</Heading>
            {streak > 0 && (
              <MotionFlex
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <Badge 
                  colorScheme="green" 
                  fontSize="0.8em" 
                  px={2} 
                  py={1} 
                  borderRadius="full"
                >
                  {streak} Day{streak !== 1 ? 's' : ''} Streak 🔥
                </Badge>
              </MotionFlex>
            )}
          </Flex>
          
          <Progress 
            value={progress} 
            size="sm" 
            colorScheme="green"
            borderRadius="full"
            bg="gray.100"
          />
          
          <VStack spacing={3} align="stretch" mt={2}>
            {deeds.map((deed, index) => (
              <MotionBox
                key={deed.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
              >
                <HStack
                  p={3}
                  bg={useColorModeValue(
                    completed.includes(deed.id) ? "green.50" : "gray.50",
                    completed.includes(deed.id) ? "green.900" : "gray.700"
                  )}
                  borderRadius="md"
                  borderLeft="4px solid"
                  borderLeftColor={completed.includes(deed.id) ? "green.500" : "gray.300"}
                  boxShadow="sm"
                  transition="all 0.2s"
                >
                  <Checkbox
                    colorScheme="green"
                    size="lg"
                    isChecked={completed.includes(deed.id)}
                    onChange={() => handleDeedComplete(deed.id)}
                  />
                  <Box ml={3}>
                    <Text 
                      fontWeight="medium" 
                      textDecoration={completed.includes(deed.id) ? "line-through" : "none"}
                      color={textColor}
                    >
                      {deed.text}
                    </Text>
                    <Badge 
                      colorScheme={
                        deed.category === "charity" ? "purple" :
                        deed.category === "worship" ? "blue" :
                        deed.category === "kindness" ? "pink" :
                        deed.category === "quran" ? "teal" : "orange"
                      }
                      fontSize="xs"
                      mt={1}
                    >
                      {deed.category}
                    </Badge>
                  </Box>
                </HStack>
              </MotionBox>
            ))}
          </VStack>
          
          {completed.length === deeds.length && (
            <MotionBox
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Box 
                p={4} 
                bg="green.50" 
                borderRadius="md" 
                borderLeft="4px solid" 
                borderLeftColor="green.500"
                textAlign="center"
              >
                <Heading size="sm" color="green.600">
                  Masha'Allah! 🎉
                </Heading>
                <Text mt={1} fontSize="sm">
                  You've completed all of today's challenges!
                </Text>
              </Box>
            </MotionBox>
          )}
          
          <Divider />
          
          <Text fontSize="sm" color="gray.500" textAlign="center">
            New challenges will be available tomorrow
          </Text>
        </VStack>
      </CardBody>
    </Card>
  );
};

export default GoodDeedsChallenge;
