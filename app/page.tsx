"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to level 1 by default
    router.replace("/level/1");
  }, [router]);

  return null;
}
