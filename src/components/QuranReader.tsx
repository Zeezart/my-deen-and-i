
import {
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Flex,
  Heading,
  Text,
  IconButton,
  Spinner,
  Select,
  Stack,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Divider,
  useColorModeValue,
  useToast,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { BookOpen, ChevronLeft, ChevronRight, Bookmark } from "lucide-react";
import { getQuranProgress, saveQuranProgress } from "../services/storageService";
import { useQuranData } from "../hooks/useQuranData";

const MotionBox = motion(Box);

const QuranReader = () => {
  const toast = useToast();
  const { data: quranData, isLoading, error } = useQuranData();
  const [currentPage, setCurrentPage] = useState(1);
  const [currentSurah, setCurrentSurah] = useState(1);
  const [currentAyah, setCurrentAyah] = useState(1);
  const [currentJuz, setCurrentJuz] = useState(1);
  
  const bgColor = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.800", "gray.100");
  const arabicColor = useColorModeValue("ramadan.darkBlue", "ramadan.gold");
  
  useEffect(() => {
    // Load progress from local storage
    const progress = getQuranProgress();
    if (progress) {
      setCurrentPage(progress.page);
      setCurrentSurah(progress.surah);
      setCurrentAyah(progress.ayah);
      setCurrentJuz(progress.juz);
    }
  }, []);
  
  useEffect(() => {
    // Save progress automatically when user reads
    if (currentPage > 1 || currentSurah > 1 || currentAyah > 1) {
      const progress = {
        juz: currentJuz,
        page: currentPage,
        surah: currentSurah,
        ayah: currentAyah,
        lastUpdated: new Date().toISOString(),
      };
      saveQuranProgress(progress);
    }
  }, [currentPage, currentSurah, currentAyah, currentJuz]);
  
  const handleNextPage = () => {
    if (currentPage < 604) {
      setCurrentPage(prev => prev + 1);
      // Update surah, ayah and juz based on page
      // This would normally use real Quran data mapping
      if (currentPage % 20 === 0) {
        setCurrentJuz(prev => Math.min(30, prev + 1));
      }
      toast({
        title: "Progress Saved",
        description: "Your reading progress has been updated.",
        status: "info",
        duration: 2000,
        isClosable: true,
      });
    }
  };
  
  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
      // Update surah, ayah and juz based on page
      if (currentPage % 20 === 1) {
        setCurrentJuz(prev => Math.max(1, prev - 1));
      }
    }
  };
  
  const handleBookmark = () => {
    const progress = {
      juz: currentJuz,
      page: currentPage,
      surah: currentSurah,
      ayah: currentAyah,
      lastUpdated: new Date().toISOString(),
    };
    saveQuranProgress(progress);
    
    toast({
      title: "Bookmark Saved",
      description: "You can continue from here next time.",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };
  
  if (isLoading) {
    return (
      <Box textAlign="center" py={10}>
        <Spinner size="xl" color="ramadan.gold" />
        <Text mt={4}>Loading Quran...</Text>
      </Box>
    );
  }
  
  if (error) {
    return (
      <Box textAlign="center" py={10} color="red.500">
        <Text>Error loading Quran: {error.message}</Text>
        <Button mt={4} colorScheme="blue" onClick={() => window.location.reload()}>
          Retry
        </Button>
      </Box>
    );
  }
  
  return (
    <Card w="100%" overflow="hidden" bg={bgColor} boxShadow="md">
      <CardHeader bg="ramadan.deepBlue" py={4} color="white">
        <Flex justifyContent="space-between" alignItems="center">
          <Heading size="md">
            <Flex alignItems="center">
              <BookOpen size={20} style={{ marginRight: '8px' }} />
              Quran Reader
            </Flex>
          </Heading>
          <IconButton
            aria-label="Bookmark current position"
            icon={<Bookmark size={20} />}
            size="sm"
            colorScheme="yellow"
            onClick={handleBookmark}
          />
        </Flex>
      </CardHeader>
      
      <CardBody>
        <Tabs isFitted variant="soft-rounded" colorScheme="blue" mb={4}>
          <TabList mb={4}>
            <Tab>Read Quran</Tab>
            <Tab>Manual Progress</Tab>
          </TabList>
          
          <TabPanels>
            <TabPanel>
              <MotionBox
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                p={4}
                borderRadius="md"
                bg={useColorModeValue("gray.50", "gray.700")}
                textAlign="center"
              >
                <Text fontSize="md" fontWeight="bold" mb={2}>
                  Surah {currentSurah}, Ayah {currentAyah}, Page {currentPage}, Juz {currentJuz}
                </Text>
                
                <Box 
                  my={6} 
                  p={6} 
                  border="1px" 
                  borderColor={useColorModeValue("gray.200", "gray.600")} 
                  borderRadius="md"
                  minHeight="300px"
                  bg={useColorModeValue("white", "gray.800")}
                  textAlign="right"
                  dir="rtl"
                >
                  {/* This would normally display the actual Quran text from an API */}
                  <Text fontSize="xl" fontWeight="medium" color={arabicColor}>
                    {quranData ? (
                      quranData[currentPage - 1]?.text || "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ"
                    ) : (
                      "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ"
                    )}
                  </Text>
                </Box>
                
                <Flex justifyContent="space-between" alignItems="center" mt={4}>
                  <Button 
                    leftIcon={<ChevronLeft size={16} />} 
                    onClick={handlePrevPage}
                    isDisabled={currentPage <= 1}
                  >
                    Previous
                  </Button>
                  
                  <Text fontSize="sm" color="gray.500">
                    Page {currentPage} of 604
                  </Text>
                  
                  <Button 
                    rightIcon={<ChevronRight size={16} />} 
                    onClick={handleNextPage}
                    isDisabled={currentPage >= 604}
                  >
                    Next
                  </Button>
                </Flex>
              </MotionBox>
            </TabPanel>
            
            <TabPanel>
              <Stack spacing={4}>
                <Text fontWeight="medium">Update Your Reading Progress Manually</Text>
                
                <Flex direction={{ base: "column", md: "row" }} gap={4}>
                  <Box flex="1">
                    <Text mb={2} fontSize="sm">Juz</Text>
                    <Select 
                      value={currentJuz} 
                      onChange={(e) => setCurrentJuz(parseInt(e.target.value))}
                    >
                      {Array.from({ length: 30 }, (_, i) => (
                        <option key={i} value={i + 1}>
                          Juz {i + 1}
                        </option>
                      ))}
                    </Select>
                  </Box>
                  
                  <Box flex="1">
                    <Text mb={2} fontSize="sm">Page</Text>
                    <Select 
                      value={currentPage} 
                      onChange={(e) => setCurrentPage(parseInt(e.target.value))}
                    >
                      {Array.from({ length: 604 }, (_, i) => (
                        <option key={i} value={i + 1}>
                          Page {i + 1}
                        </option>
                      ))}
                    </Select>
                  </Box>
                </Flex>
                
                <Flex direction={{ base: "column", md: "row" }} gap={4}>
                  <Box flex="1">
                    <Text mb={2} fontSize="sm">Surah</Text>
                    <Select 
                      value={currentSurah} 
                      onChange={(e) => setCurrentSurah(parseInt(e.target.value))}
                    >
                      {Array.from({ length: 114 }, (_, i) => (
                        <option key={i} value={i + 1}>
                          Surah {i + 1}
                        </option>
                      ))}
                    </Select>
                  </Box>
                  
                  <Box flex="1">
                    <Text mb={2} fontSize="sm">Ayah</Text>
                    <Select 
                      value={currentAyah} 
                      onChange={(e) => setCurrentAyah(parseInt(e.target.value))}
                    >
                      {Array.from({ length: 286 }, (_, i) => (
                        <option key={i} value={i + 1}>
                          Ayah {i + 1}
                        </option>
                      ))}
                    </Select>
                  </Box>
                </Flex>
                
                <Button 
                  colorScheme="blue" 
                  mt={2}
                  onClick={() => {
                    const progress = {
                      juz: currentJuz,
                      page: currentPage,
                      surah: currentSurah,
                      ayah: currentAyah,
                      lastUpdated: new Date().toISOString(),
                    };
                    saveQuranProgress(progress);
                    
                    toast({
                      title: "Progress Updated",
                      description: "Your manual progress has been saved.",
                      status: "success",
                      duration: 3000,
                      isClosable: true,
                    });
                  }}
                >
                  Save Manual Progress
                </Button>
              </Stack>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </CardBody>
    </Card>
  );
};

export default QuranReader;
