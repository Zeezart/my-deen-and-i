
import {
  Box,
  Text,
  SimpleGrid,
  Card,
  CardBody,
  Heading,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Flex,
} from "@chakra-ui/react";
import { useEffect, useState, useMemo } from "react";
import { getFastingDays, getMissedFastingDays, getQuranProgress } from "../services/storageService";
import { motion } from "framer-motion";

const MotionBox = motion(Box);

// Collection of Quranic duas with translations
const quranDuas = [
  {
    arabic: "رَبَّنَا تَقَبَّلْ مِنَّا ۖ إِنَّكَ أَنتَ السَّمِيعُ الْعَلِيمُ",
    translation: "Our Lord, accept this from us. Indeed, You are the Hearing, the Knowing.",
    reference: "Quran 2:127"
  },
  {
    arabic: "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ",
    translation: "Our Lord, give us good in this world and good in the Hereafter and protect us from the punishment of the Fire.",
    reference: "Quran 2:201"
  },
  {
    arabic: "رَبَّنَا أَفْرِغْ عَلَيْنَا صَبْرًا وَثَبِّتْ أَقْدَامَنَا وَانصُرْنَا عَلَى الْقَوْمِ الْكَافِرِينَ",
    translation: "Our Lord, pour upon us patience and plant firmly our feet and give us victory over the disbelieving people.",
    reference: "Quran 2:250"
  },
  {
    arabic: "رَبَّنَا لَا تُؤَاخِذْنَا إِن نَّسِينَا أَوْ أَخْطَأْنَا",
    translation: "Our Lord, do not impose blame upon us if we have forgotten or erred.",
    reference: "Quran 2:286"
  },
  {
    arabic: "رَبَّنَا وَلَا تَحْمِلْ عَلَيْنَا إِصْرًا كَمَا حَمَلْتَهُ عَلَى الَّذِينَ مِن قَبْلِنَا",
    translation: "Our Lord, and lay not upon us a burden like that which You laid upon those before us.",
    reference: "Quran 2:286"
  },
  {
    arabic: "رَبَّنَا وَلَا تُحَمِّلْنَا مَا لَا طَاقَةَ لَنَا بِهِ",
    translation: "Our Lord, and burden us not with that which we have no ability to bear.",
    reference: "Quran 2:286"
  },
  {
    arabic: "رَبَّنَا لَا تُزِغْ قُلُوبَنَا بَعْدَ إِذْ هَدَيْتَنَا وَهَبْ لَنَا مِن لَّدُنكَ رَحْمَةً",
    translation: "Our Lord, let not our hearts deviate after You have guided us and grant us from Yourself mercy.",
    reference: "Quran 3:8"
  },
  {
    arabic: "رَبَّنَا إِنَّنَا آمَنَّا فَاغْفِرْ لَنَا ذُنُوبَنَا وَقِنَا عَذَابَ النَّارِ",
    translation: "Our Lord, indeed we have believed, so forgive us our sins and protect us from the punishment of the Fire.",
    reference: "Quran 3:16"
  },
  {
    arabic: "رَبَّنَا آمَنَّا بِمَا أَنزَلْتَ وَاتَّبَعْنَا الرَّسُولَ فَاكْتُبْنَا مَعَ الشَّاهِدِينَ",
    translation: "Our Lord, we have believed in what You revealed and have followed the messenger, so register us among the witnesses.",
    reference: "Quran 3:53"
  },
  {
    arabic: "رَبَّنَا اغْفِرْ لَنَا ذُنُوبَنَا وَإِسْرَافَنَا فِي أَمْرِنَا وَثَبِّتْ أَقْدَامَنَا وَانصُرْنَا عَلَى الْقَوْمِ الْكَافِرِينَ",
    translation: "Our Lord, forgive us our sins and the excess in our affairs and plant firmly our feet and give us victory over the disbelieving people.",
    reference: "Quran 3:147"
  },
  {
    arabic: "رَبَّنَا مَا خَلَقْتَ هَٰذَا بَاطِلًا سُبْحَانَكَ فَقِنَا عَذَابَ النَّارِ",
    translation: "Our Lord, You did not create this in vain; exalted are You. Protect us from the punishment of the Fire.",
    reference: "Quran 3:191"
  },
  {
    arabic: "رَبَّنَا إِنَّكَ مَن تُدْخِلِ النَّارَ فَقَدْ أَخْزَيْتَهُ ۖ وَمَا لِلظَّالِمِينَ مِنْ أَنصَارٍ",
    translation: "Our Lord, indeed whoever You admit to the Fire - You have disgraced him, and for the wrongdoers there are no helpers.",
    reference: "Quran 3:192"
  },
  {
    arabic: "رَبَّنَا إِنَّنَا سَمِعْنَا مُنَادِيًا يُنَادِي لِلْإِيمَانِ أَنْ آمِنُوا بِرَبِّكُمْ فَآمَنَّا",
    translation: "Our Lord, indeed we have heard a caller calling to faith, [saying], 'Believe in your Lord,' and we have believed.",
    reference: "Quran 3:193"
  },
  {
    arabic: "رَبَّنَا فَاغْفِرْ لَنَا ذُنُوبَنَا وَكَفِّرْ عَنَّا سَيِّئَاتِنَا وَتَوَفَّنَا مَعَ الْأَبْرَارِ",
    translation: "Our Lord, so forgive us our sins and remove from us our misdeeds and cause us to die with the righteous.",
    reference: "Quran 3:193"
  },
  {
    arabic: "رَبَّنَا وَآتِنَا مَا وَعَدتَّنَا عَلَىٰ رُسُلِكَ وَلَا تُخْزِنَا يَوْمَ الْقِيَامَةِ",
    translation: "Our Lord, and grant us what You promised us through Your messengers and do not disgrace us on the Day of Resurrection.",
    reference: "Quran 3:194"
  },
  {
    arabic: "رَبَّنَا ظَلَمْنَا أَنفُسَنَا وَإِن لَّمْ تَغْفِرْ لَنَا وَتَرْحَمْنَا لَنَكُونَنَّ مِنَ الْخَاسِرِينَ",
    translation: "Our Lord, we have wronged ourselves, and if You do not forgive us and have mercy upon us, we will surely be among the losers.",
    reference: "Quran 7:23"
  },
  {
    arabic: "رَبَّنَا افْتَحْ بَيْنَنَا وَبَيْنَ قَوْمِنَا بِالْحَقِّ وَأَنتَ خَيْرُ الْفَاتِحِينَ",
    translation: "Our Lord, decide between us and our people in truth, and You are the best of those who give decision.",
    reference: "Quran 7:89"
  },
  {
    arabic: "رَبَّنَا أَفْرِغْ عَلَيْنَا صَبْرًا وَتَوَفَّنَا مُسْلِمِينَ",
    translation: "Our Lord, pour upon us patience and let us die as Muslims [in submission to You].",
    reference: "Quran 7:126"
  },
  {
    arabic: "رَبَّنَا لَا تَجْعَلْنَا مَعَ الْقَوْمِ الظَّالِمِينَ",
    translation: "Our Lord, do not place us with the wrongdoing people.",
    reference: "Quran 7:47"
  },
  {
    arabic: "حَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ",
    translation: "Sufficient for us is Allah, and [He is] the best Disposer of affairs.",
    reference: "Quran 3:173"
  },
  {
    arabic: "رَبَّنَا اغْفِرْ لِي وَلِوَالِدَيَّ وَلِلْمُؤْمِنِينَ يَوْمَ يَقُومُ الْحِسَابُ",
    translation: "Our Lord, forgive me and my parents and the believers the Day the account is established.",
    reference: "Quran 14:41"
  },
  {
    arabic: "رَّبِّ اجْعَلْنِي مُقِيمَ الصَّلَاةِ وَمِن ذُرِّيَّتِي ۚ رَبَّنَا وَتَقَبَّلْ دُعَاءِ",
    translation: "My Lord, make me an establisher of prayer, and from my descendants. Our Lord, and accept my supplication.",
    reference: "Quran 14:40"
  },
  {
    arabic: "رَبِّ هَبْ لِي حُكْمًا وَأَلْحِقْنِي بِالصَّالِحِينَ",
    translation: "My Lord, grant me authority and join me with the righteous.",
    reference: "Quran 26:83"
  },
  {
    arabic: "رَبِّ نَجِّنِي وَأَهْلِي مِمَّا يَعْمَلُونَ",
    translation: "My Lord, save me and my family from what they do.",
    reference: "Quran 26:169"
  },
  {
    arabic: "رَبِّ أَوْزِعْنِي أَنْ أَشْكُرَ نِعْمَتَكَ الَّتِي أَنْعَمْتَ عَلَيَّ وَعَلَىٰ وَالِدَيَّ",
    translation: "My Lord, enable me to be grateful for Your favor which You have bestowed upon me and upon my parents.",
    reference: "Quran 27:19"
  },
  {
    arabic: "لَّا إِلَٰهَ إِلَّا أَنتَ سُبْحَانَكَ إِنِّي كُنتُ مِنَ الظَّالِمِينَ",
    translation: "There is no deity except You; exalted are You. Indeed, I have been of the wrongdoers.",
    reference: "Quran 21:87"
  },
  {
    arabic: "رَبِّ لَا تَذَرْنِي فَرْدًا وَأَنتَ خَيْرُ الْوَارِثِينَ",
    translation: "My Lord, do not leave me alone, and You are the best of inheritors.",
    reference: "Quran 21:89"
  },
  {
    arabic: "رَبَّنَا آتِنَا مِن لَّدُنكَ رَحْمَةً وَهَيِّئْ لَنَا مِنْ أَمْرِنَا رَشَدًا",
    translation: "Our Lord, grant us from Yourself mercy and prepare for us from our affair right guidance.",
    reference: "Quran 18:10"
  },
  {
    arabic: "رَبِّ اشْرَحْ لِي صَدْرِي وَيَسِّرْ لِي أَمْرِي",
    translation: "My Lord, expand for me my chest and ease for me my task.",
    reference: "Quran 20:25-26"
  }
];

