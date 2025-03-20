import {
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Heading,
  Text,
  VStack,
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
  useColorModeValue,
  Select
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { saveQuranProgress, getQuranProgress, getDefaultQuranProgress } from "../services/storageService";
import axios from "axios"

const MotionBox = motion(Box);

// Object mapping juz number to page range
const juzPageMap = [
  { juz: 1, startPage: 1, endPage: 21 },
  { juz: 2, startPage: 22, endPage: 42 },
  { juz: 3, startPage: 43, endPage: 63 },
  { juz: 4, startPage: 64, endPage: 84 },
  { juz: 5, startPage: 85, endPage: 105 },
  { juz: 6, startPage: 106, endPage: 126 },
  { juz: 7, startPage: 127, endPage: 147 },
  { juz: 8, startPage: 148, endPage: 168 },
  { juz: 9, startPage: 169, endPage: 189 },
  { juz: 10, startPage: 190, endPage: 210 },
  { juz: 11, startPage: 211, endPage: 231 },
  { juz: 12, startPage: 232, endPage: 252 },
  { juz: 13, startPage: 253, endPage: 273 },
  { juz: 14, startPage: 274, endPage: 294 },
  { juz: 15, startPage: 295, endPage: 315 },
  { juz: 16, startPage: 316, endPage: 336 },
  { juz: 17, startPage: 337, endPage: 357 },
  { juz: 18, startPage: 358, endPage: 378 },
  { juz: 19, startPage: 379, endPage: 399 },
  { juz: 20, startPage: 400, endPage: 420 },
  { juz: 21, startPage: 421, endPage: 441 },
  { juz: 22, startPage: 442, endPage: 462 },
  { juz: 23, startPage: 463, endPage: 483 },
  { juz: 24, startPage: 484, endPage: 504 },
  { juz: 25, startPage: 505, endPage: 525 },
  { juz: 26, startPage: 526, endPage: 546 },
  { juz: 27, startPage: 547, endPage: 567 },
  { juz: 28, startPage: 568, endPage: 588 },
  { juz: 29, startPage: 589, endPage: 609 },
  { juz: 30, startPage: 610, endPage: 630 }
];

const QuranProgressTracker = () => {
  const [juz, setJuz] = useState(1);
  const [page, setPage] = useState(1);
  const [surah, setSurah] = useState(1);
  const [ayah, setAyah] = useState(1);
  const [progress, setProgress] = useState(0);
  const toast = useToast();
  
  const headerBg = useColorModeValue("ramadan.teal", "ramadan.navy");

  const [surahList, setSurahList] = useState<any[]>([])
  useEffect(()=>{
    const getSurahList = async () => {
      try{
        const response = await axios.get("https://quranapi.pages.dev/api/surah.json")
        setSurahList(response.data)
      }catch(error){
        console.error(error.message)
      }
    }

    getSurahList()
  },[])


  useEffect(() => {
    // Load saved progress
    const savedProgress = getQuranProgress();
    if (savedProgress) {
      setPage(savedProgress.page);
      setSurah(savedProgress.surah);
      setAyah(savedProgress.ayah);
      
      // Calculate progress percentage (604 pages in standard mushaf)
      const progressPercent = Math.min(100, Math.round((savedProgress.page / 604) * 100));
      setProgress(progressPercent);
      
      // Calculate juz based on page
      calculateJuz(savedProgress.page);
    } else {
      // Set default values
      const defaultProgress = getDefaultQuranProgress();
      setPage(defaultProgress.page);
      setSurah(defaultProgress.surah);
      setAyah(defaultProgress.ayah);
      setProgress(0);
      calculateJuz(defaultProgress.page);
    }
  }, []);

  // Calculate juz based on page number
  const calculateJuz = (pageNumber: number) => {
    const juzEntry = juzPageMap.find(entry => 
      pageNumber >= entry.startPage && pageNumber <= entry.endPage
    );
    if (juzEntry) {
      setJuz(juzEntry.juz);
    }
  };
  
  // Update juz when page changes
  useEffect(() => {
    calculateJuz(page);
  }, [page]);
  
  const handleSaveProgress = () => {
    const newProgress = {
      juz, // This is still saved but now calculated automatically
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
  
  const handleSurahChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = parseInt(e.target.value);
    setSurah(value);
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
            
            <FormControl id="surah" mb={4}>
              <FormLabel fontWeight="medium">Surah</FormLabel>
              <Select 
                value={surah} 
                onChange={handleSurahChange}
              >
                {surahList.map((s,index) => (
                  <option key={index+1} value={index+1}>
                    {index+1}. {s.surahName}
                  </option>
                ))}
              </Select>
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
            
            <Box mb={6} p={4} bg="gray.50" borderRadius="md">
              <Text fontSize="md" fontWeight="medium" mb={2}>
                Current Position: Juz {juz} ({getJuzName(juz)})
              </Text>
              
            </Box>
            
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
