import { useCallback, useState } from 'react';

// Hook
// Parameter is the boolean, with default "false" value
const useToggle = (initialState = false) => {
  // Initialize the state
  const [state, setState] = useState(initialState);

  const toggle = useCallback(() => setState((state) => !state), []);

  return [state, toggle];
};

export default useToggle;
