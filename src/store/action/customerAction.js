import apiConfig from "../../config/apiConfig";
import {constants, customerActionType, toastType} from "../../constants";

export const createNewCustomer = (customers) => async (dispatch) => {
    await apiConfig.post('store-customer', customers)
        .then((response) => {
            dispatch({type: customerActionType.ADD_CUSTOMER_DATA, payload: response.data.data});
            dispatch({ type: constants.ADD_TOAST, payload: {text: "Customer added successfully", display: true}});
        })
        .catch(({response}) => {
            dispatch({ type: constants.ADD_TOAST, payload: {text: response.data.message, display: true}});
        });
};

export const searchCustomer = (searchId) => async (dispatch) => {
    await apiConfig.get(`search-customer?query=${searchId}`)
        .then((response) => {
            dispatch({type: customerActionType.SEARCH_CUSTOMER, payload: response.data.contacts});
        })
        .catch(({error}) => {
            console.log("error", error);
        });
};