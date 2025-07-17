import apiConfig from "../../config/apiConfig";
import { constants, suspendedSalesActionType, toastType } from "../../constants";

export const fetchSuspendedSales = () => async (dispatch) => {
    await apiConfig.get('get-suspended-sells')
        .then((response) => {
            dispatch({ type: suspendedSalesActionType.FETCH_SUSPENDED_SALES, payload: response.data });
        })
        .catch(({ response }) => {
            dispatch({ type: constants.ADD_TOAST, payload: { text: response.data.message, type: toastType.ERROR, display: true } });
        });
};


export const deleteSuspendedSales = (salesId) => async (dispatch) => {
    await apiConfig.post(`delete-suspended-sell?sell_id=${salesId}`)
        .then(() => {
            dispatch({ type: suspendedSalesActionType.DELETE_SUSPENDED_SALES, payload: salesId });
        })
        .catch(({ response }) => {
            dispatch({
                type: constants.ADD_TOAST,
                payload: { text: response.data.message, type: toastType.ERROR, display: true }
            });
        });
};

export const deleteAllSuspendedSales = (salesIds) => async (dispatch) => {
    await apiConfig.post(`delete-all-suspended-sells?value=${[salesIds]}`)
        .then(() => {
            dispatch({ type: suspendedSalesActionType.DELETE_ALL_SUSPENDED_SALES, payload: [] });
        })
        .catch(({ response }) => {
            dispatch({
                type: constants.ADD_TOAST,
                payload: { text: response.data.msg, type: toastType.ERROR, display: true }
            });
        });
};

export const editSuspendedSales = (salesId) => async (dispatch) => {
    await apiConfig.get(`edit-suspended-sell?transaction_id=${salesId}`)
        .then((response) => {
            dispatch({ type: suspendedSalesActionType.EDIT_SUSPENDED_SALES, payload: response.data });
        })
        .catch(({ response }) => {
            dispatch({
                type: constants.ADD_TOAST, payload: { text: response.data.msg, type: toastType.ERROR, display: true }
            });
        });
};