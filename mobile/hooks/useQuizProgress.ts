// hooks/useLessonProgress.ts
import { supabase } from "@/supabaseConfig";

// hooks/useQuizProgress.ts
export function useQuizProgress(
  level: number,
  quizNumber: number,
  quizType: string,
) {
  const saveProgress = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    await supabase.from("progress").insert({
      user_id: user.id,
      level: level,
      category: "quiz",
      group: quizNumber + quizType,
      completed_at: new Date().toISOString(),
    });
  };

  return { saveProgress };
}
