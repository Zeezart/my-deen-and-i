
type FastingDay = {
  date: string;
  status: "fasted" | "missed";
  notes?: string;
};

type QuranProgress = {
  juz: number;
  page: number;
  surah: number;
  ayah: number;
  lastUpdated: string;
};

type GoodDeed = {
  id: number;
  text: string;
  category: "charity" | "worship" | "kindness" | "quran" | "dhikr";
};

type DailyChallenge = {
  date: string;
  deeds: GoodDeed[];
  completed: number[]; // array of deed IDs that have been completed
};

type DhikrItem = {
  id: number;
  arabic: string;
  translation: string;
  virtue: string;
  target: number;
  count: number;
  lastUpdated: string;
};

type UserSettings = {
  darkMode: boolean;
  notificationsEnabled: boolean;
  dhikrRemindersEnabled: boolean;
};

// Fasting tracker services
export const saveFastingDay = (day: FastingDay): void => {
  const existingData = getFastingDays();
  const updatedData = existingData.filter((d) => d.date !== day.date);
  localStorage.setItem(
    "fastingDays",
    JSON.stringify([...updatedData, day])
  );
};

export const getFastingDays = (): FastingDay[] => {
  const data = localStorage.getItem("fastingDays");
  if (!data) return [];
  return JSON.parse(data);
};

export const getMissedFastingDays = (): FastingDay[] => {
  const days = getFastingDays();
  return days.filter((day) => day.status === "missed");
};

// Quran progress services
export const saveQuranProgress = (progress: QuranProgress): void => {
  localStorage.setItem("quranProgress", JSON.stringify(progress));
};

export const getQuranProgress = (): QuranProgress | null => {
  const data = localStorage.getItem("quranProgress");
  if (!data) return null;
  return JSON.parse(data);
};

export const getDefaultQuranProgress = (): QuranProgress => {
  return {
    juz: 1,
    page: 1,
    surah: 1,
    ayah: 1,
    lastUpdated: new Date().toISOString(),
  };
};

// Good Deeds Challenge services
export const getDailyGoodDeeds = (): GoodDeed[] => {
  const todayStr = new Date().toISOString().split('T')[0];
  const storedChallenge = localStorage.getItem("dailyChallenge");
  
  if (storedChallenge) {
    const challenge = JSON.parse(storedChallenge) as DailyChallenge;
    
    // If challenge is from today, return it
    if (challenge.date === todayStr) {
      return challenge.deeds;
    }
  }
  
  // Generate new challenges for today
  const newDeeds = generateDailyGoodDeeds();
  
  // Save the new deeds for today
  const newChallenge: DailyChallenge = {
    date: todayStr,
    deeds: newDeeds,
    completed: []
  };
  
  localStorage.setItem("dailyChallenge", JSON.stringify(newChallenge));
  
  return newDeeds;
};

export const getCompletedDeeds = (): number[] => {
  const todayStr = new Date().toISOString().split('T')[0];
  const storedChallenge = localStorage.getItem("dailyChallenge");
  
  if (storedChallenge) {
    const challenge = JSON.parse(storedChallenge) as DailyChallenge;
    
    // If challenge is from today, return completed deeds
    if (challenge.date === todayStr) {
      return challenge.completed;
    }
  }
  
  return [];
};

export const markDeedCompleted = (deedId: number): void => {
  const todayStr = new Date().toISOString().split('T')[0];
  const currentDeeds = getDailyGoodDeeds();
  let completed = getCompletedDeeds();
  
  // Toggle deed completion
  if (completed.includes(deedId)) {
    completed = completed.filter(id => id !== deedId);
  } else {
    completed.push(deedId);
  }
  
  const challenge: DailyChallenge = {
    date: todayStr,
    deeds: currentDeeds,
    completed: completed
  };
  
  localStorage.setItem("dailyChallenge", JSON.stringify(challenge));
  
  // Update streak
  updateGoodDeedStreak(completed.length === currentDeeds.length);
};

export const getGoodDeedStreak = (): number => {
  const streak = localStorage.getItem("goodDeedStreak");
  return streak ? parseInt(streak) : 0;
};

export const updateGoodDeedStreak = (completedAllToday: boolean): void => {
  let streak = getGoodDeedStreak();
  const lastCompletionDate = localStorage.getItem("lastGoodDeedCompletion");
  const todayStr = new Date().toISOString().split('T')[0];
  
  // If all deeds completed today, update streak
  if (completedAllToday) {
    // Check if we've already updated the streak today
    if (lastCompletionDate !== todayStr) {
      // Check if we completed yesterday as well (or this is first day)
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];
      
      if (lastCompletionDate === yesterdayStr || !lastCompletionDate) {
        // Consecutive day, increase streak
        streak += 1;
      } else {
        // Streak broken, start new streak
        streak = 1;
      }
      
      localStorage.setItem("goodDeedStreak", streak.toString());
      localStorage.setItem("lastGoodDeedCompletion", todayStr);
    }
  }
  
  return;
};

