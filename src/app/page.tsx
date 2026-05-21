import { YamagataZipHome } from "@/components/home/yamagata-zip-home";
import { getAllSpots, getFeaturedSpots, getTagCounts } from "@/lib/places";

export default function HomePage() {
  return (
    <YamagataZipHome
      spots={getAllSpots()}
      featured={getFeaturedSpots(12)}
      tagCounts={getTagCounts()}
    />
  );
}
