"use client";

import { useCallback, useEffect, useState } from "react";
import { dataProvider } from "@/lib/data";
import { generateId, todayISO } from "@/lib/utils";
import type { FocusSession } from "@/types";

export function useFocusSessions(userId: string | null) {
  const [sessions, setSessions] = useState<FocusSession[]>([]);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    if (!userId) {
      setSessions([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const data = await dataProvider.listFocusSessions(userId);
    setSessions(data);
    setLoading(false);
  }, [userId]);

  useEffect(() => {
    reload();
  }, [reload]);

  const registerSession = useCallback(
    async (durationMinutes: number) => {
      if (!userId) return;
      const session: FocusSession = {
        id: generateId(),
        userId,
        completedAt: new Date().toISOString(),
        durationMinutes,
      };
      setSessions((prev) => [session, ...prev]);
      await dataProvider.addFocusSession(session);
    },
    [userId]
  );

  const todayCount = sessions.filter((s) => s.completedAt.startsWith(todayISO())).length;

  return { sessions, loading, registerSession, todayCount };
}
