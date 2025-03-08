
import { Box, Text, useColorModeValue, Spinner } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";

// Function to fetch Hijri date from API
const fetchHijriDate = async () => {
  // Using the AlAdhan API which is a reliable source for Islamic date calculations
  const response = await fetch("https://api.aladhan.com/v1/gToH?date=" + 
    new Date().toISOString().split('T')[0]);
  
  if (!response.ok) {
    throw new Error("Failed to fetch Hijri date");
  }
  
  const data = await response.json();
  return data.data;
};

// Calculate if it's Ramadan based on the Hijri date
const isRamadanMonth = (hijriMonth: number) => {
  return hijriMonth === 9; // Ramadan is the 9th month in Hijri calendar
};

const HijriDate = () => {
  const [gregorianDate, setGregorianDate] = useState(new Date());
  
  const { data: hijriData, isLoading, error } = useQuery({
    queryKey: ['hijri-date', gregorianDate.toISOString().split('T')[0]],
    queryFn: fetchHijriDate,
    staleTime: 1000 * 60 * 60 * 12, // 12 hours
    gcTime: 1000 * 60 * 60 * 24, // 24 hours
  });
  
  const bgColor = useColorModeValue("ramadan.gold", "ramadan.navy");
  const textColor = useColorModeValue("gray.800", "white");
  
  useEffect(() => {
    // Update date every day at midnight
    const timer = setInterval(() => {
      setGregorianDate(new Date());
    }, 1000 * 60 * 60 * 24);
    
    return () => {
      clearInterval(timer);
    };
  }, []);
  
  if (isLoading) {
    return (
      <Box 
        p={3} 
        bg={bgColor} 
        color={textColor}
        borderRadius="md"
        textAlign="center"
        mb={4}
        boxShadow="md"
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="60px"
      >
        <Spinner size="sm" mr={2} />
        <Text>Loading Islamic date...</Text>
      </Box>
    );
  }
  
  if (error) {
    return (
      <Box 
        p={3} 
        bg="red.100" 
        color="red.600"
        borderRadius="md"
        textAlign="center"
        mb={4}
        boxShadow="md"
      >
        <Text>Could not load Islamic date</Text>
      </Box>
    );
  }
  
  const isRamadan = hijriData && isRamadanMonth(parseInt(hijriData.hijri.month.number));
  const ramadanDay = isRamadan ? parseInt(hijriData.hijri.day) : 0;
  
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
        {hijriData?.hijri.day} {hijriData?.hijri.month.en} {hijriData?.hijri.year} AH
      </Text>
      <Text fontSize="xs">
        {gregorianDate.toLocaleDateString(undefined, { 
          weekday: 'long', 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        })}
      </Text>
      {isRamadan && (
        <Text fontSize="sm" fontWeight="bold" mt={1}>
          Ramadan Day {ramadanDay}
        </Text>
      )}
    </Box>
  );
};

export default HijriDate;
