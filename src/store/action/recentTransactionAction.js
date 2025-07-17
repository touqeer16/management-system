import apiConfig from "../../config/apiConfig";
import { constants, recentTransactionActionType, toastType } from "../../constants";
import { setLoading } from "./progressBarAction";
import db from '../../indexDb';

export const fetchFinalTransaction = (statusId, isLoading = true) => async (dispatch) => {
    if (isLoading) {
        dispatch(setLoading(true))
    }
    await apiConfig.get(`get-recent-transactions?status=${statusId}`)
        .then((response) => {
            saveFinalTransactionFromIndexedDB(response.data.transactions);
            dispatch({ type: recentTransactionActionType.FETCH_FINAL_TRANSACTION, payload: response.data.transactions });
            if (isLoading) {
                dispatch(setLoading(false))
            }
        })
        .catch(({ response }) => {
            dispatch({
                type: constants.ADD_TOAST,
                payload: { text: response.data.message, type: toastType.ERROR, display: true }
            });
            if (isLoading) {
                dispatch(setLoading(false))
            }
        });
};

export const fetchFinalTransactionIndexPage = (statusId, isLoading = true) => async (dispatch) => {
    if (isLoading) {
        dispatch(setLoading(true))
    }
    await apiConfig.get(`get-recent-transactions?status=${statusId}`)
        .then((response) => {
            saveFinalTransactionFromIndexedDB(response.data.transactions);
            dispatch({ type: recentTransactionActionType.FETCH_FINAL_TRANSACTION, payload: response.data.transactions });
            if (isLoading) {
                // dispatch(setLoading(false))
            }
        })
        .catch(({ response }) => {
            dispatch({
                type: constants.ADD_TOAST,
                payload: { text: response.data.msg, type: toastType.ERROR, display: true }
            });
            if (isLoading) {
                // dispatch(setLoading(false))
            }
        });
};

/* export const deleteTransaction = (transactionId) => async (dispatch) => {
    await apiConfig.post(`recent-transaction-delete?transaction_id=${transactionId}`)
        .then(() => {
            dispatch({ type: recentTransactionActionType.DELETE_TRANSACTION, payload: transactionId });
        })
        .catch(({ response }) => {
            dispatch({
                type: constants.ADD_TOAST, payload: { text: response.data.msg, display: true }
            });
        });
}; */
export const deleteTransaction = (deletetransaction, cb) => async (dispatch) => {
    await apiConfig.post('recent-transaction-delete', deletetransaction)
        .then((response) => {
            dispatch({ type: recentTransactionActionType.DELETE_TRANSACTION, payload: response.data, display: true });
            cb({ status: true, data: response.data });
            if (response.data.success) {
                cb({ status: true, msg: response.data.msg });
            } else {
                cb({ status: false });
            }
        })
        .catch(({ response }) => {
            dispatch({
                type: constants.ADD_TOAST, payload: { text: response.data.msg, display: true }
            });
        });
};

export async function saveFinalTransactionFromIndexedDB(data) {
    if (data) {
        if (db.getRecentTransactions) db.getRecentTransactions.clear();
        db.getRecentTransactions.add({ recentTransactionKey: 'recentTransactionKey', data }).then(() => { });
    }
}



export const fetchFinalTransactionFromIndexedDB = (isLoading = true) => async (dispatch) => {
    if (isLoading) {
        dispatch(setLoading(true))
    }
    const getRecentTransactions = await db.getRecentTransactions.where('recentTransactionKey').equals('recentTransactionKey').toArray();
    if (getRecentTransactions && getRecentTransactions.length > 0) {
        let IndexDbResponse = getRecentTransactions[0]['data'];
        dispatch({ type: recentTransactionActionType.FETCH_FINAL_TRANSACTION, payload: IndexDbResponse });
        if (isLoading) {
            dispatch(setLoading(false))
        }
    }
}
