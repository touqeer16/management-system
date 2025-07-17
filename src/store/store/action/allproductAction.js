import apiConfig from "../../config/apiConfig";
import {apiBaseURL, productActionType} from "../../constants";

export const fetchProducts = (locationId, isFavourite = 0) => async (dispatch) => {
    let url = `get-products?location_id=${locationId}`;

    if(isFavourite === 1){
        url = url + '&is_favourite=1'
    }

    await apiConfig.get(url)
        .then((response) => {
            dispatch({ type: productActionType.FETCH_ALL_PRODUCT, payload: response.data.products});
            // dispatch({type: productActionType.FETCH_FAVORITE, payload: response.data.featured_products});
        })
        .catch(({ error }) => {
            console.log("error",error);
        });
};

export const fetchProductClickable = (categoryId, selectId) => async (dispatch) => {
    await apiConfig.get(apiBaseURL.PRODUCT + `?location_id=${selectId}&category_id=${categoryId}`)
        .then((response) => {
            dispatch({type: productActionType.FETCH_PRODUCTS_CLICKABLE, payload: response.data.products});
        })
        .catch(({error}) => {
            console.log("error", error);
        });
};

