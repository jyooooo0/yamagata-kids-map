import {
  Baby,
  Bath,
  Blocks,
  BookOpen,
  Coffee,
  Fish,
  Landmark,
  type LucideIcon,
  Mountain,
  Palette,
  Scissors,
  Stethoscope,
  Trees,
  UtensilsCrossed,
} from "lucide-react";

import type { CategoryId } from "@/types/spot";

const ICON_MAP: Record<CategoryId, LucideIcon> = {
  food: UtensilsCrossed,
  cafe: Coffee,
  babystation: Baby,
  "indoor-play": Blocks,
  park: Trees,
  hospital: Stethoscope,
  salon: Scissors,
  library: BookOpen,
  craft: Palette,
  aquarium: Fish,
  museum: Landmark,
  nature: Mountain,
  onsen: Bath,
};

interface CategoryIconProps {
  category: CategoryId;
  className?: string;
  strokeWidth?: number;
}

export function CategoryIcon({
  category,
  className,
  strokeWidth = 1.8,
}: CategoryIconProps) {
  const Icon = ICON_MAP[category];
  if (!Icon) return null;
  return <Icon className={className} strokeWidth={strokeWidth} />;
}
