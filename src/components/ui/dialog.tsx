import { ComponentProps, FC, ReactNode } from 'react';
import { StyleSheet } from 'react-native';
import {
  Button,
  Dialog as PaperDialog,
  Portal,
  Text,
} from 'react-native-paper';

import useAppTheme from '@/hooks/use-app-theme';

type DialogMode = 'default' | 'success' | 'warning' | 'danger';

type ModeColors = {
  container: string;
  onContainer: string;
  accent: string;
};

const useModeColors = (mode: DialogMode): ModeColors => {
  const { colors } = useAppTheme();

  const map: Record<DialogMode, ModeColors> = {
    default: {
      container: colors.primaryContainer,
      onContainer: colors.onPrimaryContainer,
      accent: colors.primary,
    },
    success: {
      container: colors.successContainer,
      onContainer: colors.onSuccessContainer,
      accent: colors.success,
    },
    warning: {
      container: colors.warningContainer,
      onContainer: colors.onWarningContainer,
      accent: colors.warning,
    },
    danger: {
      container: colors.errorContainer,
      onContainer: colors.onErrorContainer,
      accent: colors.error,
    },
  };

  return map[mode];
};

type DialogAction = {
  label: string;
  isPrimary?: boolean;
  callback: () => void;
};

interface Props extends Omit<ComponentProps<typeof PaperDialog>, 'children'> {
  mode?: DialogMode;
  title: string;
  message: string | ReactNode;
  actions?: DialogAction[];
}

const useStyles = (colors: ModeColors) =>
  StyleSheet.create({
    dialog: {
      backgroundColor: colors.container,
    },
    title: {
      color: colors.onContainer,
    },
    message: {
      color: colors.onContainer,
    },
  });

const Dialog: FC<Props> = ({
  mode = 'default',
  title,
  message,
  actions = [],
  ...props
}) => {
  const colors = useModeColors(mode);
  const styles = useStyles(colors);

  return (
    <Portal>
      <PaperDialog style={styles.dialog} {...props}>
        <PaperDialog.Title style={styles.title}>{title}</PaperDialog.Title>
        <PaperDialog.Content>
          {typeof message === 'string' ? (
            <Text variant="bodyLarge" style={styles.message}>
              {message}
            </Text>
          ) : (
            message
          )}
        </PaperDialog.Content>

        {actions.length > 0 && (
          <PaperDialog.Actions style={{ justifyContent: 'space-between' }}>
            {actions.map(({ label, isPrimary, callback }, index) => {
              return (
                <Button
                  key={index}
                  onPress={callback}
                  mode="contained"
                  buttonColor={isPrimary ? colors.accent : undefined}
                >
                  {label}
                </Button>
              );
            })}
          </PaperDialog.Actions>
        )}
      </PaperDialog>
    </Portal>
  );
};

export default Dialog;