const Dashboard = () => {
  const [missedFasts, setMissedFasts] = useState(0);
  const [totalTrackedDays, setTotalTrackedDays] = useState(0);
  const [quranJuz, setQuranJuz] = useState(0);
  const [quranPage, setQuranPage] = useState(0);

  useEffect(() => {
    // Load fasting data
    const allDays = getFastingDays();
    const missed = getMissedFastingDays();
    setMissedFasts(missed.length);
    setTotalTrackedDays(allDays.length);

    // Load Quran progress
    const progress = getQuranProgress();
    if (progress) {
      setQuranJuz(progress.juz);
      setQuranPage(progress.page);
    }
  }, []);

  // Check if Ramadan is ongoing, upcoming, or completed
  const today = new Date();
  const ramadanStart = new Date(2024, 2, 11); // March 11, 2024
  const ramadanEnd = new Date(2024, 3, 9);    // April 9, 2024
  
  let ramadanStatus = "upcoming";
  let ramadanDay = 0;
  
  if (today >= ramadanStart && today <= ramadanEnd) {
    ramadanStatus = "ongoing";
    // Calculate current Ramadan day (1-30)
    const timeDiff = today.getTime() - ramadanStart.getTime();
    ramadanDay = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
  } else if (today > ramadanEnd) {
    ramadanStatus = "completed";
  }

  // Select a dua for today based on the day number or date to ensure consistency
  const getDailyDua = useMemo(() => {
    // Create a deterministic seed based on the date
    const dateStr = today.toISOString().split('T')[0]; // YYYY-MM-DD format
    let seed = 0;
    for (let i = 0; i < dateStr.length; i++) {
      seed += dateStr.charCodeAt(i);
    }
    
    // Use ramadan day as additional modifier if in Ramadan
    if (ramadanStatus === "ongoing") {
      seed += ramadanDay * 100;
    }
    
    // Get a consistent dua for this day
    const duaIndex = seed % quranDuas.length;
    return quranDuas[duaIndex];
  }, [today, ramadanDay, ramadanStatus]);

  return (
    <Box mb={8}>
      <MotionBox
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card bg="ramadan.purple" color="white" mb={6} overflow="hidden">
          <CardBody>
            <Heading size="md" mb={2}>
              {ramadanStatus === "upcoming" && "Ramadan 1445 - Coming Soon"}
              {ramadanStatus === "ongoing" && `Ramadan 1445 - Day ${ramadanDay}`}
              {ramadanStatus === "completed" && "Ramadan 1445 - Completed"}
            </Heading>
            <Text fontSize="md" fontStyle="italic" mb={1}>
              {getDailyDua.arabic}
            </Text>
            <Text fontSize="sm">
              {getDailyDua.translation} - {getDailyDua.reference}
            </Text>
          </CardBody>
        </Card>
      </MotionBox>

      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card>
            <CardBody>
              <Stat>
                <StatLabel>Fasting Status</StatLabel>
                <Flex alignItems="center" mt={2}>
                  <StatNumber>{totalTrackedDays}</StatNumber>
                  <Text ml={2} fontSize="sm">Days Tracked</Text>
                </Flex>
                <StatHelpText>
                  {missedFasts} 
                  {missedFasts === 1 ? " fast" : " fasts"} 
                  {missedFasts > 0 ? " to make up" : " missed"}
                </StatHelpText>
              </Stat>
            </CardBody>
          </Card>
        </MotionBox>

        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card>
            <CardBody>
              <Stat>
                <StatLabel>Quran Progress</StatLabel>
                <Flex alignItems="center" mt={2}>
                  <StatNumber>{quranJuz}</StatNumber>
                  <Text ml={2} fontSize="sm">Juz Completed</Text>
                </Flex>
                <StatHelpText>
                  Page {quranPage} of 604
                </StatHelpText>
              </Stat>
            </CardBody>
          </Card>
        </MotionBox>

        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card>
            <CardBody>
              <Stat>
                <StatLabel>Previous Ramadan</StatLabel>
                <Flex alignItems="center" mt={2}>
                  <StatNumber>
                    {ramadanStatus === "upcoming" && "Coming Soon"}
                    {ramadanStatus === "ongoing" && ramadanDay}
                    {ramadanStatus === "completed" && "Completed"}
                  </StatNumber>
                </Flex>
                <StatHelpText>
                  {ramadanStatus === "ongoing" && `${30 - ramadanDay} days remaining`}
                  {ramadanStatus === "upcoming" && "Starts on March 11, 2024"}
                  {ramadanStatus === "completed" && "Ended on April 9, 2024"}
                </StatHelpText>
              </Stat>
            </CardBody>
          </Card>
        </MotionBox>
      </SimpleGrid>
    </Box>
  );
};

export default Dashboard;
