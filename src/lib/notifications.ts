import { toast } from 'sonner';

export const showSuccess = (message: string) => {
  toast.success(message);
};

export const showError = (message: string) => {
  toast.error(message);
};

export const showInfo = (message: string) => {
  toast(message);
};

export const showWarning = (message: string) => {
  toast.warning(message);
};

export const getErrorMessage = (error: any, fallback = 'Request failed') => {
  return (
    error?.response?.data?.details ||
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    error?.message ||
    fallback
  );
};
