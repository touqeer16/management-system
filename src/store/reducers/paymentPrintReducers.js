import {paymentActionType} from "../../constants";

export default (state = [], action) => {
    switch (action.type) {
        case paymentActionType.PAYMENT_PRINT:
            return action.payload;
        default:
            return state;
    }
}