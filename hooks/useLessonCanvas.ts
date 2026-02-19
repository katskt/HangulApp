import { useEffect, useState } from "react";
import { supabase } from "@/supabaseConfig";

export default function useCanvasPaths(character: string | null) {
  const [paths, setPaths] = useState<string[][]>([]);
const [currentPath, setCurrentPath] = useState<string[]>([]);

  const [isClearButtonClicked, setClearButtonClicked] = useState(false);
  const [strokeImageUrl, setstrokeImageUrl] = useState<string | null>(null);

  // ------ Fetch stroke order image from Supabase ------
  useEffect(() => {
      console.log("useEffect triggered, character:", character);

  if (!character) {
    setstrokeImageUrl(null);
    return;
  }
  

  const path = `${character}.png`;
  const { data } = supabase.storage
    .from("lessonStroke")
    .getPublicUrl(path);

  console.log("fetched public URL:", data.publicUrl); // logs immediately
  setstrokeImageUrl(data.publicUrl);

}, [character]);


  // ------ Touch Logic ------
  const onTouchMove = (event: any) => {
    const newPath = [...currentPath];
    const locationX = event.nativeEvent.locationX;
    const locationY = event.nativeEvent.locationY;
    const newPoint = `${newPath.length === 0 ? "M" : ""}${locationX.toFixed(0)},${locationY.toFixed(0)} `;
    newPath.push(newPoint);
    setCurrentPath(newPath);
  };

  const onTouchEnd = () => {
    setPaths((prev) => [...prev, currentPath]);
    setCurrentPath([]);
    setClearButtonClicked(false);
  };

  
  // ------ Clear Logic ------
  const handleClear = () => {
    console.log("cleared")
    setPaths([]);
    setCurrentPath([]);
    setClearButtonClicked(true);
  };

  return {
    paths,
    currentPath,
    isClearButtonClicked,
    onTouchMove,
    onTouchEnd,
    handleClear,
    strokeImageUrl, 
  };
}
