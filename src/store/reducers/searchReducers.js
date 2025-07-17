import {customerActionType} from "../../constants";

export default (state = [], action) => {
    switch (action.type) {
        case customerActionType.SEARCH_CUSTOMER:
            return action.payload;
        default:
            return state;
    }
}