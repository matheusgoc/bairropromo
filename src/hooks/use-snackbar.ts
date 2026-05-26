import { useCallback, useState } from 'react';

import { SnackbarMode } from '@/components/ui/snackbar';

interface State {
  message: string;
  mode: SnackbarMode;
}

interface Props extends State {
  onDismiss: () => void;
}

interface Result {
  /** Trigger the toast with a message and an optional mode (defaults to 'default'). */
  showToast: (message: string, mode?: SnackbarMode) => void;
  /** Hide the toast programmatically. */
  hideToast: () => void;
  /** Spread these directly onto the <Toast /> component. */
  toastProps: Props;
}

const useSnackbar = (): Result => {
  const [state, setState] = useState<State>({
    message: '',
    mode: 'default',
  });

  const showToast = useCallback(
    (message: string, mode: SnackbarMode = 'default') => {
      setState({ message, mode });
    },
    [],
  );

  const hideToast = useCallback(() => {
    setState((prev) => ({ ...prev, message: '' }));
  }, []);

  return {
    showToast,
    hideToast,
    toastProps: { ...state, onDismiss: hideToast },
  };
};

export default useSnackbar;
