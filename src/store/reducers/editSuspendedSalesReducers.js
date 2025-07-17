import {suspendedSalesActionType} from "../../constants";

export default (state = [], action) => {
    switch (action.type) {
        case suspendedSalesActionType.EDIT_SUSPENDED_SALES:
            return action.payload;
        default:
            return state;
    }
};