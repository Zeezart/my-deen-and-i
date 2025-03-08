
import { Box, Text, useColorModeValue, Spinner } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";




const HijriDate = () => {
  const [hijriDate, setHijriDate] = useState("");

  const getHijriDate = async (gregorianDate) => {
    try {
      const response = await fetch(`https://api.aladhan.com/v1/gToH?date=${gregorianDate}`);
      const data = await response.json();

      if (data.code === 200) {
        const hijriDay = data.data.hijri.day; // Day number
        const hijriMonth = data.data.hijri.month.en; // Month name (e.g., Ramadan)
        const hijriYear = data.data.hijri.year; // Year (1446)

        return `${formatDayWithSuffix(hijriDay)} ${hijriMonth} ${hijriYear}`;
      } else {
        console.error("Error fetching Hijri date:", data);
        return null;
      }
    } catch (error) {
      console.error("API request failed:", error);
      return null;
    }
  };

  // Function to add "st", "nd", "rd", or "th" to the day
  const formatDayWithSuffix = (day) => {
    const suffixes = ["th", "st", "nd", "rd"];
    const mod = day % 10;
    const suffix = suffixes[(mod < 4 && day % 100 - mod !== 10) ? mod : 0];
    return `${day}${suffix}`;
  };

  useEffect(() => {
    const fetchHijriDate = async () => {
      const today = new Date();
      const day = String(today.getDate()).padStart(2, "0");
      const month = String(today.getMonth() + 1).padStart(2, "0");
      const year = today.getFullYear();
      const formattedDate = `${day}-${month}-${year}`; // Converts to dd-mm-yyyy

      const hijri = await getHijriDate(formattedDate);
      if (hijri) {
        setHijriDate(hijri);
      }
    };

    fetchHijriDate();
  }, []);

  const bgColor = useColorModeValue("ramadan.gold", "ramadan.navy");
  const textColor = useColorModeValue("gray.800", "white");
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
            Hijri Date: {hijriDate}
          </Text>
          <Text fontSize="xs">
            {new Date().toLocaleDateString("en-GB")}
          </Text>
          
        </Box>
      );
};

export default HijriDate;
