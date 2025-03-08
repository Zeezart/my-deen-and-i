
import { useQuery } from "@tanstack/react-query";

// Mock Quran data structure (would be replaced by actual API data)
type QuranPage = {
  page: number;
  text: string;
  translation?: string;
  surah?: number;
  ayah?: number;
  juz?: number;
};

// This would normally fetch data from a real Quran API
const fetchQuranData = async (): Promise<QuranPage[]> => {
  // Simulating API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Mock data for demonstration
  return Array.from({ length: 604 }, (_, i) => ({
    page: i + 1,
    text: i === 0 
      ? "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ" 
      : `بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ - Page ${i + 1} content would appear here.`,
    surah: Math.floor(i / 5) + 1, // This is simplified - real mapping would be different
    ayah: (i % 5) + 1,
    juz: Math.floor(i / 20) + 1 // This is simplified - real mapping would be different
  }));
};

export const useQuranData = () => {
  return useQuery({
    queryKey: ['quran-data'],
    queryFn: fetchQuranData,
    staleTime: 1000 * 60 * 60, // 1 hour
    gcTime: 1000 * 60 * 60 * 24, // 24 hours
  });
};
