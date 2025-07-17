import {loginUserActionType} from "../../constants";

export default (state = [], action) => {
    switch (action.type){
        case loginUserActionType.LOGIN_USER:
            return action.payload;
        default:
            return state;
    }
}