
import {
  Box,
  Card,
  CardBody,
  CardHeader,
  Heading,
  Text,
  VStack,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Flex,
  Spinner,
  Button,
  useColorModeValue,
  Badge
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";

// Function to fetch adhkar data from API
const fetchAdhkar = async (category: string) => {
  // Using HisnulMuslim API (placeholder URL - would need to be replaced with the actual API endpoint)
  const response = await fetch(`https://api.sunnah.com/v1/hadiths/random?category=${category}&limit=20`);
  
  if (!response.ok) {
    // For demo purposes, return mock data if API fails
    return getMockAdhkar(category);
  }
  
  const data = await response.json();
  return data;
};

// Mock adhkar data for demonstration
const getMockAdhkar = (category: string) => {
  const morningAdhkar = [
    {
      id: 1,
      arabic: "أَصْـبَحْنا وَأَصْـبَحَ المُـلْكُ لله وَالحَمدُ لله، لا إلهَ إلاّ اللّهُ وَحدَهُ لا شَريكَ لهُ",
      translation: "We have reached the morning and at this very time all sovereignty belongs to Allah. All praise is for Allah. None has the right to be worshipped except Allah, alone, without any partner.",
      repeat: 1
    },
    {
      id: 2,
      arabic: "اللّهُـمَّ إِنِّـي أَسْـأَلُـكَ عِلْمـاً نافِعـاً وَرِزْقـاً طَيِّـباً ، وَعَمَـلاً مُتَقَـبَّلاً",
      translation: "O Allah, I ask You for knowledge that is beneficial and sustenance that is good, and deeds that will be accepted.",
      repeat: 1
    },
    {
      id: 3,
      arabic: "سُبْحـانَ اللهِ وَبِحَمْـدِهِ عَدَدَ خَلْـقِه ، وَرِضـا نَفْسِـه ، وَزِنَـةَ عَـرْشِـه ، وَمِـدادَ كَلِمـاتِـه",
      translation: "Glory is to Allah and praise is to Him, by the multitude of His creation, by His Pleasure, by the weight of His Throne, and by the extent of His Words.",
      repeat: 3
    }
  ];
  
  const eveningAdhkar = [
    {
      id: 4,
      arabic: "أَمْسَيْـنا وَأَمْسـى المـلكُ لله وَالحَمدُ لله، لا إلهَ إلاّ اللّهُ وَحدَهُ لا شَريكَ لهُ",
      translation: "We have reached the evening and at this very time all sovereignty belongs to Allah. All praise is for Allah. None has the right to be worshipped except Allah, alone, without any partner.",
      repeat: 1
    },
    {
      id: 5,
      arabic: "اللّهُـمَّ بِكَ أَمْسَـينا، وَبِكَ أَصْـبَحْنا، وَبِكَ نَحْـيا، وَبِكَ نَمُـوتُ وَإِلَـيْكَ المَصِيرُ",
      translation: "O Allah, by You we reach the evening and by You we reach the morning, by You we live and by You we die and to You is the final return.",
      repeat: 1
    },
    {
      id: 6,
      arabic: "أَعـوذُ بِكَلِمـاتِ اللّهِ التّـامّـاتِ مِنْ شَـرِّ ما خَلَـق",
      translation: "I seek refuge in the perfect words of Allah from the evil of what He has created.",
      repeat: 3
    }
  ];
  
  const generalAdhkar = [
    {
      id: 7,
      arabic: "لا إلهَ إلاّ اللّهُ وحدَهُ لا شريكَ لهُ، لهُ المُلكُ ولهُ الحَمدُ وهوَ على كلّ شيءٍ قدير",
      translation: "None has the right to be worshipped except Allah, alone, without any partner. To Him belongs all sovereignty and praise and He is over all things omnipotent.",
      repeat: 10
    },
    {
      id: 8,
      arabic: "سُبْحـانَ اللهِ وَبِحَمْـدِهِ",
      translation: "Glory is to Allah and praise is to Him.",
      repeat: 100
    },
    {
      id: 9,
      arabic: "أسْتَغْفِرُ اللهَ وَأتُوبُ إلَيْهِ",
      translation: "I seek the forgiveness of Allah and repent to Him.",
      repeat: 100
    }
  ];
  
  if (category === "morning") return morningAdhkar;
  if (category === "evening") return eveningAdhkar;
  return generalAdhkar;
};

const AdhkarSection = () => {
  const [selectedCategory, setSelectedCategory] = useState("morning");
  const [expandedIndex, setExpandedIndex] = useState<number[]>([0]);
  
  const { data: adhkar, isLoading, error } = useQuery({
    queryKey: ['adhkar', selectedCategory],
    queryFn: () => fetchAdhkar(selectedCategory),
    staleTime: 1000 * 60 * 60, // 1 hour
    gcTime: 1000 * 60 * 60 * 24, // 24 hours
  });
  
  const headerBg = useColorModeValue("ramadan.navy", "ramadan.deepBlue");
  const cardBg = useColorModeValue("white", "gray.800");
  
  const handleTabChange = (index: number) => {
    if (index === 0) setSelectedCategory("morning");
    else if (index === 1) setSelectedCategory("evening");
    else setSelectedCategory("general");
    
    // Reset expanded accordion items when changing tabs
    setExpandedIndex([0]);
  };
  
  return (
    <Card w="100%" overflow="hidden">
      <CardHeader bg={headerBg} py={4} color="white">
        <Heading size="md">Daily Adhkar</Heading>
      </CardHeader>
      
      <CardBody>
        <Tabs isFitted variant="soft-rounded" colorScheme="purple" onChange={handleTabChange}>
          <TabList mb={4}>
            <Tab>Morning Adhkar</Tab>
            <Tab>Evening Adhkar</Tab>
            <Tab>General Adhkar</Tab>
          </TabList>
          
          <TabPanels>
            {["morning", "evening", "general"].map((category, idx) => (
              <TabPanel key={category} p={0}>
                {isLoading ? (
                  <Flex justify="center" align="center" py={10}>
                    <Spinner size="lg" color="purple.500" />
                  </Flex>
                ) : error ? (
                  <Box p={4} bg="red.50" borderRadius="md" textAlign="center">
                    <Text color="red.500">Failed to load adhkar. Please try again later.</Text>
                  </Box>
                ) : (
                  <Accordion allowMultiple index={expandedIndex} onChange={(indices: number[]) => setExpandedIndex(indices)}>
                    {adhkar?.map((dhikr, index) => (
                      <AccordionItem key={dhikr.id} mb={2} border="1px solid" borderColor="gray.200" borderRadius="md">
                        <h2>
                          <AccordionButton _expanded={{ bg: "purple.50", color: "purple.700" }}>
                            <Box flex="1" textAlign="left" fontWeight="medium">
                              {dhikr.arabic.length > 40 ? dhikr.arabic.substring(0, 40) + "..." : dhikr.arabic}
                            </Box>
                            {dhikr.repeat > 1 && (
                              <Badge colorScheme="purple" mr={2}>
                                {dhikr.repeat}x
                              </Badge>
                            )}
                            <AccordionIcon />
                          </AccordionButton>
                        </h2>
                        <AccordionPanel pb={4}>
                          <VStack align="start" spacing={3}>
                            <Text fontSize="lg" fontWeight="bold" fontFamily="serif">
                              {dhikr.arabic}
                            </Text>
                            <Text color="gray.600">
                              {dhikr.translation}
                            </Text>
                            {dhikr.repeat > 1 && (
                              <Text fontSize="sm" color="purple.600">
                                Repeat {dhikr.repeat} times
                              </Text>
                            )}
                          </VStack>
                        </AccordionPanel>
                      </AccordionItem>
                    ))}
                  </Accordion>
                )}
              </TabPanel>
            ))}
          </TabPanels>
        </Tabs>
      </CardBody>
    </Card>
  );
};

export default AdhkarSection;
