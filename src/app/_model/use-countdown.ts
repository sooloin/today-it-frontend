import { useCallback, useEffect, useState } from 'react';

/**
 * 1초 단위로 줄어드는 카운트다운입니다. `start`를 호출하면 처음부터 다시 시작합니다.
 *
 * @param initialSeconds 시작할 남은 시간(초)
 */
export function useCountdown(initialSeconds: number) {
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    if (!isRunning || secondsLeft <= 0) {
      return;
    }

    const timeoutId = window.setTimeout(() => setSecondsLeft((seconds) => seconds - 1), 1000);

    return () => window.clearTimeout(timeoutId);
  }, [isRunning, secondsLeft]);

  const start = useCallback(() => {
    setSecondsLeft(initialSeconds);
    setIsRunning(true);
  }, [initialSeconds]);

  return { secondsLeft, isExpired: isRunning && secondsLeft <= 0, start };
}
