import { toast } from 'burnt';

const ToastService = {
  success: (title: string, message?: string, duration: number = 2) => {
    toast({ title, message, duration, preset: 'done', haptic: 'success' });
  },
  error: (title: string, message?: string, duration: number = 2) => {
    toast({ title, message, duration, preset: 'error', haptic: 'error' });
  },
  warn: (title: string, message?: string, duration: number = 2) => {
    toast({
      title,
      message,
      duration,
      preset: 'custom',
      haptic: 'warning',
      icon: {
        ios: {
          name: 'exclamationmark.triangle.fill',
          color: '#f09f1d',
        },
      },
    });
  },
};

export default ToastService;
