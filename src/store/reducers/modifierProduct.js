import {modifierProductActionType} from "../../constants";

export default (state = [], action) => {
    switch (action.type) {
        case modifierProductActionType.MODIFIER_PRODUCT:
            return action.payload;
        default:
            return state;
    }
}
