import {productRowActionType} from "../../constants";

export default (state = [], action) => {
    switch (action.type) {
        case productRowActionType.FETCH_SINGLE_PRODUCT_ROW:
            // const latestProduct = state && state.map((state, index) => {
            //     console.log("state.product_id",state);
            //     console.log("action.payload.product_id",action.payload.product_id);
            //     if (state.product_id === action.payload.product_id) return {
            //         ...state,
            //         default_sell_price: state.default_sell_price + action.payload.default_sell_price
            //     }
            //     // return [state.default_sell_price]= state.default_sell_price + action.payload.default_sell_price
            //     return state
            // });
            return [...state, action.payload];
        case productRowActionType.DELETE_SINGLE_TODO:
            return state.filter((item, index) => index !== action.payload);
        case productRowActionType.DELETE_ALL_TODO:
            return [];
        default:
            return state;
    }
}