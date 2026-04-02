"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

const CHECK_INTERVAL = 60000; // Check every 60 seconds

export function DeployRefresh() {
  const router = useRouter();
  const buildId = useRef<string | null>(null);

  useEffect(() => {
    // Get initial build ID
    async function getBuildId() {
      try {
        const res = await fetch("/", { method: "HEAD" });
        return res.headers.get("x-vercel-deployment-url") || res.headers.get("x-nextjs-cache") || "";
      } catch {
        return "";
      }
    }

    getBuildId().then((id) => {
      buildId.current = id;
    });

    const interval = setInterval(async () => {
      const currentId = await getBuildId();
      if (buildId.current && currentId && currentId !== buildId.current) {
        // New deployment detected — refresh
        router.refresh();
        buildId.current = currentId;
      }
    }, CHECK_INTERVAL);

    return () => clearInterval(interval);
  }, [router]);

  return null;
}
