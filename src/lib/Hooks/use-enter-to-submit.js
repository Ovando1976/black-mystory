import { useRef, useCallback } from 'react';

export function useEnterSubmit() {
  const formRef = useRef(null);

  const handleKeyDown = useCallback((event) => {
    if (
      event.key === 'Enter' &&
      !event.shiftKey &&
      !event.nativeEvent.isComposing
    ) {
      formRef.current?.requestSubmit();
      event.preventDefault();
    }
  }, []);

  return { formRef, onKeyDown: handleKeyDown };
}