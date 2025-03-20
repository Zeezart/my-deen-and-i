
import { Box, Text, useColorModeValue, Spinner, Tooltip } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { getHijriDateFormatted } from "./FastingCalendar";


const HijriDate = () => {
  const [hijriDate, setHijriDate] = useState({
    dayFormatted: "",
    day: "",
    month: "",
    year: "",
    fullDate: "",
    weekday: ""
  });
  const [gregorianDate, setGregorianDate] = useState("");

  const { isLoading } = useQuery({
    queryKey: ['hijriDate'],
    queryFn: async () => {
      const today = new Date();
      const day = String(today.getDate()).padStart(2, "0");
      const month = String(today.getMonth() + 1).padStart(2, "0");
      const year = today.getFullYear();
      const formattedDate = `${day}-${month}-${year}`; 
      
      setGregorianDate(today.toLocaleDateString("en-GB"));
      
      const hijri = await getHijriDateFormatted(formattedDate);
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
              {hijriDate.fullDate}
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
