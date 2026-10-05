import { useEffect, useRef } from 'react';

import { isValidNickname } from './signup-profile';

/** 입력이 멈춘 뒤 닉네임 검사를 요청하기까지 기다리는 시간(ms) */
export const NICKNAME_CHECK_DELAY_MS = 600;

/**
 * 닉네임 입력이 멈추면 검사를 요청합니다. 클라이언트 검증을 통과한 경우에만 요청하고,
 * 입력이 다시 바뀌면 대기 중인 요청을 취소합니다.
 *
 * @param nickname 입력한 닉네임
 * @param onCheck 검사를 요청하는 함수. 앞뒤 공백을 제거한 닉네임을 받습니다.
 */
export function useNicknameCheckRequest(nickname: string, onCheck?: (nickname: string) => void) {
  const onCheckRef = useRef(onCheck);

  useEffect(() => {
    onCheckRef.current = onCheck;
  });

  useEffect(() => {
    if (nickname.trim() === '' || !isValidNickname(nickname)) {
      return;
    }

    const timeoutId = setTimeout(() => {
      onCheckRef.current?.(nickname.trim());
    }, NICKNAME_CHECK_DELAY_MS);

    return () => clearTimeout(timeoutId);
  }, [nickname]);
}
