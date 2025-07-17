import apiConfig from "../../config/apiConfig";
import {servicemanActionType} from "../../constants";

export const fetchServiceman = (locationId) => async (dispatch) => {
    await apiConfig.get(`get-service-staffs?location_id=${locationId}`)
        .then((response) => {
            dispatch({type: servicemanActionType.FETCH_SERVICEMAN, payload: response.data});
        })
        .catch(({error}) => {
            console.log("error", error);
        });
};
