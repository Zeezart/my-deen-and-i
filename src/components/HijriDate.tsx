
import { Box, Text, useColorModeValue } from "@chakra-ui/react";
import { useState, useEffect } from "react";

// Simple Hijri date converter based on the Umm al-Qura calendar
// This is a simplified version for demonstration purposes
const gregorianToHijri = (date: Date) => {
  const islamicYear = Math.floor((date.getFullYear() - 621.5643) * (33 / 32));
  const dayOfYear = Math.floor(
    (date - new Date(date.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24)
  );
  const islamicMonths = [
    "Muharram",
    "Safar",
    "Rabi' al-Awwal",
    "Rabi' al-Thani",
    "Jumada al-Awwal",
    "Jumada al-Thani",
    "Rajab",
    "Sha'ban",
    "Ramadan",
    "Shawwal",
    "Dhu al-Qi'dah",
    "Dhu al-Hijjah"
  ];
  
  // Approximation - this would normally require a more complex calculation
  const approxDaysSinceStartOfIslamicYear = (dayOfYear + 354 - 10) % 354;
  let islamicMonth = Math.floor(approxDaysSinceStartOfIslamicYear / 29.5);
  if (islamicMonth >= 12) islamicMonth = 11;
  
  const islamicDay = Math.floor(approxDaysSinceStartOfIslamicYear % 29.5) + 1;
  
  // Hard-coded Ramadan start for 2024 (March 11, 2024)
  // In a real application, you would use a more accurate calculation or an API
  const ramadanStart2024 = new Date(2024, 2, 11);
  const isRamadan = date >= ramadanStart2024 && 
    date <= new Date(2024, 3, 9);  // April 9, 2024 - end of Ramadan
  
  let ramadanDay = 0;
  if (isRamadan) {
    ramadanDay = Math.floor(
      (date.getTime() - ramadanStart2024.getTime()) / (1000 * 60 * 60 * 24)
    ) + 1;
  }
  
  return {
    day: islamicDay,
    month: islamicMonth,
    monthName: islamicMonths[islamicMonth],
    year: islamicYear,
    isRamadan,
    ramadanDay
  };
};

const HijriDate = () => {
  const [date, setDate] = useState(new Date());
  const [hijriDate, setHijriDate] = useState(null);
  
  const bgColor = useColorModeValue("ramadan.gold", "ramadan.navy");
  const textColor = useColorModeValue("gray.800", "white");
  
  useEffect(() => {
    // Update date every day at midnight
    const timer = setInterval(() => {
      setDate(new Date());
    }, 1000 * 60 * 60 * 24);
    
    setHijriDate(gregorianToHijri(date));
    
    return () => {
      clearInterval(timer);
    };
  }, []);
  
  // Update Hijri date when gregorian date changes
  useEffect(() => {
    setHijriDate(gregorianToHijri(date));
  }, [date]);
  
  if (!hijriDate) return null;
  
  return (
    <Box 
      p={3} 
      bg={bgColor} 
      color={textColor}
      borderRadius="md"
      textAlign="center"
      mb={4}
      boxShadow="md"
    >
      <Text fontSize="sm" fontWeight="bold">
        {hijriDate.day} {hijriDate.monthName} {hijriDate.year} AH
      </Text>
      <Text fontSize="xs">
        {date.toLocaleDateString(undefined, { 
          weekday: 'long', 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        })}
      </Text>
      {hijriDate.isRamadan && (
        <Text fontSize="sm" fontWeight="bold" mt={1}>
          Ramadan Day {hijriDate.ramadanDay}
        </Text>
      )}
    </Box>
  );
};

export default HijriDate;
