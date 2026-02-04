import { useState, useEffect } from "react";
import { usePathname } from "expo-router";
import LessonAudioPanel from "@/components/LessonAudioPanel";
import { supabase } from "../../../../supabaseConfig";

interface Lesson {
  hangul: string;
  yale_romanization: string;
  level: string;
  category: string;
  id: string;
}

export default function VowelPage() {
  const parts = usePathname().split("/").filter(Boolean);
  const level = parts[1];
  const category = parts[2];
  const character = parts[3]; // yale romanization from URL

  const [lesson, setLesson] = useState<Lesson | null>(null);

  useEffect(() => {
    if (!level || !category || !character) return;

    const fetchLesson = async () => {
      const { data, error } = await supabase
        .from("lessons")
        .select("*")
        .eq("level", Number(level))
        .eq("category", category)
        .eq("yale_romanization", character)
        .single(); // we just want one lesson

      if (error) {
        console.error("Error fetching lesson:", error.message);
        return;
      }

      setLesson(data);
    };

    fetchLesson();
  }, [level, category, character]);

  if (!lesson) return null; // or a loading indicator

  return (
    <LessonAudioPanel
      character={lesson.yale_romanization} // still needed for audio filename
      hangul={lesson.hangul} // actual Hangul character
    />
  );
}
