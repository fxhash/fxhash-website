import React, { useCallback, useEffect, useState } from 'react';

interface UseHasScrollToBottomOptions {
  onScrollToBottom?: () => void,
  offsetBottom?: number,
}
const useHasScrolledToBottom = (ref: React.RefObject<HTMLElement>, options?: UseHasScrollToBottomOptions) => {
  const [atBottom, setAtBottom] = useState(false);
  const handleTrackScrolling = useCallback(() => {
    const el = ref.current;
    if (!el) return ;
    const offset = options?.offsetBottom || 0;
    const { scrollTop, scrollHeight, clientHeight } = el;
    const elScroll = scrollTop + clientHeight;
    const elBottom = scrollHeight - offset;
    if (elBottom <= elScroll) {
      options?.onScrollToBottom?.();
      setAtBottom(true)
    } else {
      setAtBottom(false);
    }
  }, [options, ref])
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    element.addEventListener('scroll', handleTrackScrolling);
    return () => {
      element.removeEventListener('scroll', handleTrackScrolling);
    }
  }, [handleTrackScrolling, ref]);
  return atBottom;
};

export default useHasScrolledToBottom;
