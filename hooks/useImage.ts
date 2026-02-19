import { useEffect, useState } from "react";
import { supabase } from "@/supabaseConfig";

export default function useImage(character: string | null) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  // ------ Fetch discriptive image from Supabase ------
  useEffect(() => {
      console.log("useEffect triggered, character:", character);

  if (!character) {
    setImageUrl(null);
    return;
  }

  const path = `${character}.png`;
  const { data } = supabase.storage
    .from("practiceImages")
    .getPublicUrl(path);

  console.log("fetched public URL for Image:", data.publicUrl); // logs immediately
  setImageUrl(data.publicUrl);

}, [character]);


  return {
    imageUrl
  };
}
