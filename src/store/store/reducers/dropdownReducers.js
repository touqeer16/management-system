import {locationActionType} from "../../constants";

export default (state = [], action) => {
    switch (action.type){
        case locationActionType.FETCH_LOCATION:
            return action.payload;

        default:
            return state;
    }
}