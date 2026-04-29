import quizData from "@/app/data/quizzes_rows.json";
import { useRouteParams } from "@/hooks/useRouteParams";
import { useEffect, useState } from "react";
import { Quiz } from "@/types/quiz";
export function useQuizLessons() {
  const { level, category, id } = useRouteParams();

  const [quizQuestion, setQuizQuestion] = useState<Quiz[]>([]);

  useEffect(() => {
    if (!level || !category) return;

    const fetchQuizzes = async () => {
      const quizzes = quizData
        .filter((q) => Number(q.level) === Number(level))
        .filter((q) => Number(q.quiz) === Number(id))
        .sort();

      if (quizzes) {
        // Shuffle the data
        const shuffledData = [...quizzes]; // create a copy
        for (let i = shuffledData.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [shuffledData[i], shuffledData[j]] = [
            shuffledData[j],
            shuffledData[i],
          ];
        }

        setQuizQuestion(shuffledData as Quiz[]);
      }
    };

    fetchQuizzes();
  }, [level]);

  return { level, category, id, quizQuestion };
}
