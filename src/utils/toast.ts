import { toast } from "react-toastify";

export const toastSuccess = (message: string) => {
  toast.success(message, {
    position: "top-center",
    autoClose: 3000,
  });
};

export const toastError = (message: string) => {
  toast.error(message, {
    position: "top-center",
    autoClose: 4000,
  });
};

export const toastInfo = (message: string) => {
  toast.info(message, {
    position: "top-center",
    autoClose: 3000,
  });
};

export const toastWarning = (message: string) => {
  toast.warn(message, {
    position: "top-center",
    autoClose: 4000,
  });
};
