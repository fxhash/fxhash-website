import React, { useCallback,useEffect } from 'react';

const useClickOutside = (
  ref: React.RefObject<HTMLElement>,
  onClickOutside: Function,
  skip: boolean
) => {
  const handleClick = useCallback((e) => {
    if (!ref?.current || ref.current.contains(e.target)) {
      // inside click
      return;
    }
    onClickOutside();
  }, [ref, onClickOutside]);
  useEffect(() => {
    if (!skip) {
      // eslint-disable-next-line no-undef
      document.addEventListener('mousedown', handleClick);
    } else {
      // eslint-disable-next-line no-undef
      document.removeEventListener('mousedown', handleClick);
    }
    return () => {
      // eslint-disable-next-line no-undef
      document.removeEventListener('mousedown', handleClick);
    };
  }, [handleClick, skip]);
};

export default useClickOutside;
