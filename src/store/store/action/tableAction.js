import apiConfig from "../../config/apiConfig";
import {tableActionType} from "../../constants";

export const fetchTableData = (locationId) => async (dispatch) => {
    await apiConfig.get(`get-tables?location_id=${locationId}`)
        .then((response) => {
            dispatch({type: tableActionType.FETCH_TABLE, payload: response.data});
        })
        .catch(({error}) => {
            console.log("error", error);
        });
};