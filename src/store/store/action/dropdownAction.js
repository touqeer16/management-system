import apiConfig from "../../config/apiConfig";
import { locationActionType } from "../../constants";

export const fetchLocation = () => async (dispatch) => {
    await apiConfig.get('get-locations')
        .then((response) => {
            dispatch({ type: locationActionType.FETCH_LOCATION, payload: response.data });
        })
        .catch(({ error }) => {
            console.log("error", error);
        });
};
