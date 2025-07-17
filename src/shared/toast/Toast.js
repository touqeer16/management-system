import React from 'react';
import PropTypes from 'prop-types';
import {ToastContainer} from 'react-toastify';

const Toast = () => {

    return (
        <ToastContainer />
    );
};

Toast.propTypes = {
    onCancel: PropTypes.func,
};

export default Toast;
