
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

// Function to fetch adhkar data from API
const fetchAdhkar = async (category: string) => {
  // For reliability, we'll use a direct dataset rather than an external API
  // that might have rate limits or connectivity issues
  return getMockAdhkar(category);
};

// Reliable adhkar data from Hisnul Muslim
const getMockAdhkar = (category: string) => {
  const morningAdhkar = [
    {
      id: 1,
      arabic: "أَصْـبَحْنا وَأَصْـبَحَ المُـلْكُ لله وَالحَمدُ لله، لا إلهَ إلاّ اللّهُ وَحدَهُ لا شَريكَ لهُ، لهُ المُـلكُ ولهُ الحَمْـد، وهُوَ على كلّ شيءٍ قدير",
      translation: "We have reached the morning and at this very time unto Allah belongs all sovereignty, and all praise is for Allah. None has the right to be worshipped except Allah, alone, without partner, to Him belongs all sovereignty and praise and He is over all things omnipotent.",
      reference: "Muslim",
      repeat: 1
    },
    {
      id: 2,
      arabic: "اللّهُـمَّ بِكَ أَصْـبَحْنا وَبِكَ أَمْسَـينا ، وَبِكَ نَحْـيا وَبِكَ نَمُـوتُ وَإِلَـيْكَ النُّـشُور",
      translation: "O Allah, by You we enter the morning and by You we enter the evening, by You we live and by You we die, and to You is the Final Return.",
      reference: "Tirmidhi",
      repeat: 1
    },
    {
      id: 3,
      arabic: "اللّهُـمَّ إِنِّـي أَسْـأَلُـكَ العَـفْوَ وَالعَـافِـيةَ في الدُّنْـيا وَالآخِـرَة، اللّهُـمَّ إِنِّـي أَسْـأَلُـكَ العَـفْوَ وَالعَـافِـيةَ في ديني وَدُنْـيايَ وَأَهْـلي وَمالـي",
      translation: "O Allah, I ask You for pardon and well-being in this life and the next. O Allah, I ask You for pardon and well-being in my religious and worldly affairs, and my family and my wealth.",
      reference: "Ibn Majah",
      repeat: 1
    },
    {
      id: 4,
      arabic: "اللّهُـمَّ إِنِّـي أَعـوذُ بِكَ مِنَ الْكُـفر ، وَالفَـقْر ، وَأَعـوذُ بِكَ مِنْ عَذابِ القَـبْر ، لا إلهَ إلاّ أَنْـتَ",
      translation: "O Allah, I take refuge in You from disbelief and poverty, and I take refuge in You from the punishment of the grave. None has the right to be worshipped except You.",
      reference: "Abu Dawud",
      repeat: 3
    },
    {
      id: 5,
      arabic: "اللّهُـمَّ عافِـني في بَدَنـي ، اللّهُـمَّ عافِـني في سَمْـعي ، اللّهُـمَّ عافِـني في بَصَـري ، لا إلهَ إلاّ أَنْـتَ",
      translation: "O Allah, grant my body health, O Allah, grant my hearing health, O Allah, grant my sight health. None has the right to be worshipped except You.",
      reference: "Abu Dawud",
      repeat: 3
    },
    {
      id: 6,
      arabic: "حَسْبِـيَ اللّهُ لا إلهَ إلاّ هُوَ عَلَـيهِ تَوَكَّـلتُ وَهُوَ رَبُّ العَرْشِ العَظـيم",
      translation: "Allah is sufficient for me, none has the right to be worshipped except Him, upon Him I rely and He is Lord of the exalted throne.",
      reference: "Abu Dawud",
      repeat: 7
    },
    {
      id: 7,
      arabic: "أَعـوذُ بِكَلِمـاتِ اللّهِ التّـامّـاتِ مِنْ شَـرِّ ما خَلَـق",
      translation: "I take refuge in Allah's perfect words from the evil of what He has created.",
      reference: "Muslim",
      repeat: 3
    },
    {
      id: 20,
      arabic: "بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ",
      translation: "In the name of Allah, Who with His Name nothing can cause harm in the earth nor in the heavens, and He is the All-Hearing, the All-Knowing.",
      reference: "Abu Dawud, Tirmidhi",
      repeat: 3
    },
    {
      id: 21,
      arabic: "رَضِـيتُ بِاللهِ رَبًّـا وَبِالإسْلامِ دِينًـا وَبِمُحَـمَّدٍ صلى الله عليه وسلم نَبِيًّـا",
      translation: "I am pleased with Allah as my Lord, with Islam as my religion and with Muhammad ﷺ as my Prophet.",
      reference: "Abu Dawud",
      repeat: 3
    },
    {
      id: 22,
      arabic: "اللَّهُمَّ إِنِّي أَصْبَحْتُ أُشْهِدُكَ، وَأُشْهِدُ حَمَلَةَ عَرْشِكَ، وَمَلَائِكَتَكَ، وَجَمِيعَ خَلْقِكَ، أَنَّكَ أَنْتَ اللَّهُ لَا إِلَهَ إِلَّا أَنْتَ وَحْدَكَ لَا شَرِيكَ لَكَ، وَأَنَّ مُحَمَّدًا عَبْدُكَ وَرَسُولُكَ",
      translation: "O Allah, I have reached the morning and call upon You and the bearers of Your Throne, Your angels and all of Your creation to witness that You are Allah, none has the right to be worshipped except You, alone, without partner and that Muhammad is Your servant and Messenger.",
      reference: "Abu Dawud",
      repeat: 4
    },
    {
      id: 29,
      arabic: "اللَّهُمَّ مَا أَصْبَحَ بِي مِنْ نِعْمَةٍ أَوْ بِأَحَدٍ مِنْ خَلْقِكَ فَمِنْكَ وَحْدَكَ لَا شَرِيكَ لَكَ، فَلَكَ الْحَمْدُ وَلَكَ الشُّكْرُ",
      translation: "O Allah, what blessing I or any of Your creation have reached this morning is from You alone, without partner, so for You is all praise and unto You all thanks.",
      reference: "Abu Dawud",
      repeat: 1
    },
    {
      id: 30,
      arabic: "اللَّهُمَّ بِكَ أَصْبَحْنَا، وَبِكَ أَمْسَيْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ، وَإِلَيْكَ النُّشُورُ",
      translation: "O Allah, by You we have reached the morning and by You we have reached the evening, by You we live and by You we die, and to You is the resurrection.",
      reference: "Tirmidhi",
      repeat: 1
    },
    {
      id: 31,
      arabic: "أَصْبَحْنَا عَلَى فِطْرَةِ الْإِسْلَامِ، وَعَلَى كَلِمَةِ الْإِخْلَاصِ، وَعَلَى دِينِ نَبِيِّنَا مُحَمَّدٍ صَلَّى اللهُ عَلَيْهِ وَسَلَّمَ، وَعَلَى مِلَّةِ أَبِينَا إِبْرَاهِيمَ، حَنِيفًا مُسْلِمًا وَمَا كَانَ مِنَ الْمُشْرِكِينَ",
      translation: "We have reached the morning upon the fitrah (natural state) of Islam, and upon the word of sincerity, and upon the religion of our Prophet Muhammad, and upon the religion of our father Ibrahim, who was upright and a Muslim and was not from among the polytheists.",
      reference: "Ahmad",
      repeat: 1
    },
    {
      id: 32,
      arabic: "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ",
      translation: "Glory is to Allah and praise is to Him",
      reference: "Muslim",
      repeat: 100
    },
    {
      id: 33,
      arabic: "لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ",
      translation: "None has the right to be worshipped except Allah, alone, without partner. To Him belongs all sovereignty and praise and He is over all things omnipotent.",
      reference: "Bukhari and Muslim",
      repeat: 10
    }
  ];
  
  const eveningAdhkar = [
    {
      id: 8,
      arabic: "أَمْسَيْـنا وَأَمْسـى المُـلْكُ للهِ وَالحَمدُ لله ، لا إلهَ إلاّ اللّهُ وَحدَهُ لا شَريكَ لهُ، لهُ المُـلكُ ولهُ الحَمْـد، وهُوَ على كلّ شيءٍ قدير",
      translation: "We have reached the evening and at this very time unto Allah belongs all sovereignty, and all praise is for Allah. None has the right to be worshipped except Allah, alone, without partner, to Him belongs all sovereignty and praise and He is over all things omnipotent.",
      reference: "Muslim",
      repeat: 1
    },
    {
      id: 9,
      arabic: "اللّهُـمَّ بِكَ أَمْسَـينا، وَبِكَ أَصْـبَحْنا، وَبِكَ نَحْـيا، وَبِكَ نَمُـوتُ وَإِلَـيْكَ المَصِيرُ",
      translation: "O Allah, by Your leave we have reached the evening and by Your leave we have reached the morning, by Your leave we live and die and unto You is our return.",
      reference: "Tirmidhi",
      repeat: 1
    },
    {
      id: 10,
      arabic: "اللّهُـمَّ ما أَمسى بي مِـنْ نِعْـمَةٍ أَو بِأَحَـدٍ مِـنْ خَلْـقِك ، فَمِـنْكَ وَحْـدَكَ لا شريكَ لَـك ، فَلَـكَ الْحَمْـدُ وَلَـكَ الشُّكْـر",
      translation: "O Allah, what blessing I have received in this evening or any of Your creation, is from You alone, without partner, so for You is all praise and unto You all thanks.",
      reference: "Abu Dawud",
      repeat: 1
    },
    {
      id: 11,
      arabic: "اللّهُـمَّ إِنِّـي أَمسيتُ أُشْـهِدُك ، وَأُشْـهِدُ حَمَلَـةَ عَـرْشِـك ، وَمَلَائِكَتَكَ ، وَجَمـيعَ خَلْـقِك ، أَنَّـكَ أَنْـتَ اللهُ لا إلهَ إلاّ أَنْـتَ وَحْـدَكَ لا شَريكَ لَـك ، وَأَنَّ ُ مُحَمّـداً عَبْـدُكَ وَرَسـولُـك",
      translation: "O Allah, verily I have reached the evening and call on You, Your bearers of Your throne, Your angels, and all of Your creation to witness that You are Allah, none has the right to be worshipped except You, alone, without partner and that Muhammad is Your servant and Your Messenger.",
      reference: "Abu Dawud",
      repeat: 1
    },
    {
      id: 12,
      arabic: "اللّهُـمَّ إِنِّـي أَعـوذُ بِكَ مِنَ الْكُـفر ، وَالفَـقْر ، وَأَعـوذُ بِكَ مِنْ عَذابِ القَـبْر ، لا إلهَ إلاّ أَنْـتَ",
      translation: "O Allah, I take refuge in You from disbelief and poverty, and I take refuge in You from the punishment of the grave. None has the right to be worshipped except You.",
      reference: "Abu Dawud",
      repeat: 3
    },
    {
      id: 13,
      arabic: "أَعـوذُ بِكَلِمـاتِ اللّهِ التّـامّـاتِ مِنْ شَـرِّ ما خَلَـق",
      translation: "I take refuge in Allah's perfect words from the evil of what He has created.",
      reference: "Muslim",
      repeat: 3
    },
    {
      id: 23,
      arabic: "اللَّهُمَّ إِنِّي أَمْسَيْتُ أُشْهِدُكَ، وَأُشْهِدُ حَمَلَةَ عَرْشِكَ، وَمَلَائِكَتَكَ، وَجَمِيعَ خَلْقِكَ، أَنَّكَ أَنْتَ اللَّهُ لَا إِلَهَ إِلَّا أَنْتَ وَحْدَكَ لَا شَرِيكَ لَكَ، وَأَنَّ مُحَمَّدًا عَبْدُكَ وَرَسُولُكَ",
      translation: "O Allah, I have reached the evening and call upon You and the bearers of Your Throne, Your angels and all of Your creation to witness that You are Allah, none has the right to be worshipped except You, alone, without partner and that Muhammad is Your servant and Messenger.",
      reference: "Abu Dawud",
      repeat: 4
    },
    {
      id: 24,
      arabic: "اللَّهُمَّ مَا أَمْسَى بِي مِنْ نِعْمَةٍ أَوْ بِأَحَدٍ مِنْ خَلْقِكَ فَمِنْكَ وَحْدَكَ لَا شَرِيكَ لَكَ، فَلَكَ الْحَمْدُ وَلَكَ الشُّكْرُ",
      translation: "O Allah, what blessing I or any of Your creation have reached in this evening is from You alone, without partner, so for You is all praise and unto You all thanks.",
      reference: "Abu Dawud",
      repeat: 1
    },
    {
      id: 25,
      arabic: "اللَّهُمَّ عَافِنِي فِي بَدَنِي، اللَّهُمَّ عَافِنِي فِي سَمْعِي، اللَّهُمَّ عَافِنِي فِي بَصَرِي، لَا إِلَهَ إِلَّا أَنْتَ",
      translation: "O Allah, grant my body health, O Allah, grant my hearing health, O Allah, grant my sight health. None has the right to be worshipped except You.",
      reference: "Abu Dawud",
      repeat: 3
    },
    {
      id: 34,
      arabic: "أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ، رَبِّ أَسْأَلُكَ خَيْرَ مَا فِي هَذِهِ اللَّيْلَةِ وَخَيْرَ مَا بَعْدَهَا، وَأَعُوذُ بِكَ مِنْ شَرِّ مَا فِي هَذِهِ اللَّيْلَةِ وَشَرِّ مَا بَعْدَهَا، رَبِّ أَعُوذُ بِكَ مِنَ الْكَسَلِ وَسُوءِ الْكِبَرِ، رَبِّ أَعُوذُ بِكَ مِنْ عَذَابٍ فِي النَّارِ وَعَذَابٍ فِي الْقَبْرِ",
      translation: "We have reached the evening and at this very time the whole kingdom belongs to Allah. All praise is for Allah. None has the right to be worshipped except Allah, alone, without any partner. To Him belongs the kingdom, and to Him belongs all praise, and He has power over everything. My Lord, I ask You for the good of this night and the good of what follows it, and I seek refuge in You from the evil of this night and the evil of what follows it. My Lord, I seek refuge in You from laziness and the evil of pride. My Lord, I seek refuge in You from the punishment of the Fire and the punishment of the grave.",
      reference: "Muslim",
      repeat: 1
    },
    {
      id: 35,
      arabic: "اللَّهُمَّ بِكَ أَمْسَيْنَا، وَبِكَ أَصْبَحْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ، وَإِلَيْكَ الْمَصِيرُ",
      translation: "O Allah, by You we have reached the evening and by You we have reached the morning, by You we live and by You we die, and to You is the final return.",
      reference: "Tirmidhi",
      repeat: 1
    },
    {
      id: 36,
      arabic: "أَمْسَيْنَا عَلَى فِطْرَةِ الْإِسْلَامِ، وَعَلَى كَلِمَةِ الْإِخْلَاصِ، وَعَلَى دِينِ نَبِيِّنَا مُحَمَّدٍ صَلَّى اللهُ عَلَيْهِ وَسَلَّمَ، وَعَلَى مِلَّةِ أَبِينَا إِبْرَاهِيمَ، حَنِيفًا مُسْلِمًا وَمَا كَانَ مِنَ الْمُشْرِكِينَ",
      translation: "We have reached the evening upon the fitrah (natural state) of Islam, and upon the word of sincerity, and upon the religion of our Prophet Muhammad, and upon the religion of our father Ibrahim, who was upright and a Muslim and was not from among the polytheists.",
      reference: "Ahmad",
      repeat: 1
    },
    {
      id: 37,
      arabic: "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ",
      translation: "Glory is to Allah and praise is to Him",
      reference: "Muslim",
      repeat: 100
    }
  ];
  
  const generalAdhkar = [
    {
      id: 14,
      arabic: "لا إلهَ إلاّ اللّهُ وحدَهُ لا شريكَ لهُ، لهُ المُلكُ ولهُ الحَمدُ وهوَ على كلّ شيءٍ قدير",
      translation: "None has the right to be worshipped except Allah, alone, without partner. To Him belongs all sovereignty and praise and He is over all things omnipotent.",
      reference: "Bukhari, Muslim",
      repeat: 10
    },
    {
      id: 15,
      arabic: "سُبْحـانَ اللهِ وَبِحَمْـدِهِ",
      translation: "Glory is to Allah and praise is to Him.",
      reference: "Muslim",
      repeat: 100
    },
    {
      id: 16,
      arabic: "أسْتَغْفِرُ اللهَ وَأتُوبُ إلَيْهِ",
      translation: "I seek the forgiveness of Allah and repent to Him.",
      reference: "Bukhari",
      repeat: 100
    },
    {
      id: 17,
      arabic: "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ ، سُبْحَانَ اللَّهِ الْعَظِيمِ",
      translation: "Glory is to Allah and praise is to Him, Glory is to Allah the Immense.",
      reference: "Muslim",
      repeat: 10
    },
    {
      id: 18,
      arabic: "لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ، وَلَهُ الْحَمْدُ، وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ، لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ",
      translation: "None has the right to be worshipped except Allah, alone, without partner. To Him belongs all sovereignty and praise. He is over all things omnipotent. There is no might nor power except with Allah.",
      reference: "Tirmidhi",
      repeat: 10
    },
    {
      id: 19,
      arabic: "اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ كَمَا صَلَّيْتَ عَلَى إِبْرَاهِيمَ وَعَلَى آلِ إِبْرَاهِيمَ إِنَّكَ حَمِيدٌ مَجِيدٌ",
      translation: "O Allah, send prayers upon Muhammad and the followers of Muhammad, just as You sent prayers upon Ibrahim and the followers of Ibrahim. Verily, You are full of praise and majesty.",
      reference: "Bukhari",
      repeat: 10
    },
    {
      id: 26,
      arabic: "سُبْحَانَ اللَّهِ وَالْحَمْدُ لِلَّهِ وَلَا إِلَهَ إِلَّا اللَّهُ وَاللَّهُ أَكْبَرُ",
      translation: "Glory is to Allah, and praise is to Allah, and there is none worthy of worship but Allah, and Allah is the Most Great.",
      reference: "Muslim",
      repeat: 100
    },
    {
      id: 27,
      arabic: "لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ يُحْيِي وَيُمِيتُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ",
      translation: "None has the right to be worshipped except Allah, alone, without partner. To Him belongs all sovereignty and praise. He gives life and causes death, and He is over all things omnipotent.",
      reference: "Tirmidhi",
      repeat: 10
    },
    {
      id: 28,
      arabic: "اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ، وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ، أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ، أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ، وَأَبُوءُ بِذَنْبِي فَاغْفِرْ لِي فَإِنَّهُ لَا يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ",
      translation: "O Allah, You are my Lord, there is none worthy of worship but You. You created me and I am Your servant, and I abide by Your covenant and promise as best I can. I seek refuge in You from the evil of what I have done. I acknowledge Your favor upon me, and I acknowledge my sin, so forgive me, for none forgives sins but You.",
      reference: "Bukhari",
      repeat: 1
    },
    {
      id: 38,
      arabic: "لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ، وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ",
      translation: "None has the right to be worshipped except Allah, alone, without partner. To Him belongs all sovereignty and praise and He is over all things omnipotent.",
      reference: "Bukhari and Muslim",
      repeat: 100
    },
    {
      id: 39,
      arabic: "سُبْحَانَ اللَّهِ، وَالْحَمْدُ لِلَّهِ، وَلَا إِلَهَ إِلَّا اللَّهُ، وَاللَّهُ أَكْبَرُ",
      translation: "Glory is to Allah, and praise is to Allah, and there is none worthy of worship but Allah, and Allah is the Most Great.",
      reference: "Muslim",
      repeat: 100
    },
    {
      id: 40,
      arabic: "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ، عَدَدَ خَلْقِهِ، وَرِضَا نَفْسِهِ، وَزِنَةَ عَرْشِهِ، وَمِدَادَ كَلِمَاتِهِ",
      translation: "Glory and praise is to Allah, by the number of His creation, and His pleasure, and by the weight of His throne, and by the extent of His words.",
      reference: "Muslim",
      repeat: 3
    }
  ];
  
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
    
    // Reset expanded accordion items when changing tabs
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
