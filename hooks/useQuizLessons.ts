import { useEffect, useState } from "react";
import { usePathname } from "expo-router";
import { supabase } from "../supabaseConfig";

interface Quiz {
    level: number;
    quiz: number;
    correct_hangeul: string;
    wrong_hangeul: string;
    correct_audio: string;
    wrong_audio: string;
}
export function useQuizLessons() {
  const pathname = usePathname();
  const parts = pathname.split("/").filter(Boolean);

  const level = parts[1];
  const category = parts[2];
  const quizNum = parts[3];
  const [quizQuestion, setQuizQuestion] = useState<Quiz[]>([]);

  useEffect(() => {
    if (!level || !category) return;

    const fetchQuizzes = async () => {
      const { data, error } = await supabase
        .from("quizzes")
        .select("*")
        .eq("level", Number(level))
        .eq("quiz", quizNum)

      if (error) {
        console.error(error.message);
        return;
      }
      if (data) {
            // Shuffle the data
    const shuffledData = [...data]; // create a copy
    for (let i = shuffledData.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledData[i], shuffledData[j]] = [shuffledData[j], shuffledData[i]];
    }

    setQuizQuestion(shuffledData as Quiz[]);
      }
    };

    fetchQuizzes();
  }, [level]);

  return { level, category, quizNum, quizQuestion };
}
