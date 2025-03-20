
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
  Badge,
  Collapse
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { morningAdhkar, eveningAdhkar, generalAdhkar } from "@/data/adhkars";

// Function to fetch adhkar data from API
const fetchAdhkar = async (category: string) => {
  return getMockAdhkar(category);
};


const getMockAdhkar = (category: string) => {
  
  if (category === "morning") return morningAdhkar;
  if (category === "evening") return eveningAdhkar;
  return generalAdhkar;
};

const AdhkarSection = () => {
  const [selectedCategory, setSelectedCategory] = useState("morning");
  const [expandedIndex, setExpandedIndex] = useState<number[]>([0]);
  const [showAll, setShowAll] = useState(false);
  
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
    setExpandedIndex([0]);
    setShowAll(false);
  };

  // Define the number of adhkar to show initially
  const initialAdhkarCount = 6;
  
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
                  <>
                    <Accordion allowMultiple index={expandedIndex} onChange={(indices: number[]) => setExpandedIndex(indices)}>
                      {adhkar?.slice(0, showAll ? adhkar.length : initialAdhkarCount).map((dhikr, index) => (
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
                              <Text fontSize="lg" fontWeight="bold" fontFamily="serif" dir="rtl" width="100%" textAlign="right">
                                {dhikr.arabic}
                              </Text>
                              <Text color="gray.600">
                                {dhikr.translation}
                              </Text>
                              <Flex width="100%" justifyContent="space-between" fontSize="sm">
                                <Text color="purple.600">
                                  {dhikr.repeat > 1 && `Repeat ${dhikr.repeat} times`}
                                </Text>
                                <Text color="gray.500">
                                  Reference: {dhikr.reference}
                                </Text>
                              </Flex>
                            </VStack>
                          </AccordionPanel>
                        </AccordionItem>
                      ))}
                    </Accordion>
                    
                    {adhkar && adhkar.length > initialAdhkarCount && (
                      <Flex justify="center" mt={4}>
                        <Button 
                          size="sm" 
                          colorScheme="purple" 
                          variant="outline"
                          onClick={() => setShowAll(!showAll)}
                        >
                          {showAll ? "Show Less" : `Show More (${adhkar.length - initialAdhkarCount} more)`}
                        </Button>
                      </Flex>
                    )}
                  </>
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
