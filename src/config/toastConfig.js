import {toast} from "react-toastify";

let id = 0;

const defaultOptions = {
    config: {
        autoClose: 1500,
        position: toast.POSITION.TOP_CENTER
    }
};

export default (options = {}) => {
    return { ...defaultOptions, ...options, id: id++ }
};
