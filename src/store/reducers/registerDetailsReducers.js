import {registerDetailsActionType} from "../../constants";

export default (state = [], action) => {
    switch (action.type) {
        case registerDetailsActionType.FETCH_REGISTER_DETAILS:
            return action.payload;
        default:
            return state;
    }
};