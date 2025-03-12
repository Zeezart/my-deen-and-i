
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
  useColorModeValue,
  Select
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { saveQuranProgress, getQuranProgress, getDefaultQuranProgress } from "../services/storageService";

const MotionBox = motion(Box);

// List of all 114 surahs in the Quran with their names
const surahs = [
  { number: 1, name: "Al-Fatihah (The Opening)" },
  { number: 2, name: "Al-Baqarah (The Cow)" },
  { number: 3, name: "Aal-Imran (The Family of Imran)" },
  { number: 4, name: "An-Nisa' (The Women)" },
  { number: 5, name: "Al-Ma'idah (The Table Spread)" },
  { number: 6, name: "Al-An'am (The Cattle)" },
  { number: 7, name: "Al-A'raf (The Heights)" },
  { number: 8, name: "Al-Anfal (The Spoils of War)" },
  { number: 9, name: "At-Tawbah (The Repentance)" },
  { number: 10, name: "Yunus (Jonah)" },
  { number: 11, name: "Hud (Hud)" },
  { number: 12, name: "Yusuf (Joseph)" },
  { number: 13, name: "Ar-Ra'd (The Thunder)" },
  { number: 14, name: "Ibrahim (Abraham)" },
  { number: 15, name: "Al-Hijr (The Rocky Tract)" },
  { number: 16, name: "An-Nahl (The Bee)" },
  { number: 17, name: "Al-Isra' (The Night Journey)" },
  { number: 18, name: "Al-Kahf (The Cave)" },
  { number: 19, name: "Maryam (Mary)" },
  { number: 20, name: "Ta-Ha (Ta-Ha)" },
  { number: 21, name: "Al-Anbiya' (The Prophets)" },
  { number: 22, name: "Al-Hajj (The Pilgrimage)" },
  { number: 23, name: "Al-Mu'minun (The Believers)" },
  { number: 24, name: "An-Nur (The Light)" },
  { number: 25, name: "Al-Furqan (The Criterion)" },
  { number: 26, name: "Ash-Shu'ara' (The Poets)" },
  { number: 27, name: "An-Naml (The Ants)" },
  { number: 28, name: "Al-Qasas (The Stories)" },
  { number: 29, name: "Al-'Ankabut (The Spider)" },
  { number: 30, name: "Ar-Rum (The Romans)" },
  { number: 31, name: "Luqman (Luqman)" },
  { number: 32, name: "As-Sajdah (The Prostration)" },
  { number: 33, name: "Al-Ahzab (The Combined Forces)" },
  { number: 34, name: "Saba' (Sheba)" },
  { number: 35, name: "Fatir (Originator)" },
  { number: 36, name: "Ya-Sin (Ya Sin)" },
  { number: 37, name: "As-Saffat (Those Who Set The Ranks)" },
  { number: 38, name: "Sad (The Letter Sad)" },
  { number: 39, name: "Az-Zumar (The Troops)" },
  { number: 40, name: "Ghafir (The Forgiver)" },
  { number: 41, name: "Fussilat (Explained in Detail)" },
  { number: 42, name: "Ash-Shura (The Consultation)" },
  { number: 43, name: "Az-Zukhruf (The Gold Adornments)" },
  { number: 44, name: "Ad-Dukhan (The Smoke)" },
  { number: 45, name: "Al-Jathiyah (The Kneeling)" },
  { number: 46, name: "Al-Ahqaf (The Wind-Curved Sandhills)" },
  { number: 47, name: "Muhammad (Muhammad)" },
  { number: 48, name: "Al-Fath (The Victory)" },
  { number: 49, name: "Al-Hujurat (The Rooms)" },
  { number: 50, name: "Qaf (The Letter Qaf)" },
  { number: 51, name: "Adh-Dhariyat (The Winnowing Winds)" },
  { number: 52, name: "At-Tur (The Mount)" },
  { number: 53, name: "An-Najm (The Star)" },
  { number: 54, name: "Al-Qamar (The Moon)" },
  { number: 55, name: "Ar-Rahman (The Beneficent)" },
  { number: 56, name: "Al-Waqi'ah (The Inevitable)" },
  { number: 57, name: "Al-Hadid (The Iron)" },
  { number: 58, name: "Al-Mujadilah (The Pleading Woman)" },
  { number: 59, name: "Al-Hashr (The Exile)" },
  { number: 60, name: "Al-Mumtahanah (The Examined One)" },
  { number: 61, name: "As-Saff (The Ranks)" },
  { number: 62, name: "Al-Jumu'ah (Friday)" },
  { number: 63, name: "Al-Munafiqun (The Hypocrites)" },
  { number: 64, name: "At-Taghabun (The Mutual Disillusion)" },
  { number: 65, name: "At-Talaq (The Divorce)" },
  { number: 66, name: "At-Tahrim (The Prohibition)" },
  { number: 67, name: "Al-Mulk (The Sovereignty)" },
  { number: 68, name: "Al-Qalam (The Pen)" },
  { number: 69, name: "Al-Haqqah (The Reality)" },
  { number: 70, name: "Al-Ma'arij (The Ascending Stairways)" },
  { number: 71, name: "Nuh (Noah)" },
  { number: 72, name: "Al-Jinn (The Jinn)" },
  { number: 73, name: "Al-Muzzammil (The Enshrouded One)" },
  { number: 74, name: "Al-Muddaththir (The Cloaked One)" },
  { number: 75, name: "Al-Qiyamah (The Resurrection)" },
  { number: 76, name: "Al-Insan (Man)" },
  { number: 77, name: "Al-Mursalat (The Emissaries)" },
  { number: 78, name: "An-Naba' (The Tidings)" },
  { number: 79, name: "An-Nazi'at (Those Who Drag Forth)" },
  { number: 80, name: "'Abasa (He Frowned)" },
  { number: 81, name: "At-Takwir (The Overthrowing)" },
  { number: 82, name: "Al-Infitar (The Cleaving)" },
  { number: 83, name: "Al-Mutaffifin (The Defrauding)" },
  { number: 84, name: "Al-Inshiqaq (The Sundering)" },
  { number: 85, name: "Al-Buruj (The Mansions of the Stars)" },
  { number: 86, name: "At-Tariq (The Morning Star)" },
  { number: 87, name: "Al-A'la (The Most High)" },
  { number: 88, name: "Al-Ghashiyah (The Overwhelming)" },
  { number: 89, name: "Al-Fajr (The Dawn)" },
  { number: 90, name: "Al-Balad (The City)" },
  { number: 91, name: "Ash-Shams (The Sun)" },
  { number: 92, name: "Al-Layl (The Night)" },
  { number: 93, name: "Ad-Duha (The Morning Hours)" },
  { number: 94, name: "Ash-Sharh (The Relief)" },
  { number: 95, name: "At-Tin (The Fig)" },
  { number: 96, name: "Al-'Alaq (The Clot)" },
  { number: 97, name: "Al-Qadr (The Power)" },
  { number: 98, name: "Al-Bayyinah (The Clear Proof)" },
  { number: 99, name: "Az-Zalzalah (The Earthquake)" },
  { number: 100, name: "Al-'Adiyat (The Coursers)" },
  { number: 101, name: "Al-Qari'ah (The Calamity)" },
  { number: 102, name: "At-Takathur (The Rivalry in World Increase)" },
  { number: 103, name: "Al-'Asr (The Declining Day)" },
  { number: 104, name: "Al-Humazah (The Traducer)" },
  { number: 105, name: "Al-Fil (The Elephant)" },
  { number: 106, name: "Quraysh (Quraysh)" },
  { number: 107, name: "Al-Ma'un (The Small Kindnesses)" },
  { number: 108, name: "Al-Kawthar (The Abundance)" },
  { number: 109, name: "Al-Kafirun (The Disbelievers)" },
  { number: 110, name: "An-Nasr (The Divine Support)" },
  { number: 111, name: "Al-Masad (The Palm Fiber)" },
  { number: 112, name: "Al-Ikhlas (The Sincerity)" },
  { number: 113, name: "Al-Falaq (The Daybreak)" },
  { number: 114, name: "An-Nas (Mankind)" }
];