// Generate random good deeds from our collection
export const generateDailyGoodDeeds = (): GoodDeed[] => {
  const allDeeds: GoodDeed[] = [
    { id: 1, text: "Give charity (even if a small amount)", category: "charity" },
    { id: 2, text: "Help someone in need", category: "kindness" },
    { id: 3, text: "Recite Surah Al-Ikhlas 3 times", category: "quran" },
    { id: 4, text: "Say 'Astaghfirullah' 100 times", category: "dhikr" },
    { id: 5, text: "Read 1 page of Quran with translation", category: "quran" },
    { id: 6, text: "Call a family member you haven't spoken to in a while", category: "kindness" },
    { id: 7, text: "Feed someone who is fasting", category: "charity" },
    { id: 8, text: "Share an Islamic reminder with friends/family", category: "kindness" },
    { id: 9, text: "Pray Salah on time", category: "worship" },
    { id: 10, text: "Make dua for 3 people", category: "worship" },
    { id: 11, text: "Learn a new hadith and reflect on it", category: "worship" },
    { id: 12, text: "Recite morning and evening adhkar", category: "dhikr" },
    { id: 13, text: "Smile at someone and spread positivity", category: "kindness" },
    { id: 14, text: "Forgive someone who has wronged you", category: "kindness" },
    { id: 15, text: "Pray 2 rakah nafl (voluntary) prayer", category: "worship" },
    { id: 16, text: "Visit a sick person", category: "kindness" },
    { id: 17, text: "Study a portion of Islamic knowledge", category: "worship" },
    { id: 18, text: "Send Salawat upon the Prophet ﷺ 10 times", category: "dhikr" },
    { id: 19, text: "Do dhikr while walking or commuting", category: "dhikr" },
    { id: 20, text: "Give a sincere compliment to someone", category: "kindness" },
    { id: 21, text: "Make an intention to improve one aspect of your character", category: "worship" },
    { id: 22, text: "Memorize a new verse from the Quran", category: "quran" },
    { id: 23, text: "Read about the life of a companion of the Prophet ﷺ", category: "worship" },
    { id: 24, text: "Share food with a neighbor", category: "kindness" },
    { id: 25, text: "Donate Islamic books or materials", category: "charity" }
  ];
  
  // Create a seed based on today's date to get consistent but different results each day
  const today = new Date();
  const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
  
  // Simple seeded random function
  const seededRandom = (min: number, max: number, seed: number) => {
    const x = Math.sin(seed) * 10000;
    const rand = x - Math.floor(x);
    return Math.floor(rand * (max - min)) + min;
  };
  
  // Shuffle array using the seeded random
  const shuffledDeeds = [...allDeeds];
  for (let i = shuffledDeeds.length - 1; i > 0; i--) {
    const j = seededRandom(0, i + 1, seed * (i + 1));
    [shuffledDeeds[i], shuffledDeeds[j]] = [shuffledDeeds[j], shuffledDeeds[i]];
  }
  
  // Return first 3 elements
  return shuffledDeeds.slice(0, 3);
};

// Dhikr services
export const getDhikrList = (): DhikrItem[] => {
  const stored = localStorage.getItem("dhikrItems");
  if (stored) {
    return JSON.parse(stored);
  }
  
  // Default dhikr list
  const defaultDhikr: DhikrItem[] = [
    {
      id: 1,
      arabic: "سُبْحَانَ اللهِ",
      translation: "Glory be to Allah",
      virtue: "Plants a palm tree in Paradise for you",
      target: 33,
      count: 0,
      lastUpdated: new Date().toISOString()
    },
    {
      id: 2,
      arabic: "الْحَمْدُ لِلَّهِ",
      translation: "All praise is due to Allah",
      virtue: "Fills the scales with good deeds",
      target: 33,
      count: 0,
      lastUpdated: new Date().toISOString()
    },
    {
      id: 3,
      arabic: "اللهُ أَكْبَرُ",
      translation: "Allah is the Greatest",
      virtue: "No deed is greater on the Day of Judgment",
      target: 33,
      count: 0,
      lastUpdated: new Date().toISOString()
    },
    {
      id: 4,
      arabic: "لَا إِلَٰهَ إِلَّا اللهُ",
      translation: "There is no god but Allah",
      virtue: "Best form of remembrance",
      target: 100,
      count: 0,
      lastUpdated: new Date().toISOString()
    },
    {
      id: 5,
      arabic: "أَسْتَغْفِرُ اللهَ",
      translation: "I seek forgiveness from Allah",
      virtue: "Removes sins and difficulties",
      target: 100,
      count: 0,
      lastUpdated: new Date().toISOString()
    }
  ];
  
  localStorage.setItem("dhikrItems", JSON.stringify(defaultDhikr));
  return defaultDhikr;
};

export const updateDhikrCount = (id: number, count: number): void => {
  const dhikrList = getDhikrList();
  const updated = dhikrList.map(item => {
    if (item.id === id) {
      return { ...item, count, lastUpdated: new Date().toISOString() };
    }
    return item;
  });
  
  localStorage.setItem("dhikrItems", JSON.stringify(updated));
};

export const resetDhikrCounts = (): void => {
  const dhikrList = getDhikrList();
  const reset = dhikrList.map(item => ({ ...item, count: 0, lastUpdated: new Date().toISOString() }));
  localStorage.setItem("dhikrItems", JSON.stringify(reset));
};

// Settings services
export const getUserSettings = (): UserSettings => {
  const stored = localStorage.getItem("userSettings");
  if (stored) {
    return JSON.parse(stored);
  }
  
  // Default settings
  const defaultSettings: UserSettings = {
    darkMode: false,
    notificationsEnabled: true,
    dhikrRemindersEnabled: true
  };
  
  localStorage.setItem("userSettings", JSON.stringify(defaultSettings));
  return defaultSettings;
};

export const updateUserSettings = (settings: Partial<UserSettings>): void => {
  const currentSettings = getUserSettings();
  const newSettings = { ...currentSettings, ...settings };
  localStorage.setItem("userSettings", JSON.stringify(newSettings));
};

export const resetAllProgress = (): void => {
  // Keep user settings but reset everything else
  const settings = getUserSettings();
  
  // Clear all localStorage except settings
  localStorage.clear();
  
  // Restore settings
  localStorage.setItem("userSettings", JSON.stringify(settings));
  
  // Re-initialize default data
  getDhikrList();
};
