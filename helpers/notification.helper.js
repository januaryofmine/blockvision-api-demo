import get from 'lodash/get';
import { toast } from 'react-toastify';

const optionsError = {
  type: toast.TYPE.ERROR,
  autoClose: 3000,
  className: 'custom-toast__error',
  theme: 'colored',
};

const optionsSuccess = {
  type: toast.TYPE.SUCCESS,
  autoClose: 3000,
  className: 'custom-toast--success',
};

const optionsInfo = {
  type: toast.TYPE.DEFAULT,
  autoClose: 3000,
  className: 'custom-toast',
};
export const COMMON_ERROR = 'Something went wrong';

function toastErrorFunc(error, duration) {
  const options = duration
    ? { ...optionsError, autoClose: duration }
    : optionsError;
  if (typeof error === 'string') {
    return toast(error, options);
  }
  if (error.response) {
    if (!(error.response.status === 401)) {
      return toast(
        get(error.response, 'data.message') || error.message,
        options
      );
    }
  } else if (error.request) {
    return toast('Network error', options);
  }

  return toast(error.message, options);
}

function toastSuccessFunc(success, duration) {
  const options = duration
    ? { ...optionsSuccess, autoClose: duration }
    : optionsSuccess;
  if (typeof success === 'string') {
    return toast(success, options);
  }
  if (success.response) {
    return toast(
      get(success.response, 'data.message') || success.message,
      options
    );
  }
  if (success.request) {
    return toast('Network error', options);
  }
  return toast(success.message, options);
}

function toastInfoFunc(success, duration) {
  const options = duration
    ? { ...optionsInfo, autoClose: duration }
    : optionsInfo;
  if (typeof success === 'string') {
    return toast(success, options);
  }
  if (success.response) {
    return toast(
      get(success.response, 'data.message') || success.message,
      options
    );
  }
  if (success.request) {
    return toast('Network error', options);
  }
  return toast(success.message, options);
}

class ToastInstance {
  toast = null;

  toastSuccess = (message = 'SUCCESS', duration = 3000) => {
    if (!toast.isActive(this.toast)) {
      this.toast = toastSuccessFunc(message, duration);
    } else {
      toast.update(this.toast, {
        render: message,
        closeButton: null,
        autoClose: duration,
      });
    }
  };

  populateMessage = (message) => {
    try {
      if (typeof message === 'string') {
        return message;
      }
      if (typeof message?.message === 'string') {
        return message?.message;
      }
      if (message?.[0]?.message?.[0]) {
        return message?.[0]?.message?.[0];
      }
      if (message?.errorList?.length) {
        return message?.errorList?.[0]?.message;
      }
      if (message?.message?.length) {
        return message?.message?.[0]?.message?.[0] || COMMON_ERROR;
      }

      if (message?.[0]?.children?.[0]?.constraints?.arrayMinSize) {
        return message?.[0]?.children?.[0]?.constraints?.arrayMinSize;
      }
      return COMMON_ERROR;
    } catch (error) {
      return COMMON_ERROR;
    }
  };

  toastError = (message = COMMON_ERROR, duration = 3000) => {
    const mes = this.populateMessage(message) || COMMON_ERROR;
    if (!toast.isActive(this.toast)) {
      this.toast = toastErrorFunc(mes, duration);
    } else {
      toast.update(this.toast, {
        render: mes,
        closeButton: null,
        autoClose: duration,
      });
    }
  };

  toastInfo = (message = 'info', duration = 3000) => {
    if (!toast.isActive(this.toast)) {
      this.toast = toastInfoFunc(message, duration);
    } else {
      toast.update(this.toast, {
        render: message,
        closeButton: null,
        autoClose: duration,
      });
    }
  };
}

const toastSuccessInstance = new ToastInstance();
const toastErrorInstance = new ToastInstance();
const toastInfoInstance = new ToastInstance();

const { toastSuccess } = toastSuccessInstance;
const { toastError } = toastErrorInstance;
const { toastInfo } = toastInfoInstance;

export { toastSuccess, toastError, toastInfo };
