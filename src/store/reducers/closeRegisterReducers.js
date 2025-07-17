import {closeRegisterActionType} from "../../constants";

export default (state = [], action) => {
    switch (action.type) {
        case closeRegisterActionType.FETCH_CLOSE_REGISTER:
            return action.payload;
        default:
            return state;
    }
};