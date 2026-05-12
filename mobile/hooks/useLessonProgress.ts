// hooks/useLessonProgress.ts
import { supabase } from "@/supabaseConfig";
import { useEffect, useRef, useState } from "react";

interface Lesson {
  group: string;
  hangeul_romanization: string;
  group_romanization: string;
  group_order: number;
}

export function useLessonProgress(
  lessons: Lesson[],
  level: string | string[],
  category: string,
) {
  const [completedPages, setCompletedPages] = useState<Set<string>>(new Set());
  const saved = useRef(false);
  const audioPlayed = useRef<Set<string>>(new Set());
  const traceCompleted = useRef<Set<string>>(new Set());

  const markComplete = (character: string, type: "audio" | "trace") => {
    if (type === "audio") {
      if (audioPlayed.current.has(character)) return;
      audioPlayed.current.add(character);
    }
    if (type === "trace") {
      if (traceCompleted.current.has(character)) return;
      traceCompleted.current.add(character);
    }
    setCompletedPages((prev) => new Set([...prev, `${character}-${type}`]));
  };

  const isCharacterComplete = (character: string) => {
    return (
      completedPages.has(`${character}-audio`) &&
      completedPages.has(`${character}-trace`)
    );
  };

  const saveProgress = async () => {
    if (saved.current) return;
    saved.current = true;

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    await supabase.from("progress").insert({
      user_id: user.id,
      level: Number(level),
      category,
      group:
        category === "practice"
          ? String(lessons[0]?.group_order)
          : String(lessons[0]?.group),
      completed_at: new Date().toISOString(),
    });
  };

  const completedCount = lessons.filter((l) =>
    isCharacterComplete(l.hangeul_romanization),
  ).length;

  useEffect(() => {
    if (saved.current || lessons.length === 0) return;
    const allComplete = lessons.every((l) =>
      isCharacterComplete(l.hangeul_romanization),
    );
    if (allComplete) saveProgress();
  }, [completedPages, lessons]);

  // reset on unmount
  useEffect(() => {
    return () => {
      saved.current = false;
      audioPlayed.current = new Set();
      traceCompleted.current = new Set();
    };
  }, []);

  return { markComplete, isCharacterComplete, completedCount };
}
