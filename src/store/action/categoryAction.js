import apiConfig from "../../config/apiConfig";
import { apiBaseURL, categoryActionType } from "../../constants";
import db from '../../indexDb';

export const fetchCategory = (selectedLocationId) => async (dispatch) => {
    await apiConfig.get(apiBaseURL.CATEGORY + `?location_id=${selectedLocationId}`)
        .then((response) => {
            saveCategoryInIndexDB(response.data, selectedLocationId);
            prepareCategoryProductInIndexDB(response.data, selectedLocationId);
            dispatch({ type: categoryActionType.FETCH_CATEGORY, payload: response.data });
        })
        .catch(({ error }) => {
            console.log("error", error);
        });
};

export async function saveCategoryInIndexDB(data, selectedLocationId) {
    if (data) {
        if (db.productCategory) db.productCategory.clear();
        db.productCategory.add({ categorykey: 'categorykey', data }).then(() => { });
      
    }
}

export async function prepareCategoryProductInIndexDB(data, selectedLocationId) {
    // console.log(selectedLocationId);
    const productCategory = data.categories;
    if (productCategory.length !== 0) {
        productCategory.map((category, index) => {
            // console.log(category.id);
            const categoryId = category.id;
            const locationId = selectedLocationId;
            fetchCategoryClickable(categoryId, locationId);
        });
    }
}

export async function fetchCategoryClickable(categoryId, locationId) {
    await apiConfig.get(apiBaseURL.PRODUCT + `?location_id=${locationId}&category_id=${categoryId}`)
        .then((response) => {
            saveCategoryClickableInIndexDB(response.data.products, categoryId);
        });
}

export async function saveCategoryClickableInIndexDB(data, categoryId) {
    if (data) {
        let existingAlready = await db.productClickable.get(categoryId);
        if (existingAlready) {
            if (db.productClickable) db.productClickable.delete(categoryId);
        }
        db.productClickable.add(data, categoryId);
    }
};

export const fetchCategoryFromIndexDB = () => async (dispatch) => {
    const productCategory = await db.productCategory.where('categorykey').equals('categorykey').toArray();
    if (productCategory && productCategory.length > 0) {
        let IndexDbResponse = productCategory[0]['data'];
        dispatch({ type: categoryActionType.FETCH_CATEGORY, payload: IndexDbResponse });
    }
}