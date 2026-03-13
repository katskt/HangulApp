// THIS FILE MAY NOT BE NEEDED
import { lessonStroke } from "@/lib/lessonStroke";
export default function useImage(character: string) {
  return { imageUrl: lessonStroke[character] ?? null };
}

/* import { useEffect, useState } from "react";
import { supabase } from "@/supabaseConfig";

export default function useImage(character: string | null) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false)
  // ------ Fetch discriptive image from Supabase ------
  useEffect(() => {
      console.log("useEffect triggered, character:", character);

  if (!character) {
    setImageUrl(null);
    return;
  }
  setLoading(true)
  const path = `${character}.png`;
  const { data } = supabase.storage
    .from("practiceImages")
    .getPublicUrl(path);

  console.log("fetched public URL for Image:", data.publicUrl); // logs immediately
  setImageUrl(data.publicUrl);
  setLoading(false)

}, [character]);


  return {
    imageUrl, loading
  };
}

 */

