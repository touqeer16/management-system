import apiConfig from "../../config/apiConfig";
import {apiBaseURL, categoryActionType} from "../../constants";

export const fetchCategory = () => async (dispatch) => {
    await apiConfig.get(apiBaseURL.CATEGORY)
        .then((response) => {
            dispatch({type: categoryActionType.FETCH_CATEGORY, payload: response.data});
        })
        .catch(({error}) => {
            console.log("error", error);
        });
};