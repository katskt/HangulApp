// lib/levelAssets.ts
import level1 from "../assets/images/level1.png";
import level2 from "../assets/images/level2.png";
import level3 from "../assets/images/level3.png";
import level4 from "../assets/images/level4.png";

const levelImages: Record<number, any> = {
  1: level1,
  2: level2,
  3: level3,
  4: level4,
};

export function getLevelImage(levelNumber: number) {
  return levelImages[levelNumber];
}

