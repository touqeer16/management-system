import apiConfig from "../../config/apiConfig";
import {apiBaseURL, productRowActionType} from "../../constants";

export const fetchProduct = (locationId, variationId, cb) => async (dispatch) => {
    await apiConfig.get(apiBaseURL.GET_PRODUCT_ROW + `?location_id=${locationId}&variation_id=${variationId}`)
        .then((response) => {
            if (response.data.product && response.data.product.product_row) {
                cb({product: response.data.product ? response.data.product : null})
            } else {
                cb({msg: response.data.product.msg ? response.data.product.msg : ''})
            }
        });
};

export const onDeleteTodo = (index) => async (dispatch) => {
    dispatch({type: productRowActionType.DELETE_SINGLE_TODO, payload: index})
}

export const onDeleteTodos = () => async (dispatch) => {
    dispatch({type: productRowActionType.DELETE_ALL_TODO})
}