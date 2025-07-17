
import apiConfig from "../../config/apiConfig";
import {apiBaseURL, loginUserActionType} from "../../constants";

export const fetchLoginUser = () => async (dispatch) => {
    await apiConfig.get(apiBaseURL.LOGIN_USER)
        .then((response) => {
            dispatch({type: loginUserActionType.LOGIN_USER, payload: response.data.user});
        })
        .catch(({}) => {});
};