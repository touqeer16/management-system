import {productActionType} from "../../constants";

export default (state = [], action) => {
    switch (action.type){
        case productActionType.FETCH_FAVORITE:
            return action.payload;
        default:
            return state;
    }
}