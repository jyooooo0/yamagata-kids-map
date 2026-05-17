import { Suspense } from "react";

import {
  PrototypeHome,
  PrototypeHomeFallback,
} from "@/components/home/prototype-home";
import { getAllSpots } from "@/lib/places";

export default function HomePage() {
  const spots = getAllSpots();

  return (
    <Suspense fallback={<PrototypeHomeFallback />}>
      <PrototypeHome spots={spots} />
    </Suspense>
  );
}
