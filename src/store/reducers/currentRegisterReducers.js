import {closeRegisterActionType} from "../../constants";

export default (state = [], action) => {
    switch (action.type) {
        case closeRegisterActionType.CASH_CLOSE_REGISTER:
            return action.payload;
        default:
            return state;
    }
};