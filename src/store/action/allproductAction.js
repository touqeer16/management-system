import apiConfig from "../../config/apiConfig";
import db from '../../indexDb';
import { apiBaseURL, productActionType} from "../../constants";
import { setLoading } from "./progressBarAction";

export const fetchProducts = (locationId, isFavourite = 0, isLoading = true) => async (dispatch) => {
    if (isLoading) {
        dispatch(setLoading(true))
    }
    let url = `get-products?location_id=${locationId}`;

    if (isFavourite === 1) {
        url = url + '&is_favourite=1'
    }

    await apiConfig.get(url)
        .then((response) => {
            saveProductsInIndexDB(response.data.products, locationId);
            if (isLoading) {
                setTimeout(function () {
                    dispatch(setLoading(false));
                }, 5000);

            }
            setTimeout(function () {
                dispatch({ type: productActionType.FETCH_ALL_PRODUCT, payload: response.data.products });
            }, 5000);


            // dispatch({type: productActionType.FETCH_FAVORITE, payload: response.data.featured_products});
        }).catch(({ error }) => {
            // console.log("error", error);
        });
};

export const fetchProductClickable = (categoryId, selectId) => async (dispatch) => {
    await apiConfig.get(apiBaseURL.PRODUCT + `?location_id=${selectId}&category_id=${categoryId}`)
        .then((response) => {
            saveProductClickableInIndexDB(response.data.products, categoryId, selectId);
            dispatch({ type: productActionType.FETCH_PRODUCTS_CLICKABLE, payload: response.data.products });
        }).catch(({ error }) => {
            // console.log("error", error);
        });
};


export async function saveProductClickableInIndexDB(data, categoryId, selectId) {
    if (data) {
        let existingAlready = await db.productClickable.get(categoryId);
        if (existingAlready) {
            if (db.productClickable) db.productClickable.delete(categoryId);
        }
        db.productClickable.add(data, categoryId);
    }
};

export const fetchProductClickableFromIndexDB = (categoryId, selectId) => async (dispatch) => {
    if (db.productClickable) {
        // const productClickable = await db.productClickable.where('id').equals('1').toArray();
        const productClickable = await db.productClickable.get(categoryId);
        if (productClickable && productClickable.length > 0) {
            console.log("productClickable load");
            let IndexDbResponse = productClickable;
            dispatch({ type: productActionType.FETCH_PRODUCTS_CLICKABLE, payload: IndexDbResponse });
        } else {
            console.log("productClickable not load");
        }
    }
};

export async function saveProductsInIndexDB(data, locationId) {
    if (data) {
        if (db.productList) db.productList.clear();
        db.productList.add({ PrList: 'PrList', data }).then(() => { });
        prepareSingleProductInIndexDB(data, locationId);
        
    }
}

export async function prepareSingleProductInIndexDB(data, locationId) {
    let products = data;
    if (products.length !== 0) {
        products.map((product) => {
            const variationId = product.id;
            saveSingleProductInIndexDB(product, variationId);
        });
    }
    
}

export async function fetchSingleProductInIndexDB(locationId, variationId) {
    const existingAlready = await db.product.get(variationId);
    if (!existingAlready) {
        console.log("New loaded.");
        await apiConfig.get(apiBaseURL.GET_PRODUCT_ROW + `?location_id=${locationId}&variation_id=${variationId}`)
            .then((response) => {
                if (response.data.product && response.data.product.product_row) {
                    saveSingleProductInIndexDB(response.data.product, variationId);

                }
            });
    } else {
        console.log("already loaded.");
    }
};
export async function saveSingleProductInIndexDB(data, variationId) {
    if (data) {
        console.log("Single Product Saved.");
        let existingAlready = await db.product.get(variationId);
        if (existingAlready) {
            if (db.product) db.product.delete(variationId);
        }
        db.product.add(data, variationId);

    }
}

export const fetchSingleProduct = (categoryId, selectId) => async (dispatch) => {
    console.log("fetchSingleProduct", "here fetchSingleProduct");
    await apiConfig.get(apiBaseURL.PRODUCT + `?location_id=${selectId}&category_id=${categoryId}`)
        .then((response) => {
            saveProductClickableInIndexDB(response.data.products, categoryId, selectId);
        }).catch(({ error }) => {
            console.log("error", "not working single product");
        });
};

export const fetchProductsFromIndexDB = (locationId, isFavourite = 0, isLoading = true) => async (dispatch) => {
    if (db.productList) {
        const productList = await db.productList.where('PrList').equals('PrList').toArray();
        if (productList && productList.length > 0) {
            let IndexDbResponse = productList[0]['data'];
            dispatch({ type: productActionType.FETCH_ALL_PRODUCT, payload: IndexDbResponse });
        }
    }
}


