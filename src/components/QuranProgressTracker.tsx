
import {
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Heading,
  Text,
  VStack,
  HStack,
  FormControl,
  FormLabel,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  useToast,
  Progress,
  Flex,
  Icon,
  useColorModeValue
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { saveQuranProgress, getQuranProgress, getDefaultQuranProgress } from "../services/storageService";

const MotionBox = motion(Box);

const QuranProgressTracker = () => {
  const [juz, setJuz] = useState(1);
  const [page, setPage] = useState(1);
  const [surah, setSurah] = useState(1);
  const [ayah, setAyah] = useState(1);
  const [progress, setProgress] = useState(0);
  const toast = useToast();
  
  const headerBg = useColorModeValue("ramadan.teal", "ramadan.navy");
  
  useEffect(() => {
    // Load saved progress
    const savedProgress = getQuranProgress();
    if (savedProgress) {
      setJuz(savedProgress.juz);
      setPage(savedProgress.page);
      setSurah(savedProgress.surah);
      setAyah(savedProgress.ayah);
      
      // Calculate progress percentage (604 pages in standard mushaf)
      const progressPercent = Math.min(100, Math.round((savedProgress.page / 604) * 100));
      setProgress(progressPercent);
    } else {
      // Set default values
      const defaultProgress = getDefaultQuranProgress();
      setJuz(defaultProgress.juz);
      setPage(defaultProgress.page);
      setSurah(defaultProgress.surah);
      setAyah(defaultProgress.ayah);
      setProgress(0);
    }
  }, []);
  
  const handleSaveProgress = () => {
    const newProgress = {
      juz,
      page,
      surah,
      ayah,
      lastUpdated: new Date().toISOString()
    };
    
    saveQuranProgress(newProgress);
    
    // Calculate progress percentage
    const progressPercent = Math.min(100, Math.round((page / 604) * 100));
    setProgress(progressPercent);
    
    toast({
      title: "Progress Saved",
      description: "Your Quran recitation progress has been updated.",
      status: "success",
      duration: 3000,
      isClosable: true
    });
  };
  
  // Helper to get Juz name
  const getJuzName = (juzNumber: number) => {
    const juzNames = [
      "Alif Lām Mīm",
      "Sayaqūl",
      "Tilka'r-Rusul",
      "Lan Tanālu",
      "Wa'l-Muḥṣanāt",
      "Lā Yuḥibbu'llāh",
      "Wa Idhā Samiʿū",
      "Wa Law Annanā",
      "Qāla'l-Mala'u",
      "Wa A'lamū",
      "Yaʿtadhirūna",
      "Wa Mā Min Dābbatin",
      "Wa Mā Ubarri'u",
      "Rubamā",
      "Subḥāna'lladhī",
      "Qāla Alam",
      "Iqtaraba Li'n-Nās",
      "Qad Aflaḥa",
      "Wa Qāla'lladhīna",
      "A'man Khalaqa",
      "Utlu Mā Ūḥiya",
      "Wa Man Yaqnut",
      "Wa Mā Liya",
      "Fa Man Aẓlamu",
      "Ilayhi Yuraddu",
      "Ḥā Mīm",
      "Qāla Fa Mā Khaṭbukum",
      "Qad Samiʿa'llāhu",
      "Tabāraka'lladhī",
      "ʿAmma"
    ];
    
    return juzNumber > 0 && juzNumber <= 30 ? juzNames[juzNumber - 1] : "";
  };
  
  return (
    <Card w="100%" overflow="hidden">
      <CardHeader bg={headerBg} py={4} color="white">
        <Heading size="md">Quran Progress Tracker</Heading>
      </CardHeader>
      
      <CardBody>
        <VStack spacing={6} align="stretch">
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Box mb={4}>
              <Progress 
                value={progress} 
                size="sm" 
                colorScheme="teal" 
                borderRadius="full"
              />
              <Flex justify="space-between" mt={1}>
                <Text fontSize="sm" color="gray.500">0%</Text>
                <Text fontSize="sm" fontWeight="medium" color="teal.500">{progress}%</Text>
                <Text fontSize="sm" color="gray.500">100%</Text>
              </Flex>
            </Box>
            
            <FormControl id="juz" mb={4}>
              <FormLabel fontWeight="medium">Juz</FormLabel>
              <Flex alignItems="center">
                <NumberInput 
                  min={1} 
                  max={30} 
                  value={juz} 
                  onChange={(_, value) => setJuz(value)}
                  width="100px"
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
                {juz > 0 && juz <= 30 && (
                  <Text ml={4} fontSize="sm" color="gray.600">
                    Juz {juz}: "{getJuzName(juz)}"
                  </Text>
                )}
              </Flex>
            </FormControl>
            
            <FormControl id="page" mb={4}>
              <FormLabel fontWeight="medium">Page</FormLabel>
              <NumberInput 
                min={1} 
                max={604} 
                value={page} 
                onChange={(_, value) => setPage(value)}
                width="100px"
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </FormControl>
            
            <FormControl id="surah" mb={4}>
              <FormLabel fontWeight="medium">Surah</FormLabel>
              <NumberInput 
                min={1} 
                max={114} 
                value={surah} 
                onChange={(_, value) => setSurah(value)}
                width="100px"
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </FormControl>
            
            <FormControl id="ayah" mb={6}>
              <FormLabel fontWeight="medium">Ayah</FormLabel>
              <NumberInput 
                min={1} 
                max={286} 
                value={ayah} 
                onChange={(_, value) => setAyah(value)}
                width="100px"
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </FormControl>
            
            <Button 
              colorScheme="teal"
              onClick={handleSaveProgress}
              width="100%"
            >
              Save Progress
            </Button>
            
            <Box mt={6} p={4} bg="gray.50" borderRadius="md">
              <Text fontSize="sm" color="gray.600">
                Update your Quran reading progress to track your journey through Ramadan.
                Your current pace is approximately {Math.floor(page / 604 * 30)} days to completion.
              </Text>
            </Box>
          </MotionBox>
        </VStack>
      </CardBody>
    </Card>
  );
};

export default QuranProgressTracker;
