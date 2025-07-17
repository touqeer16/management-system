import {tableActionType} from "../../constants";

export default (state = [], action) => {
    switch (action.type) {
        case tableActionType.FETCH_TABLE:
            return action.payload;
        default:
            return state;
    }
}