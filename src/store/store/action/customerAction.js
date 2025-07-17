import apiConfig from "../../config/apiConfig";
import {customerActionType} from "../../constants";

export const createNewCustomer = (customers) => async (dispatch) => {
    await apiConfig.post('store-customer', customers)
        .then((response) => {
            dispatch({type: customerActionType.ADD_CUSTOMER_DATA, payload: response.data.data});
        })
        .catch(({error}) => {
            console.log("error", error);
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