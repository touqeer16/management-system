import apiConfig from "../../config/apiConfig";
import { constants, suspendedProductActionType, toastType } from "../../constants";

export const suspendedProduct = (suspendedValue, cb) => async (dispatch) => {
    await apiConfig.post(`suspended-sell-note`, suspendedValue)
        .then((response) => {
            dispatch({ type: suspendedProductActionType.ADD_SUSPENDED_PRODUCT, payload: response.data.data });
            dispatch({ type: constants.ADD_TOAST, payload: { text: response.data.msg, display: true } });
            if (response.data.receipt.print) {
                cb({ status: true, receipt: true, data: response.data.receipt.print });
            } else {
                cb({ status: true, receipt: false });
            }
        })
        .catch(({ response }) => {
            cb({ status: false, receipt: false });
            dispatch({ type: constants.ADD_TOAST, payload: { text: response.data.msg, type: toastType.ERROR, display: true } });
        });
};

export const editSuspendedProduct = (suspendedValue, transactionId, cb) => async (dispatch) => {
    await apiConfig.post(`update-suspended-sell?transaction_id=${transactionId}`, suspendedValue)
        .then((response) => {
            dispatch({ type: suspendedProductActionType.ADD_SUSPENDED_PRODUCT, payload: response.data.data });
            dispatch({ type: constants.ADD_TOAST, payload: { text: response.data.msg, display: true } });
            if (response.data.receipt.print) {
                cb({ status: true, receipt: true, data: response.data.receipt.print });
            } else {
                cb({ status: true, receipt: false });
            }
        })
        .catch(({ response }) => {
            cb({ status: false, receipt: false });
            dispatch({ type: constants.ADD_TOAST, payload: { text: response.data.msg, type: toastType.ERROR, display: true } });
        });
};
