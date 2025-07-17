import {servicemanActionType} from "../../constants";

export default (state = [], action) => {
    switch (action.type) {
        case servicemanActionType.FETCH_SERVICEMAN:
            return action.payload;
        default:
            return state;
    }
}