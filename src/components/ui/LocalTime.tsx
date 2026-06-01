"use client";

import { useEffect, useState } from "react";

interface LocalTimeProps {
  timezone: string;
}

/**
 * Live HH:MM:SS clock in the given IANA timezone. Renders nothing until mounted
 * to avoid a server/client hydration mismatch on the time string.
 */
export function LocalTime({ timezone }: LocalTimeProps) {
  const [now, setNow] = useState<string | null>(null);

  useEffect(() => {
    let fmt: Intl.DateTimeFormat;
    const opts: Intl.DateTimeFormatOptions = {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    };
    try {
      fmt = new Intl.DateTimeFormat("en-GB", { ...opts, timeZone: timezone });
    } catch {
      fmt = new Intl.DateTimeFormat("en-GB", opts);
    }

    const tick = () => setNow(fmt.format(new Date()));
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [timezone]);

  return (
    <span className="tabular-nums" suppressHydrationWarning>
      {now ?? "--:--:--"}
    </span>
  );
}
