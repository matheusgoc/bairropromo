import { useEffect, useState } from 'react';

const secondsUntil = (endsAt: number) =>
  Math.max(0, Math.ceil((endsAt - Date.now()) / 1000));

/**
 * Countdown from `seconds`, started on mount. Counts against an end
 * timestamp, so it stays right after the app returns from the background.
 */
export function useCountdown(seconds: number) {
  const [endsAt, setEndsAt] = useState(() => Date.now() + seconds * 1000);
  const [remaining, setRemaining] = useState(seconds);

  useEffect(() => {
    const tick = () => {
      const left = secondsUntil(endsAt);
      setRemaining(left);
      if (left === 0) clearInterval(interval);
    };
    const interval = setInterval(tick, 1000);
    tick();
    return () => clearInterval(interval);
  }, [endsAt]);

  const restart = () => setEndsAt(Date.now() + seconds * 1000);

  return { remaining, isDone: remaining === 0, restart };
}
