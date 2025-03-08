
import {
  Box,
  Card,
  CardBody,
  CardHeader,
  Heading,
  Text,
  VStack,
  Button,
  Flex,
  CircularProgress,
  CircularProgressLabel,
  useColorModeValue,
  Divider,
  IconButton,
  Tooltip,
  useToast
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { getDhikrList, updateDhikrCount, resetDhikrCounts, getUserSettings } from "../services/storageService";
import { motion } from "framer-motion";

const MotionBox = motion(Box);
const MotionFlex = motion(Flex);

const DhikrReminders = () => {
  const [dhikrItems, setDhikrItems] = useState([]);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const toast = useToast();
  
  const bgColor = useColorModeValue("white", "gray.800");
  const headerBg = useColorModeValue("ramadan.navy", "ramadan.deepBlue");
  const dhikrCardBg = useColorModeValue("gray.50", "gray.700");
  
  useEffect(() => {
    loadDhikrData();
    
    // Check if notifications are enabled
    const settings = getUserSettings();
    setNotificationsEnabled(settings.dhikrRemindersEnabled);
    
    // Set up notification if supported and enabled
    if (settings.dhikrRemindersEnabled && "Notification" in window) {
      if (Notification.permission === "granted") {
        scheduleNotification();
      } else if (Notification.permission !== "denied") {
        Notification.requestPermission().then(permission => {
          if (permission === "granted") {
            scheduleNotification();
          }
        });
      }
    }
  }, []);
  
  const loadDhikrData = () => {
    const items = getDhikrList();
    setDhikrItems(items);
  };
  
  const scheduleNotification = () => {
    // Schedule notification for dhikr reminder (e.g., after Asr prayer around 4pm)
    const now = new Date();
    const scheduledTime = new Date();
    
    // Set notification for 4pm if it's before 4pm, otherwise schedule for tomorrow
    scheduledTime.setHours(16, 0, 0, 0);
    
    if (now > scheduledTime) {
      scheduledTime.setDate(scheduledTime.getDate() + 1);
    }
    
    const timeUntilNotification = scheduledTime.getTime() - now.getTime();
    
    setTimeout(() => {
      if (Notification.permission === "granted") {
        new Notification("Time for Dhikr", {
          body: "Take a moment to remember Allah through dhikr"
        });
        
        // Reschedule for next day
        scheduleNotification();
      }
    }, timeUntilNotification);
  };
  
  const handleDhikrIncrement = (id: number, currentCount: number, target: number) => {
    const newCount = currentCount + 1;
    const updatedItems = dhikrItems.map(item => {
      if (item.id === id) {
        return { ...item, count: newCount > target ? target : newCount };
      }
      return item;
    });
    
    setDhikrItems(updatedItems);
    updateDhikrCount(id, newCount > target ? target : newCount);
    
    // Show toast when target is reached
    if (newCount === target) {
      toast({
        title: "Masha'Allah!",
        description: "You've completed this dhikr",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    }
  };
  
  const handleResetAll = () => {
    resetDhikrCounts();
    loadDhikrData();
    
    toast({
      title: "Reset Complete",
      description: "All dhikr counters have been reset",
      status: "info",
      duration: 2000,
      isClosable: true,
    });
  };
  
  return (
    <Card w="100%" overflow="hidden">
      <CardHeader bg={headerBg} py={4} color="white">
        <Flex justify="space-between" align="center">
          <Heading size="md">Dhikr Reminders</Heading>
          <Tooltip label="Reset All Counts">
            <IconButton
              aria-label="Reset all counts"
              icon={<Text fontSize="lg">↺</Text>}
              size="sm"
              variant="ghost"
              color="white"
              onClick={handleResetAll}
            />
          </Tooltip>
        </Flex>
      </CardHeader>
      
      <CardBody>
        <VStack spacing={4} align="stretch">
          {dhikrItems.map((item, index) => (
            <MotionBox
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
            >
              <Flex
                p={4}
                bg={dhikrCardBg}
                borderRadius="md"
                boxShadow="sm"
                justify="space-between"
                align="center"
              >
                <Box flex="1">
                  <Text fontSize="xl" fontWeight="bold" mb={1}>
                    {item.arabic}
                  </Text>
                  <Text fontSize="sm" color="gray.600" mb={1}>
                    {item.translation}
                  </Text>
                  <Text fontSize="xs" color="gray.500">
                    {item.virtue}
                  </Text>
                </Box>
                
                <Flex direction="column" align="center" ml={4}>
                  <CircularProgress 
                    value={(item.count / item.target) * 100} 
                    color="ramadan.purple" 
                    size="80px"
                    thickness="8px"
                  >
                    <CircularProgressLabel>
                      <VStack spacing={0}>
                        <Text fontWeight="bold" fontSize="md">{item.count}</Text>
                        <Text fontSize="xs" opacity={0.7}>/ {item.target}</Text>
                      </VStack>
                    </CircularProgressLabel>
                  </CircularProgress>
                  
                  <Button
                    mt={2}
                    colorScheme="purple"
                    size="sm"
                    isDisabled={item.count >= item.target}
                    onClick={() => handleDhikrIncrement(item.id, item.count, item.target)}
                  >
                    Count
                  </Button>
                </Flex>
              </Flex>
            </MotionBox>
          ))}
          
          <Divider my={2} />
          
          <Text fontSize="sm" color="gray.500" textAlign="center">
            "The servants of Allah who remember Him frequently, Allah will acknowledge them on the Day of Judgment and be generous to them."
          </Text>
        </VStack>
      </CardBody>
    </Card>
  );
};

export default DhikrReminders;
