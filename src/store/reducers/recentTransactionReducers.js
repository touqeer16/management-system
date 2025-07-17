import {recentTransactionActionType} from "../../constants";

export default (state = [], action) => {
    switch (action.type) {
        case recentTransactionActionType.FETCH_FINAL_TRANSACTION:
            return action.payload;
        case recentTransactionActionType.DELETE_TRANSACTION:
            return state.filter(recentTransactions => recentTransactions.id !== action.payload);
        default:
            return state;
    }
};