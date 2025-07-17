import {customerActionType} from "../../constants";

export default (state = [], action) => {
    switch (action.type) {
        case customerActionType.ADD_CUSTOMER_DATA:
            return action.payload;
        default:
            return state;
    }
}