import {productActionType} from "../../constants";

export default (state = [], action) => {
    switch (action.type){
        case productActionType.FETCH_ALL_PRODUCT:
            return action.payload;
        case productActionType.FETCH_PRODUCTS_CLICKABLE:
            return action.payload;
        default:
            return state;
    }
}