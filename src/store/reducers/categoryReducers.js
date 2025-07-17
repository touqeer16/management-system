import {categoryActionType} from "../../constants";

export default (state = [], action) => {
    switch (action.type) {
        case categoryActionType.FETCH_CATEGORY:
            return action.payload;
        default:
            return state;
    }
}