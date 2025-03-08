
import { Box, Text, useColorModeValue } from "@chakra-ui/react";
import { useState, useEffect } from "react";

// Improved Hijri date converter
const gregorianToHijri = (date: Date) => {
  // Corrected calculation
  const day = date.getDate();
  const month = date.getMonth();
  const year = date.getFullYear();
  
  // Julian day calculation
  let jd = Math.floor((365.25 * (year + 4716))) + Math.floor((30.6001 * (month + 1))) + day - 1524.5;
  
  // Adjust for Gregorian calendar
  if (jd > 2299160) {
    const a = Math.floor((year / 100));
    jd += 2 - a + Math.floor((a / 4));
  }
  
  // Calculate Hijri date
  const b = Math.floor(((jd - 1867216.25) / 36524.25));
  const c = jd + b - Math.floor((b / 4)) - 1525;
  
  // Days since start of Hijri era
  const daysSinceHijri = jd - 1948084;
  
  // Calculate Hijri year, month, day
  const hYear = Math.floor(((30 * daysSinceHijri + 10646) / 10631));
  const hMonth = Math.floor((daysSinceHijri - 29 * Math.floor(((hYear * 10631) / 30)) + 29) / 29.5);
  const hDay = Math.floor(daysSinceHijri - Math.floor(((hYear * 10631) / 30)) - Math.floor((hMonth * 29.5)) + 1);
  
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
  
  // Get month index (0-based)
  const monthIndex = Math.max(0, Math.min(11, Math.floor(hMonth - 1)));
  
  // Hard-coded Ramadan 2024 dates based on official announcement
  // Ramadan 1445 starts on March 11, 2024 and ends on April 9, 2024
  const ramadanStart2024 = new Date(2024, 2, 11); // Month is 0-indexed in JS
  const ramadanEnd2024 = new Date(2024, 3, 9);
  
  const isRamadan = date >= ramadanStart2024 && date <= ramadanEnd2024;
  
  let ramadanDay = 0;
  if (isRamadan) {
    ramadanDay = Math.floor(
      (date.getTime() - ramadanStart2024.getTime()) / (1000 * 60 * 60 * 24)
    ) + 1;
  }
  
  return {
    day: Math.round(hDay),
    month: monthIndex,
    monthName: islamicMonths[monthIndex],
    year: Math.round(hYear),
    isRamadan,
    ramadanDay
  };
};

const HijriDate = () => {
  const [date, setDate] = useState(new Date());
  const [hijriDate, setHijriDate] = useState<ReturnType<typeof gregorianToHijri> | null>(null);
  
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
