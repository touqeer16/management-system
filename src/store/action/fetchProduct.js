import apiConfig from "../../config/apiConfig";
import { apiBaseURL, constants, ServerActionType, IndexedDBActionType } from "../../constants";
import { toastType } from '../../constants';
import db from '../../indexDb';

export const fetchProduct = (locationId, variationId, cb) => async (dispatch) => {
    await apiConfig.get(apiBaseURL.GET_PRODUCT_ROW + `?location_id=${locationId}&variation_id=${variationId}`)
        .then((response) => {
            if (response.data.product && response.data.product.product_row) {
                cb({ product: response.data.product ? response.data.product : null })
                saveProductInIndexDB(response.data.product, variationId);
                // dispatch({ type: constants.ADD_TOAST, payload: { text: ServerActionType.ADD_TO_CART, type: toastType.SUCCESS, display: true } });
            } else {
                if (response.data.product.msg) {
                    saveProductInIndexDB(response.data.product.msg);
                    dispatch({ type: constants.ADD_TOAST, payload: { text: response.data.product.msg, type: toastType.ERROR, display: true } });
                } else {
                    saveProductInIndexDB(ServerActionType.PRODUCT_OUT_OF_STOCK);
                    dispatch({ type: constants.ADD_TOAST, payload: { text: ServerActionType.PRODUCT_OUT_OF_STOCK, type: toastType.ERROR, display: true } });
                }
            }
        })
        .catch(({ response }) => {
            dispatch({ type: constants.ADD_TOAST, payload: { text: ServerActionType.SERVER_NOT_WORKING, type: toastType.ERROR, display: true } });
        });
};

export async function saveProductInIndexDB(data, variationId) {
    if (data) {
        let existingAlready = await db.product.get(variationId);
        if (existingAlready) {
            if (db.product) db.product.delete(variationId);
        }
        db.product.add(data, variationId);
    }
}

export const fetchProductFromIndexDB = (locationId, variationId, cb) => async (dispatch) => {
    if (db.product) {
        // const product = await db.product.where('productkey').equals('productkey').toArray();
        const product = await db.product.get(variationId);
        //console.log(product);
        if (product) {
            // dispatch({ type: constants.ADD_TOAST, payload: { text: IndexedDBActionType.ADD_TO_CART, type: toastType.SUCCESS, display: true } });
            console.log("Load Product");
            let IndexDbResponse = product;
            cb({ product: IndexDbResponse ? IndexDbResponse : null })
        } else {
             console.log("Not Load Product");
            dispatch({ type: constants.ADD_TOAST, payload: { text: IndexedDBActionType.PRODUCT_NOT_EXIST, type: toastType.ERROR, display: true } });
        }
    }
}