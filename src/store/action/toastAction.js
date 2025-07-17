import React from 'react';
import {constants, toastType} from '../../constants';
import toastConfig from '../../config/toastConfig';
import {toast} from "react-toastify";

const notify = (options, toastsConfig) => {
    const { type, text } = options;
    toastsConfig.config.toastId = toastsConfig.id;
    if (type === toastType.ERROR) {
        toast.error(text, toastsConfig.config);
    } else {
        toast.success(text, toastsConfig.config);
    }
};

export const addToast = (options = {}) => {
    const toastsConfig = toastConfig(options);
    notify(options, toastsConfig);
    return { type: constants.ADD_TOAST, payload: toastsConfig };
};
