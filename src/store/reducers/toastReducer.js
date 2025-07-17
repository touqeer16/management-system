import {constants} from "../../constants";

export default (state = false, action) => {
    switch (action.type) {
        case constants.ADD_TOAST:
            return action.payload;
        default:
            return state;
    }
}
