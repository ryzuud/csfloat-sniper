export function getWearColor(wear: string): string {
  switch (wear) {
    case "Factory New":
      return "#4ade80";
    case "Minimal Wear":
      return "#60a5fa";
    case "Field-Tested":
      return "#facc15";
    case "Well-Worn":
      return "#fb923c";
    case "Battle-Scarred":
      return "#f87171";
    default:
      return "#94a3b8";
  }
}

export function getRarityGradient(rarity: number): string {
  const gradients: Record<number, string> = {
    1: "linear-gradient(135deg, #b0c3d9 0%, #5e98d9 100%)", // Consumer
    2: "linear-gradient(135deg, #4b69ff 0%, #3b5bdb 100%)", // Industrial
    3: "linear-gradient(135deg, #8847ff 0%, #6741d9 100%)", // Mil-Spec
    4: "linear-gradient(135deg, #d32ce6 0%, #ae3ec9 100%)", // Restricted
    5: "linear-gradient(135deg, #eb4b4b 0%, #c92a2a 100%)", // Classified
    6: "linear-gradient(135deg, #e4ae39 0%, #f59f00 100%)", // Covert
    7: "linear-gradient(135deg, #e4ae39 0%, #ffd700 100%)", // Contraband / Gold
  };
  return gradients[rarity] || gradients[1];
}
