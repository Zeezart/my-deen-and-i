
import { Box, Text, useColorModeValue, Spinner, Tooltip } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";

const HijriDate = () => {
  const [hijriDate, setHijriDate] = useState("");
  const [gregorianDate, setGregorianDate] = useState("");

  const getHijriDate = async (gregorianDate) => {
    try {
      const response = await fetch(`https://api.aladhan.com/v1/gToH?date=${gregorianDate}`);
      const data = await response.json();

      if (data.code === 200) {
        const hijriDay = data.data.hijri.day; // Day number
        const hijriMonth = data.data.hijri.month.en; // Month name (e.g., Ramadan)
        const hijriYear = data.data.hijri.year; // Year (1446)
        const hijriWeekday = data.data.hijri.weekday.en; // Weekday

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

  const { isLoading } = useQuery({
    queryKey: ['hijriDate'],
    queryFn: async () => {
      const today = new Date();
      const day = String(today.getDate()).padStart(2, "0");
      const month = String(today.getMonth() + 1).padStart(2, "0");
      const year = today.getFullYear();
      const formattedDate = `${day}-${month}-${year}`; // Converts to dd-mm-yyyy
      
      setGregorianDate(today.toLocaleDateString("en-GB"));
      
      const hijri = await getHijriDate(formattedDate);
      if (hijri) {
        setHijriDate(hijri);
        return hijri;
      }
      return null;
    },
    staleTime: 24 * 60 * 60 * 1000, // 24 hours
  });

  const bgColor = useColorModeValue("ramadan.gold", "ramadan.navy");
  const textColor = useColorModeValue("gray.800", "white");

  return (
    <Tooltip 
      label={`${hijriDate} (${gregorianDate})`} 
      placement="bottom" 
      hasArrow
    >
      <Box 
        p={3} 
        bg={bgColor} 
        color={textColor}
        borderRadius="md"
        textAlign="center"
        mb={4}
        boxShadow="md"
      >
        {isLoading ? (
          <Spinner size="sm" color={textColor} />
        ) : (
          <>
            <Text fontSize="md" fontWeight="bold">
              {hijriDate}
            </Text>
            <Text fontSize="xs">
              {gregorianDate}
            </Text>
          </>
        )}
      </Box>
    </Tooltip>
  );
};

export default HijriDate;
