import {suspendedSalesActionType} from "../../constants";

export default (state = [], action) => {
    switch (action.type) {
        case suspendedSalesActionType.FETCH_SUSPENDED_SALES:
            return action.payload;
        case suspendedSalesActionType.DELETE_SUSPENDED_SALES:
            return {...state, sales: state.sales.filter(suspendedSales => suspendedSales.id !== action.payload)}
        case suspendedSalesActionType.DELETE_ALL_SUSPENDED_SALES:
            return action.payload;
        default:
            return state;
    }
};