
import {
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Flex,
  Heading,
  Text,
  FormControl,
  FormLabel,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Divider,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  useToast,
  Progress,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import {
  getQuranProgress,
  saveQuranProgress,
  getDefaultQuranProgress,
} from "../services/storageService";
import { motion } from "framer-motion";

const MotionBox = motion(Box);

const TOTAL_JUZ = 30;
const TOTAL_PAGES = 604;
const TOTAL_SURAHS = 114;

const formatLastUpdated = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString() + " at " + date.toLocaleTimeString();
};

const QuranTracker = () => {
  const [juz, setJuz] = useState(1);
  const [page, setPage] = useState(1);
  const [surah, setSurah] = useState(1);
  const [ayah, setAyah] = useState(1);
  const [lastUpdated, setLastUpdated] = useState<string>("");
  const toast = useToast();

  useEffect(() => {
    // Load progress from local storage
    const progress = getQuranProgress() || getDefaultQuranProgress();
    setJuz(progress.juz);
    setPage(progress.page);
    setSurah(progress.surah);
    setAyah(progress.ayah);
    setLastUpdated(progress.lastUpdated);
  }, []);

  const handleSave = () => {
    const progress = {
      juz,
      page,
      surah,
      ayah,
      lastUpdated: new Date().toISOString(),
    };
    
    saveQuranProgress(progress);
    setLastUpdated(progress.lastUpdated);
    
    toast({
      title: "Progress Saved",
      description: "Your Quran reading progress has been updated.",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  const pageProgress = Math.round((page / TOTAL_PAGES) * 100);
  const juzProgress = Math.round((juz / TOTAL_JUZ) * 100);
  const surahProgress = Math.round((surah / TOTAL_SURAHS) * 100);

  return (
    <Card w="100%" overflow="hidden">
      <CardHeader bg="ramadan.deepBlue" py={4} color="white">
        <Heading size="md">Quran Reading Tracker</Heading>
      </CardHeader>
      
      <CardBody>
        <SimpleGrid columns={{ base: 1, md: 3 }} gap={4} mb={6}>
          <Stat>
            <StatLabel>Current Juz</StatLabel>
            <StatNumber>{juz} / {TOTAL_JUZ}</StatNumber>
            <StatHelpText>
              <Progress value={juzProgress} size="sm" colorScheme="green" borderRadius="full" />
            </StatHelpText>
          </Stat>
          
          <Stat>
            <StatLabel>Current Page</StatLabel>
            <StatNumber>{page} / {TOTAL_PAGES}</StatNumber>
            <StatHelpText>
              <Progress value={pageProgress} size="sm" colorScheme="blue" borderRadius="full" />
            </StatHelpText>
          </Stat>
          
          <Stat>
            <StatLabel>Current Surah</StatLabel>
            <StatNumber>{surah} / {TOTAL_SURAHS}</StatNumber>
            <StatHelpText>
              <Progress value={surahProgress} size="sm" colorScheme="purple" borderRadius="full" />
            </StatHelpText>
          </Stat>
        </SimpleGrid>

        <Divider my={6} />

        <Text fontWeight="medium" mb={4}>
          Update Your Progress
        </Text>

        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
          <FormControl>
            <FormLabel>Juz</FormLabel>
            <NumberInput
              min={1}
              max={30}
              value={juz}
              onChange={(_, value) => setJuz(value)}
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
          </FormControl>
          
          <FormControl>
            <FormLabel>Page</FormLabel>
            <NumberInput
              min={1}
              max={604}
              value={page}
              onChange={(_, value) => setPage(value)}
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
          </FormControl>
          
          <FormControl>
            <FormLabel>Surah</FormLabel>
            <NumberInput
              min={1}
              max={114}
              value={surah}
              onChange={(_, value) => setSurah(value)}
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
          </FormControl>
          
          <FormControl>
            <FormLabel>Ayah</FormLabel>
            <NumberInput
              min={1}
              max={286}
              value={ayah}
              onChange={(_, value) => setAyah(value)}
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
          </FormControl>
        </SimpleGrid>

        <Flex justify="space-between" alignItems="center" mt={6}>
          <Text fontSize="xs" color="gray.500">
            {lastUpdated ? `Last updated: ${formatLastUpdated(lastUpdated)}` : "Not yet saved"}
          </Text>
          
          <MotionBox
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button onClick={handleSave} colorScheme="blue">
              Save Progress
            </Button>
          </MotionBox>
        </Flex>
      </CardBody>
    </Card>
  );
};

export default QuranTracker;
