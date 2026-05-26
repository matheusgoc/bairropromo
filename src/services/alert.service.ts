import { alert } from 'burnt';

const AlertService = {
  success: (title: string, message?: string, duration: number = 2) => {
    alert({ title, message, duration, preset: 'done' });
  },
  error: (title: string, message?: string, duration: number = 2) => {
    alert({ title, message, duration, preset: 'error' });
  },
  warn: (title: string, message?: string, duration: number = 2) => {
    alert({
      title,
      message,
      duration,
      preset: 'custom',
      icon: {
        ios: {
          name: 'exclamationmark.triangle.fill',
          color: '#f09f1d',
        },
      },
    });
  },
};

export default AlertService;