// Object mapping juz number to page range
const juzPageMap = [
  { juz: 1, startPage: 1, endPage: 21 },
  { juz: 2, startPage: 22, endPage: 41 },
  { juz: 3, startPage: 42, endPage: 61 },
  { juz: 4, startPage: 62, endPage: 81 },
  { juz: 5, startPage: 82, endPage: 101 },
  { juz: 6, startPage: 102, endPage: 121 },
  { juz: 7, startPage: 122, endPage: 141 },
  { juz: 8, startPage: 142, endPage: 161 },
  { juz: 9, startPage: 162, endPage: 181 },
  { juz: 10, startPage: 182, endPage: 201 },
  { juz: 11, startPage: 202, endPage: 221 },
  { juz: 12, startPage: 222, endPage: 241 },
  { juz: 13, startPage: 242, endPage: 261 },
  { juz: 14, startPage: 262, endPage: 281 },
  { juz: 15, startPage: 282, endPage: 301 },
  { juz: 16, startPage: 302, endPage: 321 },
  { juz: 17, startPage: 322, endPage: 341 },
  { juz: 18, startPage: 342, endPage: 361 },
  { juz: 19, startPage: 362, endPage: 381 },
  { juz: 20, startPage: 382, endPage: 401 },
  { juz: 21, startPage: 402, endPage: 421 },
  { juz: 22, startPage: 422, endPage: 441 },
  { juz: 23, startPage: 442, endPage: 461 },
  { juz: 24, startPage: 462, endPage: 481 },
  { juz: 25, startPage: 482, endPage: 501 },
  { juz: 26, startPage: 502, endPage: 521 },
  { juz: 27, startPage: 522, endPage: 541 },
  { juz: 28, startPage: 542, endPage: 561 },
  { juz: 29, startPage: 562, endPage: 581 },
  { juz: 30, startPage: 582, endPage: 604 }
];

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

  // Update juz based on page number
  useEffect(() => {
    // Find which juz contains this page
    const juzEntry = juzPageMap.find(entry => page >= entry.startPage && page <= entry.endPage);
    if (juzEntry && juzEntry.juz !== juz) {
      setJuz(juzEntry.juz);
    }
  }, [page]);
  
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
              <Select 
                value={surah} 
                onChange={handleSurahChange}
              >
                {surahs.map(s => (
                  <option key={s.number} value={s.number}>
                    {s.number}. {s.name}
                  </option>
                ))}
              </Select>
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
