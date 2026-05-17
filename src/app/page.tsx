import "@/styles/yamagata-zip-scoped.css";
import "@/styles/yamagata-zip-desktop.css";

import { YamagataZipHome } from "@/components/home/yamagata-zip-home";
import { getAllSpots, getFeaturedSpots } from "@/lib/places";

export default function HomePage() {
  return (
    <YamagataZipHome
      spots={getAllSpots()}
      featured={getFeaturedSpots(12)}
    />
  );
}
