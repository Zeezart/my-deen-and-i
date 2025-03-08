
import {
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Flex,
  Grid,
  Heading,
  Text,
  Badge,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  RadioGroup,
  Radio,
  Stack,
  Textarea,
  useToast,
  Spinner,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { getFastingDays, saveFastingDay } from "../services/storageService";
import { motion } from "framer-motion";

const MotionBox = motion(Box);

// Ramadan 2024 (1445 Hijri) dates - subject to moon sighting
// Ramadan 1445 is expected to start on March 11 and end on April 9, 2024
const RAMADAN_START_DATE = new Date(2024, 2, 11); // March 11, 2024
const RAMADAN_END_DATE = new Date(2024, 3, 9); // April 9, 2024

const getRamadanDates = () => {
  const dates = [];
  let currentDate = new Date(RAMADAN_START_DATE);

  while (currentDate <= RAMADAN_END_DATE) {
    dates.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dates;
};

type DayStatus = "fasted" | "missed" | "exempt" | "none";

interface HijriDateInfo {
  day: string;
  month: string;
  year: string;
}

const FastingCalendar = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [status, setStatus] = useState<DayStatus>("none");
  const [notes, setNotes] = useState("");
  const [fastingData, setFastingData] = useState<Record<string, any>>({});
  const [hijriDates, setHijriDates] = useState<Record<string, HijriDateInfo>>({});
  const [isLoadingHijri, setIsLoadingHijri] = useState(true);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  useEffect(() => {
    // Load fasting data from local storage
    const days = getFastingDays();
    const dataMap: Record<string, any> = {};
    
    days.forEach((day) => {
      dataMap[day.date] = {
        status: day.status,
        notes: day.notes || "",
      };
    });
    
    setFastingData(dataMap);
    
    // Fetch Hijri dates for the entire Ramadan period
    const fetchHijriDates = async () => {
      setIsLoadingHijri(true);
      const ramadanDates = getRamadanDates();
      const hijriDatesMap: Record<string, HijriDateInfo> = {};
      
      // For better performance, we'll batch the API requests for all Ramadan days
      const datePromises = ramadanDates.map(async (date) => {
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();
        const formattedDate = `${day}-${month}-${year}`; // Converts to dd-mm-yyyy
        const dateString = date.toISOString().split("T")[0];
        
        try {
          const response = await fetch(`https://api.aladhan.com/v1/gToH?date=${formattedDate}`);
          const data = await response.json();
          
          if (data.code === 200) {
            hijriDatesMap[dateString] = {
              day: data.data.hijri.day,
              month: data.data.hijri.month.en,
              year: data.data.hijri.year
            };
          }
        } catch (error) {
          console.error("Error fetching Hijri date for", formattedDate, error);
        }
      });
      
      // Wait for all API requests to complete
      await Promise.all(datePromises);
      setHijriDates(hijriDatesMap);
      setIsLoadingHijri(false);
    };
    
    fetchHijriDates();
  }, []);

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    const dateString = date.toISOString().split("T")[0];
    
    if (fastingData[dateString]) {
      setStatus(fastingData[dateString].status);
      setNotes(fastingData[dateString].notes || "");
    } else {
      setStatus("none");
      setNotes("");
    }
    
    onOpen();
  };

  const handleSave = () => {
    if (!selectedDate || status === "none") return;
    
    const dateString = selectedDate.toISOString().split("T")[0];
    
    // Save to local storage
    saveFastingDay({
      date: dateString,
      status: status as "fasted" | "missed" | "exempt",
      notes: notes,
    });

    // Update state
    setFastingData({
      ...fastingData,
      [dateString]: {
        status,
        notes,
      },
    });

    toast({
      title: "Saved",
      description: "Your fasting record has been saved.",
      status: "success",
      duration: 3000,
      isClosable: true,
    });

    onClose();
  };

  const getStatusColor = (status: DayStatus) => {
    switch (status) {
      case "fasted":
        return "green.500";
      case "missed":
        return "red.500";
      case "exempt":
        return "yellow.500";
      default:
        return "gray.300";
    }
  };

  const getStatusIcon = (status: DayStatus) => {
    switch (status) {
      case "fasted":
        return "✓";
      case "missed":
        return "✗";
      case "exempt":
        return "⊘";
      default:
        return "";
    }
  };

  const ramadanDates = getRamadanDates();
  const missedDays = Object.entries(fastingData).filter(
    ([_, data]) => data.status === "missed"
  ).length;

  return (
    <Card w="100%" overflow="hidden">
      <CardHeader bg="ramadan.purple" py={4} color="white">
        <Flex justifyContent="space-between" alignItems="center">
          <Heading size="md">Ramadan Fasting Tracker</Heading>
          <Badge colorScheme={missedDays > 0 ? "red" : "green"} fontSize="sm" px={2} py={1} borderRadius="md">
            {missedDays} Missed {missedDays === 1 ? "Fast" : "Fasts"}
          </Badge>
        </Flex>
      </CardHeader>
      <CardBody>
        {isLoadingHijri ? (
          <Flex justify="center" align="center" py={10}>
            <Spinner size="md" mr={3} />
            <Text>Loading Hijri dates...</Text>
          </Flex>
        ) : (
          <>
            <Grid templateColumns="repeat(7, 1fr)" gap={2} mb={4}>
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <Box
                  key={day}
                  textAlign="center"
                  fontWeight="bold"
                  fontSize="sm"
                  color="gray.600"
                  mb={2}
                >
                  {day}
                </Box>
              ))}

              {/* Fill in empty cells for proper alignment */}
              {Array.from({
                length: RAMADAN_START_DATE.getDay(),
              }).map((_, index) => (
                <Box key={`empty-${index}`} height="60px" />
              ))}

              {/* Ramadan days */}
              {ramadanDates.map((date, index) => {
                const dateString = date.toISOString().split("T")[0];
                const dayData = fastingData[dateString];
                const status = dayData ? dayData.status : "none";
                const hijriInfo = hijriDates[dateString];
                
                // Calculate Ramadan day number (1-30)
                const ramadanDay = Math.floor(
                  (date.getTime() - RAMADAN_START_DATE.getTime()) /
                    (1000 * 60 * 60 * 24)
                ) + 1;
                
                return (
                  <MotionBox
                    key={dateString}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    height="60px"
                    borderRadius="md"
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    justifyContent="center"
                    cursor="pointer"
                    onClick={() => handleDateClick(date)}
                    position="relative"
                    border="1px solid"
                    borderColor={getStatusColor(status)}
                    bg={status !== "none" ? `${getStatusColor(status)}10` : "white"}
                    p={1}
                  >
                    {/* Hijri Date (prominent) */}
                    <Text fontSize="md" fontWeight="bold" lineHeight="1">
                      {hijriInfo ? hijriInfo.day : ramadanDay}
                    </Text>
                    
                    {/* Gregorian Date (smaller) */}
                    <Text fontSize="xs" color="gray.500" lineHeight="1.2">
                      {date.getDate()}
                    </Text>
                    
                    {status !== "none" && (
                      <Box
                        position="absolute"
                        top="2px"
                        right="2px"
                        fontSize="10px"
                        color={getStatusColor(status)}
                        fontWeight="bold"
                      >
                        {getStatusIcon(status)}
                      </Box>
                    )}
                  </MotionBox>
                );
              })}
            </Grid>

            <Flex justifyContent="space-between" gap={2}>
              <Flex align="center" gap={2}>
                <Box h="12px" w="12px" borderRadius="full" bg="green.500"></Box>
                <Text fontSize="xs">Fasted</Text>
              </Flex>
              <Flex align="center" gap={2}>
                <Box h="12px" w="12px" borderRadius="full" bg="red.500"></Box>
                <Text fontSize="xs">Missed</Text>
              </Flex>
              <Flex align="center" gap={2}>
                <Box h="12px" w="12px" borderRadius="full" bg="yellow.500"></Box>
                <Text fontSize="xs">Exempt</Text>
              </Flex>
            </Flex>
          </>
        )}
      </CardBody>

      {/* Day status modal */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {selectedDate
              ? `${selectedDate.toLocaleDateString()} (Ramadan ${
                  Math.floor(
                    (selectedDate.getTime() - RAMADAN_START_DATE.getTime()) /
                      (1000 * 60 * 60 * 24)
                  ) + 1
                })`
              : "Select status"}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <RadioGroup value={status} onChange={(value) => setStatus(value as DayStatus)}>
              <Stack direction="column">
                <Radio value="fasted">Fasted</Radio>
                <Radio value="missed">Missed</Radio>
                <Radio value="exempt">Exempt</Radio>
              </Stack>
            </RadioGroup>

            <Text mt={4} mb={2} fontWeight="medium">
              Notes (optional):
            </Text>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Enter any notes here..."
            />
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave} isDisabled={status === "none"}>
              Save
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Card>
  );
};

export default FastingCalendar;
