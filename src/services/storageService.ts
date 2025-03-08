
type FastingDay = {
  date: string;
  status: "fasted" | "missed" | "exempt";
  notes?: string;
};

type QuranProgress = {
  juz: number;
  page: number;
  surah: number;
  ayah: number;
  lastUpdated: string;
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
