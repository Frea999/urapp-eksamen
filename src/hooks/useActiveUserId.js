import { useEffect, useState } from "react";

const LAST_USER = "ur-last-user";

export default function useActiveUserId(user, authLoading) {
  const [userId, setUserId] = useState(() => localStorage.getItem(LAST_USER));

  // Det sidste id huskes, så brugerens tema er på plads, mens login stadig tjekkes
  const authId = user ? user.id : null;
  if (!authLoading && authId !== userId) setUserId(authId);

  useEffect(() => {
    if (authLoading) return;
    if (userId) localStorage.setItem(LAST_USER, userId);
    else localStorage.removeItem(LAST_USER);
  }, [userId, authLoading]);

  return userId;
}
