
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
  Tooltip,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { getFastingDays, saveFastingDay } from "../services/storageService";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";

const MotionBox = motion(Box);

// Ramadan 2024 started on March 1st and will end on March 30 (30 days)
const RAMADAN_START_DATE = new Date(2024, 2, 1); // March 1, 2024
const RAMADAN_END_DATE = new Date(2024, 2, 30); // March 30, 2024

const formatHijriDay = (day) => {
  const suffixes = ["th", "st", "nd", "rd"];
  const mod = day % 10;
  const suffix = suffixes[(mod < 4 && day % 100 - mod !== 10) ? mod : 0];
  return `${day}${suffix}`;
};

const getHijriDateFormatted = async (gregorianDate) => {
  try {
    const response = await fetch(`https://api.aladhan.com/v1/gToH?date=${gregorianDate}`);
    const data = await response.json();

    if (data.code === 200) {
      const hijriDay = data.data.hijri.day; // Day number
      const hijriMonth = data.data.hijri.month.en; // Month name (e.g., Ramadan)
      const hijriYear = data.data.hijri.year; // Year (1445)

      return {
        dayFormatted: formatHijriDay(hijriDay),
        day: hijriDay,
        month: hijriMonth,
        year: hijriYear,
        fullDate: `${formatHijriDay(hijriDay)} ${hijriMonth} ${hijriYear}`,
        weekday: data.data.hijri.weekday.en
      };
    } else {
      console.error("Error fetching Hijri date:", data);
      return null;
    }
  } catch (error) {
    console.error("API request failed:", error);
    return null;
  }
};

const FastingCalendar = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [status, setStatus] = useState<"fasted" | "missed" | "none">("none");
  const [notes, setNotes] = useState("");
  const [fastingData, setFastingData] = useState<Record<string, any>>({});
  const [hijriDates, setHijriDates] = useState<Record<string, any>>({});
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const { isLoading } = useQuery({
    queryKey: ['hijriDates'],
    queryFn: async () => {
      const ramadanDates = getRamadanDates();
      const hijriDatePromises = ramadanDates.map(async (date) => {
        const formattedDate = formatGregorianDate(date);
        const hijriDate = await getHijriDateFormatted(formattedDate);
        return { gregorianDate: date, hijriDate };
      });
      
      const results = await Promise.all(hijriDatePromises);
      const hijriDateMap = {};
      
      results.forEach(result => {
        if (result.hijriDate) {
          const dateKey = result.gregorianDate.toISOString().split('T')[0];
          hijriDateMap[dateKey] = result.hijriDate;
        }
      });
      
      setHijriDates(hijriDateMap);
      return hijriDateMap;
    },
    staleTime: 24 * 60 * 60 * 1000, // 24 hours
  });

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
  }, []);

  const formatGregorianDate = (date) => {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`; // Converts to dd-mm-yyyy
  };

  const getRamadanDates = () => {
    const dates = [];
    let currentDate = new Date(RAMADAN_START_DATE);

    while (currentDate <= RAMADAN_END_DATE) {
      dates.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return dates;
  };

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
      status: status as "fasted" | "missed",
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

  const getStatusColor = (status: "fasted" | "missed" | "none") => {
    switch (status) {
      case "fasted":
        return "green.500";
      case "missed":
        return "red.500";
      default:
        return "gray.300";
    }
  };

  const getStatusIcon = (status: "fasted" | "missed" | "none") => {
    switch (status) {
      case "fasted":
        return "✓";
      case "missed":
        return "✗";
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
        {isLoading ? (
          <Flex justifyContent="center" alignItems="center" height="200px">
            <Spinner color="ramadan.purple" size="xl" />
            <Text ml={4}>Loading Hijri calendar...</Text>
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
                const hijriData = hijriDates[dateString];
                
                const dateDay = date.getDate();
                const hijriDay = hijriData ? hijriData.day : "...";
                
                return (
                  <Tooltip
                    key={dateString}
                    label={
                      hijriData 
                        ? `${hijriData.weekday}, ${hijriData.fullDate} (${date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })})`
                        : `Gregorian: ${date.toLocaleDateString()}`
                    }
                    placement="top"
                    hasArrow
                  >
                    <MotionBox
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
                      <Text fontSize="md" fontWeight="bold" lineHeight="1.1">
                        {hijriDay}
                      </Text>
                      <Text fontSize="xs" color="gray.500" lineHeight="1">
                        {dateDay}
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
                  </Tooltip>
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
            </Flex>
          </>
        )}
      </CardBody>

      {/* Day status modal */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {selectedDate && hijriDates[selectedDate.toISOString().split("T")[0]] ? (
              <>
                {hijriDates[selectedDate.toISOString().split("T")[0]].fullDate}
                <Text fontSize="sm" fontWeight="normal" mt={1}>
                  {selectedDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </Text>
              </>
            ) : (
              selectedDate?.toLocaleDateString()
            )}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <RadioGroup value={status} onChange={(value) => setStatus(value as "fasted" | "missed" | "none")}>
              <Stack direction="column">
                <Radio value="fasted">Fasted</Radio>
                <Radio value="missed">Missed</Radio>
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
